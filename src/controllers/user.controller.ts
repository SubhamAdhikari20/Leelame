// // src/controllers/user.controller.ts
// import { NextRequest } from "next/server";
// import { UserService } from "@/services/user.service.ts";
// import { UserRepositoryInterface } from "@/interfaces/user.respository.interface.ts";


// export class UserController {
//     private userService: UserService;

//     constructor(userRepo: UserRepositoryInterface) {
//         this.userService = new UserService(userRepo);
//     }

//     createUser = async (req: NextRequest) => {
//         const body = await req.json();
//         return this.userService.registerUser(body);
//     }
// }