// src/services/auth.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { UserRepositoryInterface } from "@/interfaces/user.repository.interface.ts";
import type { BuyerRepositoryInterface } from "@/interfaces/buyer.repository.interface.ts";
import type { SellerRepositoryInterface } from "@/interfaces/seller.repository.interface.ts";
import type { AdminRepositoryInterface } from "@/interfaces/admin.repository.interface.ts";
import type { AuthResponseDtoType, LoginUserDtoType } from "@/dtos/auth.dto.ts";
import { HttpError } from "@/errors/http-error.ts";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;
const contactRegex = /^[0-9]{10}$/;

// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const usernameRegex = /^[a-zA-Z0-9]{2,20}$/;
// const contactRegex = /^[0-9]+$/;

export class AuthService {
    private userRepo: UserRepositoryInterface;
    private buyerRepo: BuyerRepositoryInterface;
    private sellerRepo: SellerRepositoryInterface;
    private adminRepo: AdminRepositoryInterface;

    constructor(userRepo: UserRepositoryInterface, buyerRepo: BuyerRepositoryInterface, sellerRepo: SellerRepositoryInterface, adminRepo: AdminRepositoryInterface) {
        this.userRepo = userRepo;
        this.buyerRepo = buyerRepo;
        this.sellerRepo = sellerRepo;
        this.adminRepo = adminRepo;
    }

    private normalizeForResponse = (baseUser: any, profile: any) => {
        return {
            _id: typeof profile?._id === "object" && profile?._id?.toString()
                ? profile._id.toString()
                : profile?._id,
            email: baseUser.email,
            role: baseUser.role ?? "buyer",
            isVerified: Boolean(baseUser.isVerified),
            baseUserId: (baseUser && (baseUser.role === "buyer")) ? (baseUser._id?.toString() ?? baseUser._id) : (baseUser && (baseUser.role === "seller")) ? (baseUser._id?.toString?.() ?? baseUser._id) : (baseUser && (baseUser.role === "admin")) ? baseUser._id?.toString() : baseUser._id,
            fullName: profile?.fullName ?? null,
            username: profile?.username ?? null,
            contact: profile?.contact ?? null,

            // profilePictureUrl: baseUser.profilePictureUrl ?? null,
            // googleId: profile?.googleId ?? null,
            // updatedAt: baseUser.updatedAt ?? null,
            // createAt: baseUser.createdAt ?? null,
            // buyerProfile: profile && baseUser.role === "buyer" ? (profile._id?.toString?.() ?? profile._id) : null,
            // sellerProfile: profile && baseUser.role === "seller" ? (profile._id?.toString?.() ?? profile._id) : null,
            // adminProfile: profile && baseUser.role === "admin" ? (profile._id?.toString?.() ?? profile._id) : null,
        };
    };

