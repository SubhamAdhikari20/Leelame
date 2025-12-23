// src/repositories/seller.repository.ts
import { SellerRepositoryInterface } from "@/interfaces/seller.repository.interface.ts";
import { Seller } from "@/types/seller.type.ts";
import SellerModel, { ISeller } from "@/models/seller.model.ts";
import { Types } from "mongoose";

export class SellerRepository implements SellerRepositoryInterface {
    createSeller = async (seller: Partial<Seller>): Promise<ISeller | null> => {
        const newSeller = await SellerModel.create(seller);
        return newSeller as unknown as ISeller | null;
    };

    updateSeller = async (id: string, seller: Partial<Seller>): Promise<ISeller | null> => {
        const updatedSeller = await SellerModel.findByIdAndUpdate(id, seller, { new: true }).lean();
        return updatedSeller;
    };

    deleteSeller = async (id: string): Promise<void | null> => {
        await SellerModel.findByIdAndDelete(id);
    };

    findSellerById = async (id: string): Promise<ISeller | null> => {
        const seller = await SellerModel.findById(id).lean();
        return seller;
    };

    findUserById = async (userId: string): Promise<ISeller | null> => {
        const seller = await SellerModel.findOne({ userId: new Types.ObjectId(userId) } as any).lean();
        return seller;
    };

    findSellerByContact = async (contact: string): Promise<ISeller | null> => {
        const seller = await SellerModel.findOne({ contact }).lean();
        return seller;
    };

    getAllSellers = async (): Promise<ISeller[] | null> => {
        const sellers = await SellerModel.find().lean();
        return sellers;
    };
}
