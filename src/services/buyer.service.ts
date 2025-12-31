// src/services/buyer.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreatedBuyerDtoType, BuyerResponseDtoType, CheckUsernameUniqueDtoType, ForgotPasswordDtoType, VerifyOtpForRegistrationDtoType, VerifyOtpForResetPasswordDtoType, ResetPasswordDtoType, SendEmailForRegistrationDtoType } from "@/dtos/buyer.dto.ts";
import { BuyerRepositoryInterface } from "@/interfaces/buyer.repository.interface.ts";
import { UserRepositoryInterface } from "@/interfaces/user.repository.interface.ts";
import { sendVerificationEmail } from "@/helpers/send-registration-verification-email.tsx";
import { sendResetPasswordVerificationEmail } from "@/helpers/send-reset-password-verification-email.tsx";
import { HttpError } from "@/errors/http-error.ts";


export class BuyerService {
    private buyerRepo: BuyerRepositoryInterface;
    private userRepo: UserRepositoryInterface;

    constructor(
        buyerRepo: BuyerRepositoryInterface,
        userRepo: UserRepositoryInterface
    ) {
        this.buyerRepo = buyerRepo;
        this.userRepo = userRepo;
    }

    createBuyer = async (buyerData: CreatedBuyerDtoType): Promise<BuyerResponseDtoType | null> => {
        const { fullName, email, username, contact, password, terms, role } = buyerData;

        // Check existing user
        const existingUserByEmail = await this.userRepo.findUserByEmail(email);

        // Check for existing username
        const existingBuyerByUsername = await this.buyerRepo.findBuyerByUsername(username);
        if (
            existingBuyerByUsername &&
            existingUserByEmail?.isVerified === true
        ) {
            throw new HttpError(400, "Username already exists");
        }

        // Check for existing contact number
        const existingBuyerByContact = await this.buyerRepo.findBuyerByContact(contact);
        if (existingBuyerByContact && existingUserByEmail?.isVerified === true) {
            throw new HttpError(400, "Contact already exists");
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 10); // Add 10 mins from 'now'

        let newUser;
        let buyerProfile;
        let isNewUserCreated = false;
        let isNewProfileCreated = false;

        // Check for existing email
        if (existingUserByEmail) {
            if (existingUserByEmail?.isVerified) {
                throw new HttpError(400, "Email already registered");
            }

            // Update existing unverified user
            newUser = await this.userRepo.updateUser(existingUserByEmail._id.toString(), {
                verifyCode: otp,
                verifyCodeExpiryDate: expiryDate,
                role,
            });

            if (!newUser) {
                throw new HttpError(404, "User with this id not found");
            }

            // If buyerProfile does not exist for this user, create one
            buyerProfile = await this.buyerRepo.findBuyerById(newUser._id.toString());

            if (!buyerProfile) {
                buyerProfile = await this.buyerRepo.createBuyer({
                    userId: newUser._id.toString(),
                    fullName,
                    username,
                    contact,
                    password: hashedPassword,
                    terms,
                });

                isNewProfileCreated = true;
            }
            else {
                // Update if exists
                buyerProfile = await this.buyerRepo.updateBuyer(buyerProfile._id.toString(), {
                    fullName,
                    username,
                    contact,
                    password: hashedPassword,
                    terms,
                });
            }
        }
        else {
            // Create new user
            newUser = await this.userRepo.createUser({
                email,
                role,
                isVerified: false,
                verifyCode: otp,
                verifyCodeExpiryDate: expiryDate,
                isPermanentlyBanned: false
            });

            if (!newUser) {
                throw new HttpError(404, "User with this id not found");
            }

            buyerProfile = await this.buyerRepo.createBuyer({
                userId: newUser._id.toString(),
                fullName,
                username,
                contact,
                password: hashedPassword,
                terms,
            });

            isNewUserCreated = true;
        }

        if (!buyerProfile) {
            throw new HttpError(404, "Buyer with this id not found");
        }

        // JWT Expiry Calculation in seconds for Signup Token
        const secondsInAYear = 365 * 24 * 60 * 60;
        const expiresInSeconds = Number(process.env.JWT_SIGNUP_EXPIRES_IN) * secondsInAYear;

        // Generate Token
        const token = jwt.sign(
            { _id: newUser?._id, email: newUser?.email, username: buyerProfile?.username, role: newUser?.role },
            process.env.JWT_SECRET!,
            { expiresIn: expiresInSeconds }
        );

        // Send verification email
        const emailResponse = await sendVerificationEmail(fullName, email, otp);
        if (!emailResponse.success) {
            // Rollback user creation if email sending fails
            if (isNewUserCreated) {
                await this.userRepo.deleteUser(newUser._id.toString());
                await this.buyerRepo.deleteBuyer(buyerProfile._id.toString());
            }
            else {
                // If it was an existing unverified user, clear verification fields
                newUser = await this.userRepo.updateUser(newUser._id.toString(), {
                    verifyCode: null,
                    verifyCodeExpiryDate: null,
                    role,
                });

                // If profile was updated (not new), we don't revert changes for simplicity
                if (isNewProfileCreated) {
                    await this.buyerRepo.deleteBuyer(buyerProfile._id.toString());
                }
            }
            throw new HttpError(500, emailResponse.message ?? "Failed to send verification email");
        }

        // newUser = await this.userRepo.findUserById(newUser._id.toString());
        newUser = await this.userRepo.updateUser(newUser._id.toString(), {
            buyerProfile: buyerProfile._id.toString()
        });

        if (!newUser) {
            throw new HttpError(404, "User with this id not found");
        }

        const respose: BuyerResponseDtoType = {
            success: true,
            message: "User registered successfully, please verify your email.",
            status: 201,
            token,
            user: {
                _id: buyerProfile._id.toString(),
                userId: buyerProfile.userId.toString(),
                email: newUser.email,
                isVerified: newUser.isVerified,
                fullName: buyerProfile.fullName,
                username: buyerProfile.username,
                role: newUser.role,
                isPermanentlyBanned: newUser.isPermanentlyBanned,
                createdAt: buyerProfile.createdAt,
                updatedAt: buyerProfile.updatedAt,
            }
        };
        return respose;
    };

