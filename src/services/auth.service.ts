// src/services/auth.service.ts
import bcrypt from "bcryptjs";
import { UserRepositoryInterface } from "@/interfaces/user.repository.interface.ts";
import { BuyerRepositoryInterface } from "@/interfaces/buyer.repository.interface.ts";
import { SellerRepositoryInterface } from "@/interfaces/seller.repository.interface.ts";
import { AdminRepositoryInterface } from "@/interfaces/admin.repository.interface.ts";
import { AuthResponseDtoType, LoginUserDtoType } from "@/dtos/auth.dto.ts";


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

        if (!identifier || !password) {
            const response: AuthResponseDtoType = {
                success: false,
                message: "MISSING_CREDENTIALS",
            };
            return response;
            // throw new Error("MISSING_CREDENTIALS");
        }

        // 1) Admin: email-only
        if (role === "admin") {
            const user = await this.userRepo.findUserByEmail(identifier);
            if (!user) {
                const response: AuthResponseDtoType = {
                    success: false,
                    message: "ADMIN_NOT_FOUND",
                };
                return response;
                // throw new Error("ADMIN_NOT_FOUND");
            }
            if (user.role !== "admin") {
                const response: AuthResponseDtoType = {
                    success: false,
                    message: "NOT_ADMIN",
                };
                return response;
                // throw new Error("NOT_ADMIN");
            }

            const adminProfile = await this.adminRepo.findUserById(user._id.toString());
            if (!adminProfile) {
                const response: AuthResponseDtoType = {
                    success: false,
                    message: "ADMIN_NOT_FOUND",
                };
                return response;
                // throw new Error("ADMIN_NOT_FOUND");
            }

            const hashed = adminProfile.password;
            if (!hashed) {
                const response: AuthResponseDtoType = {
                    success: false,
                    message: "ADMIN_NO_PASSWORD",
                };
                return response;
                // throw new Error("ADMIN_NO_PASSWORD");
            }
            const ok = await bcrypt.compare(password, hashed);
            if (!ok) {
                const response: AuthResponseDtoType = {
                    success: false,
                    message: "INVALID_PASSWORD",
                };
                return response;
                // throw new Error("INVALID_PASSWORD");
            }

            const response: AuthResponseDtoType = {
                success: true,
                user: this.normalizeForResponse(user, adminProfile)
                // user: {
                //     _id: user._id,
                //     email: user.email,
                //     role: user.role,
                //     isVerified: user.isVerified,
                //     fullName: adminProfile.fullName,
                //     contact: adminProfile.contact,
                //     profilePictureUrl: user.profilePictureUrl,
                //     adminProfile: adminProfile._id,
                //     createAt: user.createdAt,
                //     updatedAt: user.updatedAt,
                // }
            };
            return response;
        }

        // 2) Seller: email or contact
        if (role === "seller") {
            // try email-based user
            let user = await this.userRepo.findUserByEmail(identifier);
            if (user && user.role === "seller") {
                const sellerProfile = await this.sellerRepo.findUserById(user._id.toString());

                if (!sellerProfile) {
                    const response: AuthResponseDtoType = {
                        success: false,
                        message: "SELLER_NOT_FOUND",
                    };
                    return response;
                    // throw new Error("SELLER_NOT_FOUND");
                }
                const hashedPassword = sellerProfile.password;
                if (!hashedPassword) {
                    const response: AuthResponseDtoType = {
                        success: false,
                        message: "SELLER_NO_PASSWORD",
                    };
                    return response;
                    // throw new Error("SELLER_NO_PASSWORD");
                }
                const isMatched = await bcrypt.compare(password, hashedPassword);
                if (!isMatched) {
                    const response: AuthResponseDtoType = {
                        success: false,
                        message: "INVALID_PASSWORD",
                    };
                    return response;
                    // throw new Error("INVALID_PASSWORD");
                }

                const response: AuthResponseDtoType = {
                    success: false,
                    user: this.normalizeForResponse(user, sellerProfile)
                    // user: {
                    //     _id: user._id,
                    //     email: user.email,
                    //     role: user.role,
                    //     isVerified: user.isVerified,
                    //     fullName: sellerProfile.fullName,
                    //     contact: sellerProfile.contact,
                    //     profilePictureUrl: user.profilePictureUrl,
                    //     sellerProfile: sellerProfile._id,
                    //     createAt: user.createdAt,
                    //     updatedAt: user.updatedAt,
                    // }
                };
                return response;
            }

            // If not found by email, try contact lookup in seller collection
            const sellerProfile = await this.sellerRepo.findSellerByContact(identifier);
            if (!sellerProfile) {
                const response: AuthResponseDtoType = {
                    success: false,
                    message: "SELLER_NOT_FOUND",
                };
                return response;
                // throw new Error("SELLER_NOT_FOUND");
            }

            if (!sellerProfile.password) {
                const response: AuthResponseDtoType = {
                    success: false,
                    message: "SELLER_NO_PASSWORD",
                };
                return response;
                // throw new Error("SELLER_NO_PASSWORD");
            }

            const isMatched = await bcrypt.compare(password, sellerProfile.password);
            if (!isMatched) {
                const response: AuthResponseDtoType = {
                    success: false,
                    message: "INVALID_PASSWORD",
                };
                return response;
                // throw new Error("INVALID_PASSWORD");
            }

            // // get linked user doc:
            const sellerUserDoc = await this.userRepo.findUserById(sellerProfile.userId.toString());
            if (!sellerUserDoc) {
                const response: AuthResponseDtoType = {
                    success: false,
                    message: "USER_NOT_FOUND",
                };
                return response;
                // throw new Error("USER_NOT_FOUND");
            }

            const response: AuthResponseDtoType = {
                success: false,
                user: this.normalizeForResponse(sellerUserDoc, sellerProfile)
                // user: {
                //     _id: sellerUserDoc._id,
                //     email: sellerUserDoc.email,
                //     role: sellerUserDoc.role,
                //     isVerified: sellerUserDoc.isVerified,
                //     fullName: sellerProfile.fullName,
                //     contact: sellerProfile.contact,
                //     profilePictureUrl: sellerUserDoc.profilePictureUrl,
                //     sellerProfile: sellerProfile._id,
                //     createAt: sellerUserDoc.createdAt,
                //     updatedAt: sellerUserDoc.updatedAt,
                // }
            };
            return response;
        }

        // 3) BUYER: email OR username
        if (role === "buyer") {
            let user = await this.userRepo.findUserByEmail(identifier);
            if (user && user.role === "buyer") {
                const buyerProfile = await this.buyerRepo.findUserById(user._id.toString());

                if (!buyerProfile) {
                    const response: AuthResponseDtoType = {
                        success: false,
                        message: "SELLER_NOT_FOUND",
                    };
                    return response;
                    // throw new Error("SELLER_NOT_FOUND");
                }

                const hashedPassword = buyerProfile.password;
                if (!hashedPassword) {
                    const response: AuthResponseDtoType = {
                        success: false,
                        message: "BUYER_NO_PASSWORD",
                    };
                    return response;
                    // throw new Error("BUYER_NO_PASSWORD");
                }

                const isMatched = await bcrypt.compare(password, hashedPassword);
                if (!isMatched) {
                    const response: AuthResponseDtoType = {
                        success: false,
                        message: "INVALID_PASSWORD",
                    };
                    return response;
                    // throw new Error("INVALID_PASSWORD");
                }

                const response: AuthResponseDtoType = {
                    success: true,
                    user: this.normalizeForResponse(user, buyerProfile)
                    // user: {
                    //     _id: user._id,
                    //     email: user.email,
                    //     role: user.role,
                    //     isVerified: user.isVerified,
                    //     fullName: buyerProfile.fullName,
                    //     username: buyerProfile.username,
                    //     contact: buyerProfile.contact,
                    //     profilePictureUrl: user.profilePictureUrl,
                    //     buyerProfile: buyerProfile._id,
                    //     googleId: buyerProfile.googleId,
                    //     createAt: user.createdAt,
                    //     updatedAt: user.updatedAt,
                    // }
                };
                return response;
            }
            const buyerProfile = await this.buyerRepo.findBuyerByUsername(identifier);
            if (!buyerProfile) {
                const response: AuthResponseDtoType = {
                    success: false,
                    message: "BUYER_NOT_FOUND",
                };
                return response;
                // throw new Error("BUYER_NOT_FOUND");

            }

            if (!buyerProfile.password) {
                const response: AuthResponseDtoType = {
                    success: false,
                    message: "BUYER_NO_PASSWORD",
                };
                return response;
                // throw new Error("BUYER_NO_PASSWORD");
            }

            const isMatched = await bcrypt.compare(password, buyerProfile.password);
            if (!isMatched) {
                const response: AuthResponseDtoType = {
                    success: false,
                    message: "INVALID_PASSWORD",
                };
                return response;
                // throw new Error("INVALID_PASSWORD");
            }
            const buyerUserDoc = await this.userRepo.findUserById(buyerProfile.userId.toString());
            if (!buyerUserDoc) {
                const response: AuthResponseDtoType = {
                    success: false,
                    message: "USER_NOT_FOUND",
                };
                return response;
                // throw new Error("USER_NOT_FOUND");
            }

            const response: AuthResponseDtoType = {
                success: true,
                user: this.normalizeForResponse(buyerUserDoc, buyerProfile)
                // user: {
                //     _id: buyerUserDoc._id,
                //     email: buyerUserDoc.email,
                //     role: buyerUserDoc.role,
                //     isVerified: buyerUserDoc.isVerified,
                //     fullName: buyerProfile.fullName,
                //     username: buyerProfile.username,
                //     contact: buyerProfile.contact,
                //     profilePictureUrl: buyerUserDoc.profilePictureUrl,
                //     buyerProfile: buyerProfile._id,
                //     createAt: buyerUserDoc.createdAt,
                //     updatedAt: buyerUserDoc.updatedAt,
                // }
            };
            return response;
        }

        const response: AuthResponseDtoType = {
            success: false,
            message: "UNKNOWN_ROLE",
        };
        return response;
        // throw new Error("UNKNOWN_ROLE");
    };

    // Example for provider (Google) sign-in: find or create user/buyer profile
    findOrCreateFromProvider = async (profile: any, provider: string): Promise<AuthResponseDtoType> => {
        if (!profile || !profile.id) {
            const response: AuthResponseDtoType = {
                success: false,
                message: "INVALID_PROVIDER_PROFILE",
            };
            return response;
        }

        const email = profile.email ?? null;

        if (!email) {
            // In many flows you may require email from provider, otherwise return code to ask the user for email.
            const response: AuthResponseDtoType = {
                success: false,
                message: "PROVIDER_EMAIL_REQUIRED",
            };
            return response;
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
                    user: this.normalizeForResponse(user, buyerProfile ?? null),
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
            profilePictureUrl: profile.picture ?? null,
        });

        if (!newUser) {
            const response: AuthResponseDtoType = {
                success: false,
                message: "BUYER_NOT_FOUND",
            };
            return response;
        }

        const newBuyer = await this.buyerRepo.createGoogleProviderBuyer({
            userId: newUser._id.toString(),
            fullName: profile.name,
            terms: true,
            googleId: profile.id,
        });

        // attach buyerProfile to user
        await this.userRepo.updateUser(newUser._id.toString(), { buyerProfile: newUser._id.toString() });

        const response: AuthResponseDtoType = {
            success: true,
            user: this.normalizeForResponse(newUser, newBuyer),
        };
        return response;
    };
}
