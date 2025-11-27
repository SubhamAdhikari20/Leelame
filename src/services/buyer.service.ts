// src/services/buyer.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreatedBuyerDtoType, BuyerResponseDtoType } from "@/dtos/buyer.dto.ts";
import { sendVerificationEmail } from "@/helpers/send-registration-verification-email.ts";
import { BuyerRepositoryInterface } from "@/interfaces/buyer.repository.interface.ts";
import { UserRepositoryInterface } from "@/interfaces/user.repository.interface.ts";


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
            // throw new Error("Username already exists");
            const response: BuyerResponseDtoType = {
                success: true,
                message: "Username already exists",
                status: 400
            };
            return response;
        }

        // Check for existing contact number
        const existingBuyerByContact = await this.buyerRepo.findBuyerByContact(contact);
        if (existingBuyerByContact && existingUserByEmail?.isVerified === true) {
            // throw new Error("Contact already exists");
            const response: BuyerResponseDtoType = {
                success: false,
                message: "Contact already exists",
                status: 400
            };
            return response;
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
                // throw new Error("Email already registered");
                const response: BuyerResponseDtoType = {
                    success: false,
                    message: "Email already registered",
                    status: 400
                };
                return response;
            }

            // Update existing unverified user
            newUser = await this.userRepo.updateUser(existingUserByEmail._id, {
                verifyCode: otp,
                verifyCodeExpiryDate: expiryDate,
                role,
            });

            if (!newUser) {
                const response: BuyerResponseDtoType = {
                    success: false,
                    message: "User with this id not found",
                    status: 404
                }
                return response;
            }

            // If buyerProfile does not exist for this user, create one
            buyerProfile = await this.buyerRepo.findBuyerById(newUser._id);

            if (!buyerProfile) {
                buyerProfile = await this.buyerRepo.createBuyer({
                    userId: newUser._id,
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
                buyerProfile = await this.buyerRepo.updateBuyer(buyerProfile._id, {
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
                const response: BuyerResponseDtoType = {
                    success: false,
                    message: "User with this id not found",
                    status: 404
                }
                return response;
            }

            buyerProfile = await this.buyerRepo.createBuyer({
                userId: newUser._id,
                fullName,
                username,
                contact,
                password: hashedPassword,
                terms,
            });

            isNewUserCreated = true;
        }

        if (!buyerProfile) {
            const response: BuyerResponseDtoType = {
                success: false,
                message: "Buyer with this id not found",
                status: 404
            }
            return response;
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
                await this.userRepo.deleteUser(newUser._id);
                await this.buyerRepo.deleteBuyer(buyerProfile._id);
            }
            else {
                // If it was an existing unverified user, clear verification fields
                newUser = await this.userRepo.updateUser(newUser._id, {
                    verifyCode: null,
                    verifyCodeExpiryDate: null,
                    role,
                });

                // If profile was updated (not new), we don't revert changes for simplicity
                if (isNewProfileCreated) {
                    await this.buyerRepo.deleteBuyer(buyerProfile._id);
                }
            }
            // throw new Error(emailResponse.message ?? "Failed to send verification email");
            const response: BuyerResponseDtoType = {
                success: false,
                message: `${emailResponse.message ?? "Failed to send verification email"}`,
                status: 500
            };
            return response;
        }

        newUser = await this.userRepo.updateUser(newUser._id, {
            buyerProfile: buyerProfile._id,
        });

        if (!newUser) {
            const response: BuyerResponseDtoType = {
                success: false,
                message: "User with this id not found",
                status: 404
            }
            return response;
        }

        const respose: BuyerResponseDtoType = {
            success: true,
            message: "User registered successfully, please verify your email.",
            status: 201,
            token,
            user: {
                _id: buyerProfile._id,
                userId: buyerProfile.userId,
                email: newUser.email,
                isVerified: newUser.isVerified,
                fullName: buyerProfile.fullName,
                username: buyerProfile.username,
                role: newUser.role,
                isPermanentlyBanned: newUser.isPermanentlyBanned,
                createAt: buyerProfile.createdAt,
                updatedAt: buyerProfile.updatedAt,
            }
        };
        return respose;
    };
}