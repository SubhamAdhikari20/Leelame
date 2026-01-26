// src/repositories/buyer.repository.ts
import type { BuyerRepositoryInterface } from "@/interfaces/buyer.repository.interface.ts";
import type { Buyer, BuyerDocument, ProviderBuyer } from "@/types/buyer.type.ts";
import BuyerModel from "@/models/buyer.model.ts";
import UserModel from "@/models/user.model.ts";


export class BuyerRepository implements BuyerRepositoryInterface {
    createBuyer = async (buyer: Buyer): Promise<BuyerDocument | null> => {
        const newBuyer = await BuyerModel.create(buyer);
        return newBuyer;
    };

    updateBuyer = async (id: string, buyer: Partial<Buyer>): Promise<BuyerDocument | null> => {
        const updatedBuyer = await BuyerModel.findByIdAndUpdate(id, buyer, { new: true }).lean();
        return updatedBuyer;
    };

    deleteBuyer = async (id: string): Promise<void | null> => {
        await BuyerModel.findByIdAndDelete(id);
    };

    findBuyerById = async (id: string): Promise<BuyerDocument | null> => {
        const buyer = await BuyerModel.findById(id).lean();
        return buyer;
    };

    findBuyerByBaseUserId = async (baseUserId: string): Promise<BuyerDocument | null> => {
        const buyer = await BuyerModel.findOne({ baseUserId: baseUserId }).lean();
        // const buyer = await BuyerModel.findOne({ userId: new Schema.Types.ObjectId(userId) }).lean();
        return buyer;
    };

    findBuyerByEmail = async (email: string): Promise<BuyerDocument | null> => {
        const baseUser = await UserModel.findOne({ email }).lean();
        if (!baseUser) {
            return null;
            // throw new HttpError(404, "Invalid email! Base user not found!");
        }
        // const buyer = await BuyerModel.findOne({ userId: new Schema.Types.ObjectId(baseUser._id.toString()) }).lean();
        const buyer = await BuyerModel.findOne({ baseUserId: baseUser._id.toString() }).lean();
        return buyer;
    };

    findBuyerByUsername = async (username: string): Promise<BuyerDocument | null> => {
        const buyer = await BuyerModel.findOne({ username }).lean();
        return buyer;
    };

    findBuyerByContact = async (contact: string): Promise<BuyerDocument | null> => {
        const buyer = await BuyerModel.findOne({ contact }).lean();
        return buyer;
    };

    getAllBuyers = async (): Promise<BuyerDocument[] | null> => {
        const buyers = await BuyerModel.find().lean();
        return buyers;
    };

    createGoogleProviderBuyer = async (buyer: ProviderBuyer): Promise<BuyerDocument | null> => {
        const newBuyer = await BuyerModel.create(buyer);
        return newBuyer;
    }
}