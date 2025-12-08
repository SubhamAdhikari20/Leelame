// src/repositories/buyer.repository.ts
import { BuyerRepositoryInterface } from "@/interfaces/buyer.repository.interface.ts";
import { Buyer, BuyerDocument, ProviderBuyer, ProviderBuyerDocument } from "@/types/buyer.type.ts";
import BuyerModel from "@/models/buyer.model.ts";


export class BuyerRepository implements BuyerRepositoryInterface {
    createBuyer = async (buyer: Buyer): Promise<BuyerDocument | null> => {
        const newBuyer = await BuyerModel.create(buyer);
        return newBuyer as unknown as BuyerDocument | null;
    };

    updateBuyer = async (id: string, buyer: Partial<Buyer>): Promise<BuyerDocument | null> => {
        const updatedBuyer = await BuyerModel.findByIdAndUpdate(id, buyer, { new: true }).lean();
        return updatedBuyer as unknown as BuyerDocument | null;
    };

    deleteBuyer = async (id: string): Promise<void | null> => {
        await BuyerModel.findByIdAndDelete(id);
    };

    findBuyerById = async (id: string): Promise<BuyerDocument | null> => {
        const buyer = await BuyerModel.findById(id).lean();
        return buyer as unknown as BuyerDocument | null;
    };

    findUserById = async (userId: string): Promise<BuyerDocument | null> => {
        const buyer = await BuyerModel.findOne({ userId: userId }).lean();
        return buyer as unknown as BuyerDocument | null;
    };

    findBuyerByUsername = async (username: string): Promise<BuyerDocument | null> => {
        const buyer = await BuyerModel.findOne({ username }).lean();
        return buyer as unknown as BuyerDocument | null;
    };

    findBuyerByContact = async (contact: string): Promise<BuyerDocument | null> => {
        const buyer = await BuyerModel.findOne({ contact }).lean();
        return buyer as unknown as BuyerDocument | null;
    };

    getAllBuyers = async (): Promise<BuyerDocument[]> => {
        const buyers = await BuyerModel.find().lean();
        return buyers as unknown as BuyerDocument[];
    };

    createGoogleProviderBuyer = async (buyer: ProviderBuyer): Promise<ProviderBuyerDocument | null> => {
        const newBuyer = await BuyerModel.create(buyer);
        return newBuyer as unknown as ProviderBuyerDocument | null;
    }
}