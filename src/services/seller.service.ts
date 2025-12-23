// src/services/seller.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreatedSellerDtoType, SellerResponseDtoType } from "@/dtos/seller.dto.ts";
import { SellerRepositoryInterface } from "@/interfaces/seller.repository.interface.ts";
import { UserRepositoryInterface } from "@/interfaces/user.repository.interface.ts";
import { VerifyOtpForRegistrationDtoType } from "@/dtos/seller.dto.ts";
import { sendVerificationEmail } from "@/helpers/send-registration-verification-email.tsx";
import { sendResetPasswordVerificationEmail } from "@/helpers/send-reset-password-verification-email.tsx";


export class SellerService {
    private sellerRepo: SellerRepositoryInterface;
    private userRepo: UserRepositoryInterface;

    constructor(
        sellerRepo: SellerRepositoryInterface,
        userRepo: UserRepositoryInterface
    ) {
        this.sellerRepo = sellerRepo;
        this.userRepo = userRepo;
    }

    createSeller = async (sellerData: CreatedSellerDtoType): Promise<SellerResponseDtoType | null> => {
        const { fullName, contact, email, role } = sellerData;

        // Check existing user
        const existingUserByEmail = await this.userRepo.findUserByEmail(email);

        // Check for existing contact number
        const existingSellerByContact = await this.sellerRepo.findSellerByContact(contact);
        if (existingSellerByContact && existingUserByEmail?.isVerified === true) {
            const response: SellerResponseDtoType = {
                success: false,
                message: "Contact already exists",
                status: 400
            };
            return response;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 10); // Add 10 mins from 'now'

        let newUser;
        let sellerProfile;
        let isNewUserCreated = false;
        let isNewProfileCreated = false;

        // Check for existing email
        if (existingUserByEmail) {
            if (existingUserByEmail?.isVerified) {
                const response: SellerResponseDtoType = {
                    success: false,
                    message: "Email already registered",
                    status: 400
                };
                return response;
            }

            // Update existing unverified user
            newUser = await this.userRepo.updateUser(existingUserByEmail._id.toString(), {
                verifyCode: otp,
                verifyCodeExpiryDate: expiryDate,
                role,
            });

            if (!newUser) {
                const response: SellerResponseDtoType = {
                    success: false,
                    message: "User with this id not found",
                    status: 404
                };
                return response;
            }

            // If sellerProfile does not exist for this user, create one
            sellerProfile = await this.sellerRepo.findSellerById(newUser._id.toString());

            if (!sellerProfile) {
                sellerProfile = await this.sellerRepo.createSeller({
                    userId: newUser._id.toString(),
                    fullName,
                    contact,
                });

                isNewProfileCreated = true;
            }
            else {
                // Update if exists
                sellerProfile = await this.sellerRepo.updateSeller(sellerProfile._id.toString(), {
                    fullName,
                    contact,
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
                const response: SellerResponseDtoType = {
                    success: false,
                    message: "User with this id not found",
                    status: 404
                };
                return response;
            }

            sellerProfile = await this.sellerRepo.createSeller({
                userId: newUser._id.toString(),
                fullName,
                contact,
            });

            isNewUserCreated = true;
        }

        if (!sellerProfile) {
            const response: SellerResponseDtoType = {
                success: false,
                message: "Seller with this id not found",
                status: 404
            };
            return response;
        }

        // JWT Expiry Calculation in seconds for Signup Token
        const secondsInAYear = 365 * 24 * 60 * 60;
        const expiresInSeconds = Number(process.env.JWT_SIGNUP_EXPIRES_IN) * secondsInAYear;

        // Generate Token
        const token = jwt.sign(
            { _id: newUser._id, email: newUser.email, contact: sellerProfile.contact, role: newUser.role },
            process.env.JWT_SECRET!,
            { expiresIn: expiresInSeconds }
        );

        // Send verification email
        const emailResponse = await sendVerificationEmail(fullName, email, otp);
        if (!emailResponse.success) {
            // Rollback user creation if email sending fails
            if (isNewUserCreated) {
                await this.userRepo.deleteUser(newUser._id.toString());
                await this.sellerRepo.deleteSeller(sellerProfile._id.toString());
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
                    await this.sellerRepo.deleteSeller(sellerProfile._id.toString());
                }
            }
            // throw new Error(emailResponse.message ?? "Failed to send verification email");
            const response: SellerResponseDtoType = {
                success: false,
                message: emailResponse.message ?? "Failed to send verification email",
                status: 500
            };
            return response;
        }

        // newUser = await this.userRepo.findUserById(newUser._id.toString());
        newUser = await this.userRepo.updateUser(newUser._id.toString(), {
            sellerProfile: sellerProfile._id.toString()
        });

        if (!newUser) {
            const response: SellerResponseDtoType = {
                success: false,
                message: "User with this id not found",
                status: 404
            };
            return response;
        }

        const respose: SellerResponseDtoType = {
            success: true,
            message: "User registered successfully, please verify your email.",
            status: 201,
            token,
            user: {
                _id: sellerProfile._id.toString(),
                userId: sellerProfile.userId.toString(),
                email: newUser.email,
                isVerified: newUser.isVerified,
                fullName: sellerProfile.fullName,
                role: newUser.role,
                isPermanentlyBanned: newUser.isPermanentlyBanned,
                createdAt: sellerProfile.createdAt,
                updatedAt: sellerProfile.updatedAt,
            }
        };
        return respose;
    };

    verifyOtpForRegistration = async (verifyOtpForRegistrationDto: VerifyOtpForRegistrationDtoType): Promise<SellerResponseDtoType> => {
        const { email, password, otp } = verifyOtpForRegistrationDto;

        if (!email || email.trim() === "") {
            const response: SellerResponseDtoType = {
                success: false,
                message: "Email is required",
                status: 400
            };
            return response;
        }

        if (!otp || otp.trim() === "") {
            const response: SellerResponseDtoType = {
                success: false,
                message: "OTP is required",
                status: 400
            };
            return response;
        }

        const decodedEmail = decodeURIComponent(email);
        const existingUserByEmail = await this.userRepo.findUserByEmail(decodedEmail);
        if (!existingUserByEmail) {
            const response: SellerResponseDtoType = {
                success: false,
                message: "User with this email does not exist.",
                status: 404
            };
            return response;
        }

        if (existingUserByEmail.isVerified) {
            const response: SellerResponseDtoType = {
                success: false,
                message: "This account is already verified. Please login.",
                status: 400
            };
            return response;
        }

        if (!existingUserByEmail.verifyCode || !existingUserByEmail.verifyCodeExpiryDate) {
            const response: SellerResponseDtoType = {
                success: false,
                message: "No OTP request found. Please request for a new OTP.",
                status: 400
            };
            return response;
        }

        if (existingUserByEmail.verifyCode !== otp) {
            const response: SellerResponseDtoType = {
                success: false,
                message: "Invalid OTP. Please try again.",
                status: 400
            };
            return response;
        }

        if (new Date() > existingUserByEmail.verifyCodeExpiryDate) {
            const response: SellerResponseDtoType = {
                success: false,
                message: "OTP has expired. Please request for a new OTP.",
                status: 400
            };
            return response;
        }

        const updatedUser = await this.userRepo.updateUser(existingUserByEmail._id.toString(), {
            isVerified: true,
            verifyCode: null,
            verifyCodeExpiryDate: null,
        });

        if (!updatedUser) {
            const response: SellerResponseDtoType = {
                success: false,
                message: "User is not updated and not found!",
                status: 404
            };
            return response;
        }

        if (!existingUserByEmail.buyerProfile) {
            const response: SellerResponseDtoType = {
                success: false,
                message: "Seller profile and id not found",
                status: 400
            };
            return response;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updatedSeller = await this.sellerRepo.updateSeller(existingUserByEmail.buyerProfile.toString(), {
            password: hashedPassword
        });

        if (!updatedSeller) {
            const response: SellerResponseDtoType = {
                success: false,
                message: "Seller is not updated and not availabale!",
                status: 404
            };
            return response;
        }

        const response: SellerResponseDtoType = {
            success: true,
            message: "Account verified successfully. You can now login.",
            status: 200,
            user: {
                _id: updatedSeller._id.toString(),
                userId: updatedSeller.userId.toString(),
                email: updatedUser.email,
                isVerified: updatedUser.isVerified,
                fullName: updatedSeller.fullName,
                role: updatedUser.role,
                isPermanentlyBanned: updatedUser.isPermanentlyBanned,
                createdAt: updatedSeller.createdAt,
                updatedAt: updatedSeller.updatedAt,
            }
        };
        return response;
    };


}