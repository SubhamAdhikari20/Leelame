// // src/services/user.service.ts
// import { CreatedUserDto, UserResponseDto } from "@/dtos/user.dto.ts";
// import { UserRepositoryInterface } from "@/interfaces/user.respository.interface.ts";
// import { ApiResponse } from "@/types/api-response";


// export class UserService {
//     constructor(private userRepo: UserRepositoryInterface) { }

//     // Business Logic 
//     async registerUser(userData: CreatedUserDto): Promise<UserResponseDto | ApiResponse> {
//         const { email, role } = userData;

//         // Check existing user
//         const existingUserByEmail = await this.userRepo.findUserByEmail(email);

//         if (
//             existingUserByEmail?.isVerified === true
//         ) {
//             return { success: true, message: "Username already exists", status: 400 };
//         }



//         const newUser = await this.userRepo.createUser(userData);


//         const respose: UserResponseDto = {
//             _id: newUser._id,
//             email: newUser.email,
//             role: newUser.role,
//             buyerProfile: newUser.buyerProfile,
//             sellerProfile: newUser.sellerProfile,
//             adminProfile: newUser.adminProfile,
//             createAt: newUser.createdAt,
//             updatedAt: newUser.updatedAt,
//         };
//         return respose;
//     }
// }