    checkUsernameUnique = async (checkUsernameUniqueDto: CheckUsernameUniqueDtoType): Promise<BuyerResponseDtoType | null> => {
        const { username } = checkUsernameUniqueDto;
        const decodedUsername = decodeURIComponent(username);

        const existingBuyer = await this.buyerRepo.findBuyerByUsername(decodedUsername);
        if (!existingBuyer) {
            const response: BuyerResponseDtoType = {
                success: true,
                message: "Username is available",
                status: 200
            };
            return response;
        }

        const linkedUser = await this.userRepo.findUserById(existingBuyer.userId.toString());

        if (linkedUser && linkedUser.isVerified === true) {
            throw new HttpError(400, "Username is already taken!");
        }

        const response: BuyerResponseDtoType = {
            success: true,
            message: "Username is available",
            status: 200
        };
        return response;
    };

    verifyOtpForRegistration = async (verifyOtpForRegistrationDto: VerifyOtpForRegistrationDtoType): Promise<BuyerResponseDtoType> => {
        const { username, otp } = verifyOtpForRegistrationDto;

        if (!username || username.trim() === "") {
            throw new HttpError(400, "Username is required");
        }

        if (!otp || otp.trim() === "") {
            throw new HttpError(400, "OTP is required");
        }

        const decodedUsername = decodeURIComponent(username);

        const existingBuyerByUsername = await this.buyerRepo.findBuyerByUsername(decodedUsername);
        if (!existingBuyerByUsername) {
            throw new HttpError(404, "Buyer with this username does not exist.");
        }

        const existingUserById = await this.userRepo.findUserById(existingBuyerByUsername.userId.toString());
        if (!existingUserById) {
            throw new HttpError(404, "User with this id does not exist.");
        }

        if (existingUserById.isVerified) {
            throw new HttpError(400, "This account is already verified. Please login.");
        }

        if (!existingUserById.verifyCode || !existingUserById.verifyCodeExpiryDate) {
            throw new HttpError(400, "No OTP request found. Please request for a new OTP.");
        }

        if (existingUserById.verifyCode !== otp) {
            throw new HttpError(400, "Invalid OTP. Please try again.");
        }

        if (new Date() > existingUserById.verifyCodeExpiryDate) {
            throw new HttpError(400, "OTP has expired. Please request for a new OTP.");
        }

        const updatedUser = await this.userRepo.updateUser(existingUserById._id.toString(), {
            isVerified: true,
            verifyCode: null,
            verifyCodeExpiryDate: null,
        });

        if (!updatedUser) {
            throw new HttpError(404, "User is not updated and not found!");
        }

        const response: BuyerResponseDtoType = {
            success: true,
            message: "Account verified successfully. You can now login.",
            status: 200,
            user: {
                _id: existingBuyerByUsername._id.toString(),
                userId: existingBuyerByUsername.userId.toString(),
                email: updatedUser.email,
                isVerified: updatedUser.isVerified,
                fullName: existingBuyerByUsername.fullName,
                username: existingBuyerByUsername.username,
                role: updatedUser.role,
                isPermanentlyBanned: updatedUser.isPermanentlyBanned,
                createdAt: existingBuyerByUsername.createdAt,
                updatedAt: existingBuyerByUsername.updatedAt,
            }
        };
        return response;
    };

