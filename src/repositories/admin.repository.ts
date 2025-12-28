// src/repositories/admin.repository.ts
import { AdminRepositoryInterface } from "@/interfaces/admin.repository.interface.ts";
import { Admin, AdminDocument } from "@/types/admin.type.ts";
import AdminModel from "@/models/admin.model.ts";
// import { Types } from "mongoose";

export class AdminRepository implements AdminRepositoryInterface {
    createAdmin = async (admin: Partial<Admin>): Promise<AdminDocument | null> => {
        const newAdmin = await AdminModel.create(admin);
        return newAdmin;
    };

    updateAdmin = async (id: string, admin: Partial<Admin>): Promise<AdminDocument | null> => {
        const updatedAdmin = await AdminModel.findByIdAndUpdate(id, admin, { new: true }).lean();
        return updatedAdmin;
    };

    deleteAdmin = async (id: string): Promise<void | null> => {
        await AdminModel.findByIdAndDelete(id);
    };

    findAdminById = async (id: string): Promise<AdminDocument | null> => {
        const admin = await AdminModel.findById(id).lean();
        return admin;
    };

    findUserById = async (userId: string): Promise<AdminDocument | null> => {
        const admin = await AdminModel.findOne({ userId: userId }).lean();
        // const admin = await AdminModel.findOne({ userId: new Types.ObjectId(userId) } as any).lean();
        return admin;
    };

    findAdminByContact = async (contact: string): Promise<AdminDocument | null> => {
        const seller = await AdminModel.findOne({ contact }).lean();
        return seller;
    };

    getAllAdmins = async (): Promise<AdminDocument[] | null> => {
        const admins = await AdminModel.find().lean();
        return admins;
    };
}