    authenticate = async (loginDto: LoginUserDtoType): Promise<AuthResponseDtoType> => {
        const { identifier, password, role } = loginDto;

        if (!role) {
            throw new HttpError(400, "User role is required!");
        }

        if (!identifier || !password) {
            throw new HttpError(400, "Missing credentails! Credentails are required!");
        }

        // 1) Admin: email-only
        if (role === "admin") {
            const isEmailFormat = emailRegex.test(identifier);

            if (!isEmailFormat) {
                throw new HttpError(400, "Invalid identifier! Identifier must be a valid email.");
            }

            const user = await this.userRepo.findUserByEmail(identifier);
            if (!user || user.role !== role) {
                throw new HttpError(404, "Invalid email! No admim found with this email.");
            }

            const adminProfile = await this.adminRepo.findAdminByBaseUserId(user._id.toString());
            if (!adminProfile) {
                throw new HttpError(404, "Admin user not found for this email.");
            }

            const hashed = adminProfile.password;
            if (!hashed) {
                throw new HttpError(400, "Password not found for admin!");
            }

            const isMatched = await bcrypt.compare(password, hashed);
            if (!isMatched) {
                throw new HttpError(400, "Invalid password! Please enter correct password.");
            }

            // JWT Expiry Calculation in seconds for Login Token (1 Day)
            const expiresInSeconds = Number(process.env.JWT_LOGIN_EXPIRES_IN) * 60 * 60;

            // Generate Token
            const token = jwt.sign(
                { _id: adminProfile._id.toString(), baseUserId: user._id.toString() ?? adminProfile.baseUserId.toString(), email: user.email, role: user.role },
                process.env.JWT_SECRET!,
                { expiresIn: expiresInSeconds }
            );

            const response: AuthResponseDtoType = {
                success: true,
                message: "Logged in as admin successfully.",
                token,
                user: this.normalizeForResponse(user, adminProfile)
            };
            return response;

        }

        // 2) Seller: email or contact
        if (role === "seller") {
            const isEmailFormat = emailRegex.test(identifier);
            const isContactFormat = contactRegex.test(identifier);

            if (!isEmailFormat && !isContactFormat) {
                throw new HttpError(400, "Invalid identifier! Identifier must be a valid email or contact.");
            }

            let user;
            let sellerProfile;
            let expiresInSeconds;
            let token;

            if (isEmailFormat) {
                user = await this.userRepo.findUserByEmail(identifier);
                if (!user || user.role !== role) {
                    throw new HttpError(404, "Invalid email! No seller account found with this email.");
                }

                sellerProfile = await this.sellerRepo.findSellerByBaseUserId(user._id.toString());
                if (!sellerProfile) {
                    throw new HttpError(404, "Seller user not found for this email.");
                }

                const hashedPassword = sellerProfile.password;
                if (!hashedPassword) {
                    throw new HttpError(400, "Password not found for seller!");
                }

                const isMatched = await bcrypt.compare(password, hashedPassword);
                if (!isMatched) {
                    throw new HttpError(400, "Invalid password! Please enter correct password.");
                }

                // JWT Expiry Calculation in seconds for Login Token (1 Day)
                expiresInSeconds = Number(process.env.JWT_LOGIN_EXPIRES_IN) * 60 * 60;

                // Generate Token
                token = jwt.sign(
                    { _id: sellerProfile._id.toString(), baseUserId: user._id.toString() ?? sellerProfile.baseUserId.toString(), email: user.email, contact: sellerProfile.contact, role: user.role },
                    process.env.JWT_SECRET!,
                    { expiresIn: expiresInSeconds }
                );

                const response: AuthResponseDtoType = {
                    success: true,
                    message: "Logged in as seller successfully.",
                    token,
                    user: this.normalizeForResponse(user, sellerProfile),
                };
                return response;
            }

            // If identifer is contact.
            sellerProfile = await this.sellerRepo.findSellerByContact(identifier);
            if (!sellerProfile) {
                throw new HttpError(404, "Invalid phone number! No buyer account found with this phone number.");
            }

            if (!sellerProfile.password) {
                throw new HttpError(400, "Password not found for seller!");
            }

            const isMatched = await bcrypt.compare(password, sellerProfile.password);
            if (!isMatched) {
                throw new HttpError(400, "Invalid password! Please enter correct password.");
            }

            // get linked user doc
            user = await this.userRepo.findUserById(sellerProfile.baseUserId.toString());
            if (!user) {
                throw new HttpError(404, "User not found!");
            }

            // JWT Expiry Calculation in seconds for Login Token (1 Day)
            expiresInSeconds = Number(process.env.JWT_LOGIN_EXPIRES_IN) * 60 * 60;

            // Generate Token
            token = jwt.sign(
                { _id: sellerProfile._id.toString(), baseUserId: user._id.toString() ?? sellerProfile.baseUserId.toString(), email: user.email, contact: sellerProfile.contact, role: user.role },
                process.env.JWT_SECRET!,
                { expiresIn: expiresInSeconds }
            );

            const response: AuthResponseDtoType = {
                success: true,
                message: "Logged in as seller successfully.",
                token,
                user: this.normalizeForResponse(user, sellerProfile)
            };
            return response;
        }

        // 3) Buyer: email OR username
        if (role === "buyer") {
            const isEmailFormat = emailRegex.test(identifier);
            const isUsernameFormat = usernameRegex.test(identifier);

            if (!isEmailFormat && !isUsernameFormat) {
                throw new HttpError(400, "Invalid identifier! Identifier must be a valid username or email.");
            }

            let user;
            let buyerProfile;
            let expiresInSeconds;
            let token;

            if (isEmailFormat) {
                user = await this.userRepo.findUserByEmail(identifier);
                if (!user || user.role !== role) {
                    throw new HttpError(404, "Invalid email! No buyer account found with this email.");
                }

                buyerProfile = await this.buyerRepo.findBuyerByBaseUserId(user._id.toString());
                if (!buyerProfile) {
                    throw new HttpError(404, "Buyer user not found for this email.");
                }

                const hashedPassword = buyerProfile.password;
                if (!hashedPassword) {
                    throw new HttpError(400, "Password not found for buyer!");
                }

                const isMatched = await bcrypt.compare(password, hashedPassword);
                if (!isMatched) {
                    throw new HttpError(400, "Invalid password! Please enter correct password.");
                }

                // JWT Expiry Calculation in seconds for Login Token (1 Day)
                expiresInSeconds = Number(process.env.JWT_LOGIN_EXPIRES_IN) * 60 * 60;

                // Generate Token
                token = jwt.sign(
                    { _id: buyerProfile._id.toString(), baseUserId: user._id.toString() ?? buyerProfile.baseUserId.toString(), email: user.email, username: buyerProfile.username, contact: buyerProfile.contact, role: user.role },
                    process.env.JWT_SECRET!,
                    { expiresIn: expiresInSeconds }
                );

                const response: AuthResponseDtoType = {
                    success: true,
                    message: "Logged in as buyer successfully.",
                    token,
                    user: this.normalizeForResponse(user, buyerProfile)
                };
                return response;
            }

            // If identifer is a username;
            buyerProfile = await this.buyerRepo.findBuyerByUsername(identifier);
            if (!buyerProfile) {
                throw new HttpError(404, "Invalid username! No buyer account found with this username.");
            }

            if (!buyerProfile.password) {
                throw new HttpError(400, "Password not found for buyer!");
            }

            const isMatched = await bcrypt.compare(password, buyerProfile.password);
            if (!isMatched) {
                throw new HttpError(400, "Invalid password! Please enter correct password.");
            }

            user = await this.userRepo.findUserById(buyerProfile.baseUserId.toString());
            if (!user) {
                throw new HttpError(404, "User not found!");
            }

            // JWT Expiry Calculation in seconds for Login Token (1 Day)
            expiresInSeconds = Number(process.env.JWT_LOGIN_EXPIRES_IN) * 60 * 60;

            // Generate Token
            token = jwt.sign(
                { _id: buyerProfile._id.toString(), baseUser: user._id.toString() ?? buyerProfile.baseUserId.toString(), email: user.email, username: buyerProfile.username, contact: buyerProfile.contact, role: user.role },
                process.env.JWT_SECRET!,
                { expiresIn: expiresInSeconds }
            );

            const response: AuthResponseDtoType = {
                success: true,
                message: "Logged in as buyer successfully.",
                token,
                user: this.normalizeForResponse(user, buyerProfile)
            };
            return response;
        }

        throw new HttpError(400, "Invalid role! Role is unknown.");
    };

