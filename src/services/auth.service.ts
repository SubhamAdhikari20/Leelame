// src/services/auth.service.ts
import bcrypt from "bcryptjs";
import { UserRepositoryInterface } from "@/interfaces/user.repository.interface.ts";
import { BuyerRepositoryInterface } from "@/interfaces/buyer.repository.interface.ts";
import { SellerRepositoryInterface } from "@/interfaces/seller.repository.interface.ts";
import { AdminRepositoryInterface } from "@/interfaces/admin.repository.interface.ts";
import { AuthResponseDtoType, LoginUserDtoType } from "@/dtos/auth.dto.ts";
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

    private normalizeForResponse = (baseUser: any, profile: any = null) => {
        return {
            _id: typeof baseUser?._id === "object" && baseUser?._id?.toString
                ? baseUser._id.toString()
                : baseUser?._id,
            email: baseUser.email ?? null,
            role: baseUser.role ?? "buyer",
            isVerified: Boolean(baseUser.isVerified),
            fullName: profile?.fullName ?? null,
            username: profile?.username ?? null,
            contact: profile?.contact ?? null,
            googleId: profile?.googleId ?? null,
            profilePictureUrl: baseUser.profilePictureUrl ?? null,
            buyerProfile: profile && baseUser.role === "buyer" ? (profile._id?.toString?.() ?? profile._id) : null,
            sellerProfile: profile && baseUser.role === "seller" ? (profile._id?.toString?.() ?? profile._id) : null,
            adminProfile: profile && baseUser.role === "admin" ? (profile._id?.toString?.() ?? profile._id) : null,
            createAt: baseUser.createdAt ?? null,
            updatedAt: baseUser.updatedAt ?? null,
        };
    };

    authenticate = async (loginDto: LoginUserDtoType): Promise<AuthResponseDtoType> => {
        const { identifier, password, role } = loginDto;

        if (!role) {
            throw new HttpError(400, "User role is required!");
        }

        if (!identifier || !password) {
            throw new HttpError(400, "Missing credentails! Credentails are required!");
            // throw new Error("MISSING_CREDENTIALS");
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
                // throw new Error("ADMIN_NOT_FOUND");
            }

            const adminProfile = await this.adminRepo.findUserById(user._id.toString());
            if (!adminProfile) {
                throw new HttpError(404, "Admin user not found for this email.");
                // throw new Error("ADMIN_NOT_FOUND");
            }

            const hashed = adminProfile.password;
            if (!hashed) {
                throw new HttpError(400, "Password not found for admin!");
                // throw new Error("ADMIN_NO_PASSWORD");
            }

            const isMatched = await bcrypt.compare(password, hashed);
            if (!isMatched) {
                throw new HttpError(400, "Invalid password! Please enter correct password.");
                // throw new Error("INVALID_PASSWORD");
            }

            const response: AuthResponseDtoType = {
                success: true,
                message: "Logged in as admin successfully.",
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

            if (isEmailFormat) {
                user = await this.userRepo.findUserByEmail(identifier);
                if (!user || user.role !== role) {
                    throw new HttpError(404, "Invalid email! No seller account found with this email.");
                    // throw new Error("USER_NOT_FOUND");
                }

                sellerProfile = await this.sellerRepo.findUserById(user._id.toString());
                if (!sellerProfile) {
                    throw new HttpError(404, "Seller user not found for this email.");
                    // throw new Error("SELLER_NOT_FOUND");
                }

                const hashedPassword = sellerProfile.password;
                if (!hashedPassword) {
                    throw new HttpError(400, "Password not found for seller!");
                    // throw new Error("SELLER_NO_PASSWORD");
                }

                const isMatched = await bcrypt.compare(password, hashedPassword);
                if (!isMatched) {
                    throw new HttpError(400, "Invalid password! Please enter correct password.");
                    // throw new Error("INVALID_PASSWORD");
                }

                const response: AuthResponseDtoType = {
                    success: true,
                    message: "Logged in as seller successfully.",
                    user: this.normalizeForResponse(user, sellerProfile)
                };
                return response;
            }

            // If identifer is contact.
            sellerProfile = await this.sellerRepo.findSellerByContact(identifier);
            if (!sellerProfile) {
                throw new HttpError(404, "Invalid phone number! No buyer account found with this phone number.");
                // throw new Error("SELLER_NOT_FOUND");
            }

            if (!sellerProfile.password) {
                throw new HttpError(400, "Password not found for seller!");
                // throw new Error("SELLER_NO_PASSWORD");
            }

            const isMatched = await bcrypt.compare(password, sellerProfile.password);
            if (!isMatched) {
                throw new HttpError(400, "Invalid password! Please enter correct password.");
                // throw new Error("INVALID_PASSWORD");
            }

            // get linked user doc
            user = await this.userRepo.findUserById(sellerProfile.userId.toString());
            if (!user) {
                throw new HttpError(404, "User not found!");
                // throw new Error("USER_NOT_FOUND");
            }

            const response: AuthResponseDtoType = {
                success: true,
                message: "Logged in as seller successfully.",
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

            if (isEmailFormat) {
                user = await this.userRepo.findUserByEmail(identifier);
                if (!user || user.role !== role) {
                    throw new HttpError(404, "Invalid email! No buyer account found with this email.");
                    // throw new Error("USER_NOT_FOUND");
                }

                buyerProfile = await this.buyerRepo.findUserById(user._id.toString());
                if (!buyerProfile) {
                    throw new HttpError(404, "Buyer user not found for this email.");
                    // throw new Error("BUYER_NOT_FOUND");
                }

                const hashedPassword = buyerProfile.password;
                if (!hashedPassword) {
                    throw new HttpError(400, "Password not found for buyer!");
                    // throw new Error("BUYER_NO_PASSWORD");
                }

                const isMatched = await bcrypt.compare(password, hashedPassword);
                if (!isMatched) {
                    throw new HttpError(400, "Invalid password! Please enter correct password.");
                    // throw new Error("INVALID_PASSWORD");
                }

                const response: AuthResponseDtoType = {
                    success: true,
                    message: "Logged in as buyer successfully.",
                    user: this.normalizeForResponse(user, buyerProfile)
                };
                return response;
            }

            // If identifer is a username;
            buyerProfile = await this.buyerRepo.findBuyerByUsername(identifier);
            if (!buyerProfile) {
                throw new HttpError(404, "Invalid username! No buyer account found with this username.");
                // throw new Error("BUYER_NOT_FOUND");
            }

            if (!buyerProfile.password) {
                throw new HttpError(400, "Password not found for buyer!");
                // throw new Error("BUYER_NO_PASSWORD");
            }

            const isMatched = await bcrypt.compare(password, buyerProfile.password);
            if (!isMatched) {
                throw new HttpError(400, "Invalid password! Please enter correct password.");
                // throw new Error("INVALID_PASSWORD");
            }

            user = await this.userRepo.findUserById(buyerProfile.userId.toString());
            if (!user) {
                throw new HttpError(404, "User not found!");
                // throw new Error("USER_NOT_FOUND");
            }

            const response: AuthResponseDtoType = {
                success: true,
                message: "Logged in as buyer successfully.",
                user: this.normalizeForResponse(user, buyerProfile)
            };
            return response;
        }

        throw new HttpError(400, "Invalid role! Role is unknown.");
        // throw new Error("UNKNOWN_ROLE");
    };

    // Example for provider (Google) sign-in: find or create user/buyer profile
    findOrCreateFromProvider = async (profile: any, provider: string): Promise<AuthResponseDtoType> => {
        if (!profile || !profile.id) {
            throw new HttpError(400, "Invalid provider profile! Provider profile is not valid.");
            // throw new Error("INVALID_PROVIDER_PROFILE");
        }

        const email = profile.email;
        if (!email) {
            // In many flows you may require email from provider, otherwise return code to ask the user for email.
            throw new HttpError(400, "Invalid provider email! Please, provide correct provider email.");
            // throw new Error("PROVIDER_EMAIL_REQUIRED");
        }

        // Try existing user by email
        let user = await this.userRepo.findUserByEmail(email);
        if (user) {
            // if buyer role and buyerProfile exists, update googleId if missing
            if (user.role === "buyer" && user.buyerProfile) {
                const buyerProfile = await this.buyerRepo.findBuyerById(user.buyerProfile.toString());
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
            profilePictureUrl: profile.picture,
        });

        if (!newUser) {
            throw new HttpError(404, "Newly created user not found.");
            // throw new Error("USER_NOT_FOUND");
        }

        const newBuyer = await this.buyerRepo.createGoogleProviderBuyer({
            userId: newUser._id.toString(),
            fullName: profile.name,
            terms: true,
            googleId: profile.id,
        });

        if (!newUser) {
            throw new HttpError(404, "Newly created buyer user not found.");
            // throw new Error("BUYER_NOT_FOUND");
        }

        // attach buyerProfile to user
        await this.userRepo.updateUser(newUser._id.toString(), { buyerProfile: newUser._id.toString() });

        const response: AuthResponseDtoType = {
            success: true,
            user: this.normalizeForResponse(newUser, newBuyer),
        };
        return response;
    };
}
