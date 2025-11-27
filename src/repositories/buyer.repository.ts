// src/repositories/buyer.repository.ts
import { BuyerRepositoryInterface } from "@/interfaces/buyer.repository.interface";
import { Buyer, BuyerDocument } from "@/types/buyer.type.ts";
import BuyerModel from "@/models/buyer.model.ts";
import dbConnection from "@/lib/db-connect";

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
}