    forgotPassword = async (forgotPasswordDto: ForgotPasswordDtoType): Promise<BuyerResponseDtoType | null> => {
        const { email } = forgotPasswordDto;

        if (!email || email.trim() === "") {
            throw new HttpError(400, "Email is required");
        }

        const decodedEmail = decodeURIComponent(email);
        const user = await this.userRepo.findUserByEmail(decodedEmail);

        if (!user) {
            throw new HttpError(404, "Invalid email address. User not availabale!");
        }

        if (!user.isVerified) {
            throw new HttpError(400, "This account is not verified. Please verify your email first.");
        }

        if (!user.buyerProfile) {
            throw new HttpError(400, "Buyer profile and id not found");
        }

        const buyerProfile = await this.buyerRepo.findBuyerById(user.buyerProfile.toString());
        if (!buyerProfile) {
            throw new HttpError(404, "Buyer user not found.");
        }

        // send verfication email for reseting password
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 10);    // Add 10 mins from 'now'

        const updatedUser = await this.userRepo.updateUser(user._id.toString(), {
            verifyEmailResetPassword: otp,
            verifyEmailResetPasswordExpiryDate: expiryDate
        });

        if (!updatedUser) {
            throw new HttpError(404, "User is not updated and not availabale!");
        }

        const emailResponse = await sendResetPasswordVerificationEmail(
            buyerProfile.fullName,
            email,
            otp
        );

        if (!emailResponse.success) {
            throw new HttpError(500, emailResponse.message ?? "Failed to send verification email");
        }

