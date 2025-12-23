// src/interfaces/admin.repository.interface.ts
import { Admin, AdminDocument } from "@/types/admin.type.ts";

export interface AdminRepositoryInterface {
    createAdmin(admin: Partial<Admin>): Promise<AdminDocument | null>;
    updateAdmin(id: string, admin: Partial<Admin>): Promise<AdminDocument | null>;
    deleteAdmin(id: string) : Promise<void | null>;
    findAdminById(id: string): Promise<AdminDocument | null>;
    findUserById(userId: string): Promise<AdminDocument | null>;
    getAllAdmins(): Promise<AdminDocument[] | null>;
}