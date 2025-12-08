// src/repositories/seller.repository.ts
import { SellerRepositoryInterface } from "@/interfaces/seller.repository.interface.ts";
import { Seller, SellerDocument } from "@/types/seller.type.ts";
import SellerModel from "@/models/seller.model.ts";


export class SellerRepository implements SellerRepositoryInterface {
    createSeller = async (seller: Seller): Promise<SellerDocument | null> => {
        const newSeller = await SellerModel.create(seller);
        return newSeller as unknown as SellerDocument | null;
    };

    updateSeller = async (id: string, seller: Partial<Seller>): Promise<SellerDocument | null> => {
        const updatedSeller = await SellerModel.findByIdAndUpdate(id, seller, { new: true }).lean();
        return updatedSeller as unknown as SellerDocument | null;
    };

    deleteSeller = async (id: string): Promise<void | null> => {
        await SellerModel.findByIdAndDelete(id);
    };

    findSellerById = async (id: string): Promise<SellerDocument | null> => {
        const seller = await SellerModel.findById(id).lean();
        return seller as unknown as SellerDocument | null;
    };

    findUserById = async (userId: string): Promise<SellerDocument | null> => {
        const seller = await SellerModel.findOne({ userId: userId }).lean();
        return seller as unknown as SellerDocument | null;
    };

    findSellerByContact = async (contact: string): Promise<SellerDocument | null> => {
        const seller = await SellerModel.findOne({ contact }).lean();
        return seller as unknown as SellerDocument | null;
    };

    getAllSellers = async (): Promise<SellerDocument[] | null> => {
        const sellers = await SellerModel.find().lean();
        return sellers as unknown as SellerDocument[];
    };
}