        const response: BuyerResponseDtoType = {
            success: true,
            message: "Reset Password instructions have been sent to your email",
            status: 200,
            user: {
                _id: buyerProfile._id.toString(),
                userId: buyerProfile.userId.toString(),
                email: updatedUser.email,
                isVerified: updatedUser.isVerified,
                fullName: buyerProfile.fullName,
                username: buyerProfile.username,
                role: updatedUser.role,
                isPermanentlyBanned: updatedUser.isPermanentlyBanned,
                createdAt: buyerProfile.createdAt,
                updatedAt: buyerProfile.updatedAt,
            }
        };
        return response;
    };

    verifyOtpForResetpassword = async (verifyOtpForResetPasswordDto: VerifyOtpForResetPasswordDtoType): Promise<BuyerResponseDtoType> => {
        const { email, otp } = verifyOtpForResetPasswordDto;

        if (!email || email.trim() === '') {
            throw new HttpError(400, "Email is required");
        }

        if (!otp || otp.trim() === '') {
            throw new HttpError(400, "OTP is required");
        }

        const decodedEmail = decodeURIComponent(email);

        const existingUserByEmail = await this.userRepo.findUserByEmail(decodedEmail);
        if (!existingUserByEmail) {
            throw new HttpError(404, "User with this email does not exist.");
        }

        if (existingUserByEmail.isVerified) {
            throw new HttpError(400, "This account is already verified. Please login.");
        }

        if (!existingUserByEmail.verifyEmailResetPassword || !existingUserByEmail.verifyEmailResetPasswordExpiryDate) {
            throw new HttpError(400, "No OTP request found. Please request for a new OTP.");
        }

        if (existingUserByEmail.verifyEmailResetPassword !== otp) {
            throw new HttpError(400, "Invalid OTP. Please try again.");
        }

        if (new Date() > existingUserByEmail.verifyEmailResetPasswordExpiryDate) {
            throw new HttpError(400, "OTP has expired. Please request for a new OTP.");
        }

        if (!existingUserByEmail.buyerProfile) {
            throw new HttpError(400, "Buyer profile and id not found");
        }

        const buyerProfile = await this.buyerRepo.findBuyerById(existingUserByEmail.buyerProfile.toString());
        if (!buyerProfile) {
            throw new HttpError(404, "Buyer user not found.");
        }

        const response: BuyerResponseDtoType = {
            success: true,
            message: "Account verified successfully. You can now login.",
            status: 200,
            user: {
                _id: buyerProfile._id.toString(),
                userId: buyerProfile.userId.toString(),
                email: existingUserByEmail.email,
                isVerified: existingUserByEmail.isVerified,
                fullName: buyerProfile.fullName,
                username: buyerProfile.username,
                role: existingUserByEmail.role,
                isPermanentlyBanned: existingUserByEmail.isPermanentlyBanned,
                createdAt: buyerProfile.createdAt,
                updatedAt: buyerProfile.updatedAt,
            }
        };
        return response;
    };

    resetPassword = async (resetPasswordDto: ResetPasswordDtoType): Promise<BuyerResponseDtoType> => {
        const { email, newPassword } = resetPasswordDto;

        if (!email || email.trim() === "") {
            throw new HttpError(400, "Email is required");
        }

        if (!newPassword || newPassword.trim() === "") {
            throw new HttpError(400, "New password is required");
        }

        const decodedEmail = decodeURIComponent(email);

        const existingUserByEmail = await this.userRepo.findUserByEmail(decodedEmail);
        if (!existingUserByEmail) {
            throw new HttpError(404, "User with this email does not exist.");
        }

        if (!existingUserByEmail.verifyEmailResetPassword || !existingUserByEmail.verifyEmailResetPasswordExpiryDate) {
            throw new HttpError(400, "No OTP request found. Please request for a new OTP.");
        }

        if (new Date() > existingUserByEmail.verifyEmailResetPasswordExpiryDate) {
            throw new HttpError(400, "OTP has expired. Please request for a new OTP.");
        }

        if (!existingUserByEmail.buyerProfile) {
            throw new HttpError(400, "Buyer profile and id not found");
        }

        const buyerProfile = await this.buyerRepo.findBuyerById(existingUserByEmail.buyerProfile.toString());
        if (!buyerProfile) {
            throw new HttpError(404, "Buyer user not found.");
        }

        const updatedUser = await this.userRepo.updateUser(existingUserByEmail._id.toString(), {
            verifyEmailResetPassword: null,
            verifyEmailResetPasswordExpiryDate: null,
        });

        if (!updatedUser) {
            throw new HttpError(404, "User is not updated and not found!");
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedBuer = await this.buyerRepo.updateBuyer(buyerProfile._id.toString(), {
            password: hashedPassword
        });

        if (!updatedBuer) {
            throw new HttpError(404, "Buyer is not updated and not found!");
        }

        const response: BuyerResponseDtoType = {
            success: true,
            message: "Account verified successfully. You can now login.",
            status: 200,
            user: {
                _id: buyerProfile._id.toString(),
                userId: buyerProfile.userId.toString(),
                email: existingUserByEmail.email,
                isVerified: existingUserByEmail.isVerified,
                fullName: buyerProfile.fullName,
                username: buyerProfile.username,
                role: existingUserByEmail.role,
                isPermanentlyBanned: existingUserByEmail.isPermanentlyBanned,
                createdAt: buyerProfile.createdAt,
                updatedAt: buyerProfile.updatedAt,
            }
        };
        return response;
    };

    handleSendEmailForRegistration = async (sendEmailForRegistrationDto: SendEmailForRegistrationDtoType): Promise<BuyerResponseDtoType> => {
        const { email } = sendEmailForRegistrationDto;
        if (!email) {
            throw new HttpError(400, "Email is required");
        }

        const decodedEmail = decodeURIComponent(email);
        const user = await this.userRepo.findUserByEmail(decodedEmail);

        if (!user) {
            throw new HttpError(404, "User with email not found");
        }

        if (user.isVerified) {
            throw new HttpError(400, "This account is already verified. Please login.");
        }

        const buyerProfile = await this.buyerRepo.findUserById(user._id.toString());
        if (!buyerProfile) {
            throw new HttpError(404, "Buyer user not found.");
        }

        // generate 6‑digit OTP and expiry date
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 10);    // Add 10 mins from 'now'

        const updatedUser = await this.userRepo.updateUser(user._id.toString(), {
            isVerified: false,
            verifyCode: otp,
            verifyCodeExpiryDate: expiryDate
        });

        if (!updatedUser) {
            throw new HttpError(404, "User is not updated and not availabale!");
        }

        const emailResponse = await sendVerificationEmail(buyerProfile.fullName, email, otp);
        if (!emailResponse.success) {
            throw new HttpError(500, emailResponse.message ?? "Failed to send verification email. Try again later.");
        }

        const response: BuyerResponseDtoType = {
            success: true,
            message: emailResponse.message ?? "Verification email sent successfully. Please check your inbox.",
            status: 200
        };
        return response;
    };
}