// src/repositories/seller.repository.ts
import { SellerRepositoryInterface } from "@/interfaces/seller.repository.interface.ts";
import { Seller, SellerDocument } from "@/types/seller.type.ts";
import SellerModel from "@/models/seller.model.ts";
// import { Types } from "mongoose";

export class SellerRepository implements SellerRepositoryInterface {
    createSeller = async (seller: Partial<Seller>): Promise<SellerDocument | null> => {
        const newSeller = await SellerModel.create(seller);
        return newSeller;
    };

    updateSeller = async (id: string, seller: Partial<Seller>): Promise<SellerDocument | null> => {
        const updatedSeller = await SellerModel.findByIdAndUpdate(id, seller, { new: true }).lean();
        return updatedSeller;
    };

    deleteSeller = async (id: string): Promise<void | null> => {
        await SellerModel.findByIdAndDelete(id);
    };

    findSellerById = async (id: string): Promise<SellerDocument | null> => {
        const seller = await SellerModel.findById(id).lean();
        return seller;
    };

    findUserById = async (userId: string): Promise<SellerDocument | null> => {
        const seller = await SellerModel.findOne({ userId: userId }).lean();
        // const seller = await SellerModel.findOne({ userId: new Types.ObjectId(userId) } as any).lean();
        return seller;
    };

    findSellerByContact = async (contact: string): Promise<SellerDocument | null> => {
        const seller = await SellerModel.findOne({ contact }).lean();
        return seller;
    };

    getAllSellers = async (): Promise<SellerDocument[] | null> => {
        const sellers = await SellerModel.find().lean();
        return sellers;
    };
}
