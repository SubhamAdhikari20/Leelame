// src/interfaces/buyer.repository.interface.ts
import { BuyerDocument, Buyer } from "@/types/buyer.type.ts";
import { UserDocument } from "@/types/user.type.ts";

export interface BuyerRepositoryInterface {
    createBuyer(buyer: Buyer): Promise<BuyerDocument | null>;
    updateBuyer(id: string, buyer: Partial<Buyer>): Promise<BuyerDocument | null>;
    deleteBuyer(id: string) : Promise<void | null>;
    findBuyerById(email: string): Promise<BuyerDocument | null>;
    findBuyerByUsername(username: string): Promise<BuyerDocument | null>;
    findBuyerByContact(contact: string): Promise<BuyerDocument | null>;
    getAllBuyers(): Promise<BuyerDocument[] | null>;
}