    // Example for provider (Google) sign-in: find or create user/buyer profile
    findOrCreateFromProvider = async (profile: any, provider: string): Promise<AuthResponseDtoType> => {
        if (!profile || !profile.id) {
            throw new HttpError(400, "Invalid provider profile! Provider profile is not valid.");
        }

        const email = profile.email;
        if (!email) {
            // In many flows you may require email from provider, otherwise return code to ask the user for email.
            throw new HttpError(400, "Invalid provider email! Please, provide correct provider email.");
        }

        // Try existing user or buyer by email
        let user = await this.userRepo.findUserByEmail(email);
        let buyer = await this.buyerRepo.findBuyerByEmail(email);
        if (user && buyer) {
            // if buyer role and buyerProfile exists, update googleId if missing
            if (user.role === "buyer" && buyer._id) {
                const buyerProfile = await this.buyerRepo.findBuyerById(buyer._id.toString());
                if (buyerProfile && !buyerProfile.googleId) {
                    await this.buyerRepo.updateBuyer(buyerProfile._id.toString(), { googleId: profile.id });
                }
                const response: AuthResponseDtoType = {
                    success: true,
                    user: this.normalizeForResponse(user, buyerProfile),
                };
                return response;
            }

            // existing user, but not buyer or no profile: return normalized base user
            const response: AuthResponseDtoType = {
                success: true,
                user: this.normalizeForResponse(user, null),
            };
            return response;
        }

        // No user: create user & buyer profile (policy: provider users default to buyer)
        const newUser = await this.userRepo.createUser({
            email,
            isPermanentlyBanned: false,
            role: "buyer",
            isVerified: true,
        });

        if (!newUser) {
            throw new HttpError(404, "Newly created user not found.");
        }

        const newBuyer = await this.buyerRepo.createGoogleProviderBuyer({
            baseUserId: newUser._id.toString(),
            fullName: profile.name,
            profilePictureUrl: profile.picture,
            terms: true,
            googleId: profile.id,
        });

        if (!newUser) {
            throw new HttpError(404, "Newly created buyer user not found.");
        }

        const response: AuthResponseDtoType = {
            success: true,
            user: this.normalizeForResponse(newUser, newBuyer),
        };
        return response;
    };
}