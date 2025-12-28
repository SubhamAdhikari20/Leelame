// src/services/admin.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreatedAdminDtoType, AdminResponseDtoType, VerifyOtpForRegistrationDtoType } from "@/dtos/admin.dto.ts";
import { AdminRepositoryInterface } from "@/interfaces/admin.repository.interface.ts";
import { UserRepositoryInterface } from "@/interfaces/user.repository.interface.ts";
import { sendVerificationEmail } from "@/helpers/send-registration-verification-email.tsx";
import { sendResetPasswordVerificationEmail } from "@/helpers/send-reset-password-verification-email.tsx";


export class AdminService {
    private adminRepo: AdminRepositoryInterface;
    private userRepo: UserRepositoryInterface;

    constructor(
        adminRepo: AdminRepositoryInterface,
        userRepo: UserRepositoryInterface
    ) {
        this.adminRepo = adminRepo;
        this.userRepo = userRepo;
    }

    createAdmin = async (adminData: CreatedAdminDtoType): Promise<AdminResponseDtoType | null> => {
        const { fullName, email, contact, password, role } = adminData;

        // Check existing user
        const existingUserByEmail = await this.userRepo.findUserByEmail(email);

        // Check for existing contact number
        const existingAdminByContact = await this.adminRepo.findAdminByContact(contact);
        if (existingAdminByContact && existingUserByEmail?.isVerified === true) {
            // throw new Error("Contact already exists");
            const response: AdminResponseDtoType = {
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
        let adminProfile;
        let isNewUserCreated = false;
        let isNewProfileCreated = false;

        // Check for existing email
        if (existingUserByEmail) {
            if (existingUserByEmail?.isVerified) {
                // throw new Error("Email already registered");
                const response: AdminResponseDtoType = {
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
                const response: AdminResponseDtoType = {
                    success: false,
                    message: "User with this id not found",
                    status: 404
                };
                return response;
            }

            // If adminProfile does not exist for this user, create one
            adminProfile = await this.adminRepo.findAdminById(newUser._id.toString());

            if (!adminProfile) {
                adminProfile = await this.adminRepo.createAdmin({
                    userId: newUser._id.toString(),
                    fullName,
                    contact,
                    password: hashedPassword,
                });

                isNewProfileCreated = true;
            }
            else {
                // Update if exists
                adminProfile = await this.adminRepo.updateAdmin(adminProfile._id.toString(), {
                    fullName,
                    contact,
                    password: hashedPassword,
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
                const response: AdminResponseDtoType = {
                    success: false,
                    message: "User with this id not found",
                    status: 404
                };
                return response;
            }

            adminProfile = await this.adminRepo.createAdmin({
                userId: newUser._id.toString(),
                fullName,
                contact,
                password: hashedPassword,
            });

            isNewUserCreated = true;
        }

        if (!adminProfile) {
            const response: AdminResponseDtoType = {
                success: false,
                message: "Admin with this id not found",
                status: 404
            };
            return response;
        }

        // JWT Expiry Calculation in seconds for Signup Token
        const secondsInAYear = 365 * 24 * 60 * 60;
        const expiresInSeconds = Number(process.env.JWT_SIGNUP_EXPIRES_IN) * secondsInAYear;

        // Generate Token
        const token = jwt.sign(
            { _id: newUser?._id, email: newUser?.email, contact: adminProfile?.contact, role: newUser?.role },
            process.env.JWT_SECRET!,
            { expiresIn: expiresInSeconds }
        );

        // Send verification email
        const emailResponse = await sendVerificationEmail(fullName, email, otp);
        if (!emailResponse.success) {
            // Rollback user creation if email sending fails
            if (isNewUserCreated) {
                await this.userRepo.deleteUser(newUser._id.toString());
                await this.adminRepo.deleteAdmin(adminProfile._id.toString());
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
                    await this.adminRepo.deleteAdmin(adminProfile._id.toString());
                }
            }
            // throw new Error(emailResponse.message ?? "Failed to send verification email");
            const response: AdminResponseDtoType = {
                success: false,
                message: emailResponse.message ?? "Failed to send verification email",
                status: 500
            };
            return response;
        }

        // newUser = await this.userRepo.findUserById(newUser._id.toString());
        newUser = await this.userRepo.updateUser(newUser._id.toString(), {
            adminProfile: adminProfile._id.toString()
        });

        if (!newUser) {
            const response: AdminResponseDtoType = {
                success: false,
                message: "User with this id not found",
                status: 404
            };
            return response;
        }

        const respose: AdminResponseDtoType = {
            success: true,
            message: "User registered successfully, please verify your email.",
            status: 201,
            token,
            user: {
                _id: adminProfile._id.toString(),
                userId: adminProfile.userId.toString(),
                email: newUser.email,
                isVerified: newUser.isVerified,
                fullName: adminProfile.fullName,
                role: newUser.role,
                isPermanentlyBanned: newUser.isPermanentlyBanned,
                createdAt: adminProfile.createdAt,
                updatedAt: adminProfile.updatedAt,
            }
        };
        return respose;
    };

    verifyOtpForRegistration = async (verifyOtpForRegistrationDto: VerifyOtpForRegistrationDtoType): Promise<AdminResponseDtoType> => {
        const { email, password, otp } = verifyOtpForRegistrationDto;

        if (!email || email.trim() === "") {
            const response: AdminResponseDtoType = {
                success: false,
                message: "Email is required",
                status: 400
            };
            return response;
        }

        if (!otp || otp.trim() === "") {
            const response: AdminResponseDtoType = {
                success: false,
                message: "OTP is required",
                status: 400
            };
            return response;
        }

        const decodedEmail = decodeURIComponent(email);
        const existingUserByEmail = await this.userRepo.findUserByEmail(decodedEmail);
        if (!existingUserByEmail) {
            const response: AdminResponseDtoType = {
                success: false,
                message: "User with this email does not exist.",
                status: 404
            };
            return response;
        }

        if (existingUserByEmail.isVerified) {
            const response: AdminResponseDtoType = {
                success: false,
                message: "This account is already verified. Please login.",
                status: 400
            };
            return response;
        }

        if (!existingUserByEmail.verifyCode || !existingUserByEmail.verifyCodeExpiryDate) {
            const response: AdminResponseDtoType = {
                success: false,
                message: "No OTP request found. Please request for a new OTP.",
                status: 400
            };
            return response;
        }

        if (existingUserByEmail.verifyCode !== otp) {
            const response: AdminResponseDtoType = {
                success: false,
                message: "Invalid OTP. Please try again.",
                status: 400
            };
            return response;
        }

        if (new Date() > existingUserByEmail.verifyCodeExpiryDate) {
            const response: AdminResponseDtoType = {
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
            const response: AdminResponseDtoType = {
                success: false,
                message: "User is not updated and not found!",
                status: 404
            };
            return response;
        }

        if (!existingUserByEmail.buyerProfile) {
            const response: AdminResponseDtoType = {
                success: false,
                message: "Admin profile and id not found",
                status: 400
            };
            return response;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updatedAdmin = await this.adminRepo.updateAdmin(existingUserByEmail.buyerProfile.toString(), {
            password: hashedPassword
        });

        if (!updatedAdmin) {
            const response: AdminResponseDtoType = {
                success: false,
                message: "Admin is not updated and not availabale!",
                status: 404
            };
            return response;
        }

        const response: AdminResponseDtoType = {
            success: true,
            message: "Account verified successfully. You can now login.",
            status: 200,
            user: {
                _id: updatedAdmin._id.toString(),
                userId: updatedAdmin.userId.toString(),
                email: updatedUser.email,
                isVerified: updatedUser.isVerified,
                fullName: updatedAdmin.fullName,
                role: updatedUser.role,
                isPermanentlyBanned: updatedUser.isPermanentlyBanned,
                createdAt: updatedAdmin.createdAt,
                updatedAt: updatedAdmin.updatedAt,
            }
        };
        return response;
    };

    // forgotPassword = async (forgotPasswordDto: ForgotPasswordDtoType): Promise<AdminResponseDtoType | null> => {
    //     const { email } = forgotPasswordDto;

    //     if (!email || email.trim() === "") {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "Email is required",
    //             status: 400
    //         };
    //         return response;
    //     }

    //     const decodedEmail = decodeURIComponent(email);

    //     const user = await this.userRepo.findUserByEmail(decodedEmail);

    //     if (!user) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "Invalid email address. User not availabale!",
    //             status: 404
    //         };
    //         return response;
    //     }

    //     if (!user.isVerified) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "This account is not verified. Please verify your email first.",
    //             status: 400
    //         };
    //         return response;
    //     }

    //     if (!user.adminProfile) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "Admin profile and id not found",
    //             status: 400
    //         };
    //         return response;
    //     }

    //     const adminProfile = await this.adminRepo.findAdminById(user.adminProfile.toString());

    //     if (!adminProfile) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "Admin user not found.",
    //             status: 404
    //         };
    //         return response;
    //     }

    //     // send verfication email for reseting password
    //     const otp = Math.floor(100000 + Math.random() * 900000).toString();
    //     const expiryDate = new Date();
    //     expiryDate.setMinutes(expiryDate.getMinutes() + 10);    // Add 10 mins from 'now'

    //     const updatedUser = await this.userRepo.updateUser(user._id.toString(), {
    //         verifyEmailResetPassword: otp,
    //         verifyEmailResetPasswordExpiryDate: expiryDate
    //     });

    //     if (!updatedUser) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "User is not updated and not availabale!",
    //             status: 404
    //         };
    //         return response;
    //     }

    //     const emailResponse = await sendResetPasswordVerificationEmail(
    //         adminProfile.fullName,
    //         email,
    //         otp
    //     );

    //     if (!emailResponse.success) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: emailResponse.message ?? "Failed to send verification email",
    //             status: 500
    //         };
    //         return response;
    //     }

    //     const response: AdminResponseDtoType = {
    //         success: true,
    //         message: "Reset Password instructions have been sent to your email",
    //         status: 200,
    //         user: {
    //             _id: adminProfile._id.toString(),
    //             userId: adminProfile.userId.toString(),
    //             email: updatedUser.email,
    //             isVerified: updatedUser.isVerified,
    //             fullName: adminProfile.fullName,
    //             role: updatedUser.role,
    //             isPermanentlyBanned: updatedUser.isPermanentlyBanned,
    //             createdAt: adminProfile.createdAt,
    //             updatedAt: adminProfile.updatedAt,
    //         }
    //     };
    //     return response;
    // };

    // verifyOtpForResetpassword = async (verifyOtpForResetPasswordDto: VerifyOtpForResetPasswordDtoType): Promise<AdminResponseDtoType> => {
    //     const { email, otp } = verifyOtpForResetPasswordDto;

    //     if (!email || email.trim() === '') {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "Email is required",
    //             status: 400
    //         };
    //         return response;
    //     }

    //     if (!otp || otp.trim() === '') {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "OTP is required",
    //             status: 400
    //         };
    //         return response;
    //     }

    //     const decodedEmail = decodeURIComponent(email);

    //     const existingUserByEmail = await this.userRepo.findUserByEmail(decodedEmail);
    //     if (!existingUserByEmail) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "User with this email does not exist.",
    //             status: 404
    //         };
    //         return response;
    //     }

    //     if (existingUserByEmail.isVerified) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "This account is already verified. Please login.",
    //             status: 400
    //         };
    //         return response;
    //     }

    //     if (!existingUserByEmail.verifyEmailResetPassword || !existingUserByEmail.verifyEmailResetPasswordExpiryDate) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "No OTP request found. Please request for a new OTP.",
    //             status: 400
    //         };
    //         return response;
    //     }

    //     if (existingUserByEmail.verifyEmailResetPassword !== otp) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "Invalid OTP. Please try again.",
    //             status: 400
    //         };
    //         return response;
    //     }

    //     if (new Date() > existingUserByEmail.verifyEmailResetPasswordExpiryDate) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "OTP has expired. Please request for a new OTP.",
    //             status: 400
    //         };
    //         return response;
    //     }

    //     if (!existingUserByEmail.adminProfile) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "OTP has expired. Please request for a new OTP.",
    //             status: 400
    //         };
    //         return response;
    //     }

    //     const adminProfile = await this.adminRepo.findAdminById(existingUserByEmail.adminProfile.toString());
    //     if (!adminProfile) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "Admin user not found.",
    //             status: 404
    //         };
    //         return response;
    //     }

    //     const response: AdminResponseDtoType = {
    //         success: true,
    //         message: "Account verified successfully. You can now login.",
    //         status: 200,
    //         user: {
    //             _id: adminProfile._id.toString(),
    //             userId: adminProfile.userId.toString(),
    //             email: existingUserByEmail.email,
    //             isVerified: existingUserByEmail.isVerified,
    //             fullName: adminProfile.fullName,
    //             role: existingUserByEmail.role,
    //             isPermanentlyBanned: existingUserByEmail.isPermanentlyBanned,
    //             createdAt: adminProfile.createdAt,
    //             updatedAt: adminProfile.updatedAt,
    //         }
    //     };
    //     return response;
    // };

    // resetPassword = async (resetPasswordDto: ResetPasswordDtoType): Promise<AdminResponseDtoType> => {
    //     const { email, newPassword } = resetPasswordDto;

    //     if (!email || email.trim() === "") {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "Email is required",
    //             status: 400
    //         };
    //         return response;
    //     }

    //     if (!newPassword || newPassword.trim() === "") {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "New password is required",
    //             status: 400
    //         };
    //         return response;
    //     }

    //     const decodedEmail = decodeURIComponent(email);

    //     const existingUserByEmail = await this.userRepo.findUserByEmail(decodedEmail);
    //     if (!existingUserByEmail) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "User with this email does not exist.",
    //             status: 404
    //         };
    //         return response;
    //     }

    //     if (!existingUserByEmail.verifyEmailResetPassword || !existingUserByEmail.verifyEmailResetPasswordExpiryDate) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "No OTP request found. Please request for a new OTP.",
    //             status: 400
    //         };
    //         return response;
    //     }

    //     if (new Date() > existingUserByEmail.verifyEmailResetPasswordExpiryDate) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "OTP has expired. Please request for a new OTP.",
    //             status: 400
    //         };
    //         return response;
    //     }

    //     if (!existingUserByEmail.adminProfile) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "OTP has expired. Please request for a new OTP.",
    //             status: 400
    //         };
    //         return response;
    //     }

    //     const adminProfile = await this.adminRepo.findAdminById(existingUserByEmail.adminProfile.toString());
    //     if (!adminProfile) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "Admin user not found.",
    //             status: 404
    //         };
    //         return response;
    //     }

    //     const updatedUser = await this.userRepo.updateUser(existingUserByEmail._id.toString(), {
    //         verifyEmailResetPassword: null,
    //         verifyEmailResetPasswordExpiryDate: null,
    //     });

    //     if (!updatedUser) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "User is not updated and not found!",
    //             status: 404
    //         };
    //         return response;
    //     }

    //     const salt = bcrypt.genSaltSync(10);
    //     const hashedPassword = await bcrypt.hash(newPassword, salt);

    //     const updatedBuer = await this.adminRepo.updateAdmin(adminProfile._id.toString(), {
    //         password: hashedPassword
    //     });

    //     if (!updatedBuer) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "Admin is not updated and not found!",
    //             status: 404
    //         };
    //         return response;
    //     }

    //     const response: AdminResponseDtoType = {
    //         success: true,
    //         message: "Account verified successfully. You can now login.",
    //         status: 200,
    //         user: {
    //             _id: adminProfile._id.toString(),
    //             userId: adminProfile.userId.toString(),
    //             email: existingUserByEmail.email,
    //             isVerified: existingUserByEmail.isVerified,
    //             fullName: adminProfile.fullName,
    //             role: existingUserByEmail.role,
    //             isPermanentlyBanned: existingUserByEmail.isPermanentlyBanned,
    //             createdAt: adminProfile.createdAt,
    //             updatedAt: adminProfile.updatedAt,
    //         }
    //     };
    //     return response;
    // };

    // handleSendEmailForRegistration = async (sendEmailForRegistrationDto: SendEmailForRegistrationDtoType): Promise<AdminResponseDtoType> => {
    //     const { email } = sendEmailForRegistrationDto;
    //     if (!email) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "Email is required",
    //             status: 400
    //         };
    //         return response;
    //     }

    //     const decodedEmail = decodeURIComponent(email);
    //     const user = await this.userRepo.findUserByEmail(decodedEmail);

    //     if (!user) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "User with email not found",
    //             status: 404
    //         };
    //         return response;
    //     }

    //     if (user.isVerified) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "This account is already verified. Please login.",
    //             status: 400
    //         };
    //         return response;
    //     }

    //     const adminProfile = await this.adminRepo.findUserById(user._id.toString());

    //     if (!adminProfile) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "Admin user not found.",
    //             status: 404
    //         };
    //         return response;
    //     }

    //     // generate 6‑digit OTP and expiry date
    //     const otp = Math.floor(100000 + Math.random() * 900000).toString();
    //     const expiryDate = new Date();
    //     expiryDate.setMinutes(expiryDate.getMinutes() + 10);    // Add 10 mins from 'now'

    //     const updatedUser = await this.userRepo.updateUser(user._id.toString(), {
    //         isVerified: false,
    //         verifyCode: otp,
    //         verifyCodeExpiryDate: expiryDate
    //     });

    //     if (!updatedUser) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: "User is not updated and not availabale!",
    //             status: 404
    //         };
    //         return response;
    //     }

    //     const emailResponse = await sendVerificationEmail(adminProfile.fullName, email, otp);
    //     if (!emailResponse.success) {
    //         const response: AdminResponseDtoType = {
    //             success: false,
    //             message: emailResponse.message ?? "Failed to send verification email. Try again later.",
    //             status: 500
    //         };
    //         return response;
    //     }

    //     const response: AdminResponseDtoType = {
    //         success: true,
    //         message: emailResponse.message ?? "Verification email sent successfully. Please check your inbox.",
    //         status: 500
    //     };
    //     return response;
    // };
}