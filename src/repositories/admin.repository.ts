// src/repositories/admin.repository.ts
import { AdminRepositoryInterface } from "@/interfaces/admin.repository.interface.ts";
import { Admin, AdminDocument } from "@/types/admin.type.ts";
import AdminModel from "@/models/admin.model.ts";


export class AdminRepository implements AdminRepositoryInterface {
    createAdmin = async (admin: Partial<Admin>): Promise<AdminDocument | null> => {
        const newAdmin = await AdminModel.create(admin);
        return newAdmin as unknown as AdminDocument | null;
    };

    updateAdmin = async (id: string, admin: Partial<Admin>): Promise<AdminDocument | null> => {
        const updatedAdmin = await AdminModel.findByIdAndUpdate(id, admin, { new: true }).lean();
        return updatedAdmin as unknown as AdminDocument | null;
    };

    deleteAdmin = async (id: string): Promise<void | null> => {
        await AdminModel.findByIdAndDelete(id);
    };

    findAdminById = async (id: string): Promise<AdminDocument | null> => {
        const admin = await AdminModel.findById(id).lean();
        return admin as unknown as AdminDocument | null;
    };

    findUserById = async (userId: string): Promise<AdminDocument | null> => {
        const admin = await AdminModel.findOne({ userId: userId }).lean();
        return admin as unknown as AdminDocument | null;
    };

    getAllAdmins = async (): Promise<AdminDocument[] | null> => {
        const admins = await AdminModel.find().lean();
        return admins as unknown as AdminDocument[];
    };
}
