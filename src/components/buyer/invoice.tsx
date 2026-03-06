// src/components/Invoice.tsx
import React, { forwardRef } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from "@/components/ui/table.tsx";
import type { InvoiceProps } from "@/types/buyer-prop.type.ts";
import { formatDate } from "date-fns";


// export interface InvoiceProps {
//     invoice: {
//         _id: string;
//         buyerName: string;
//         buyerContact: string;
//         sellerName: string;
//         sellerContact: string;
//         productName: string;
//         price: number;
//         soldPrice: number;
//         serviceFee: number;
//         paymentMethod: string;
//         buyerId: string;
//         productId: number;
//         sellerId: string;
//         transactionId: string;
//         orderId: number;
//         createdAt: Date;
//         updatedAt: Date;
//     };
// }

const Invoice = forwardRef<HTMLDivElement, InvoiceProps>(({ invoice }, ref) => {
    const formatAmount = (amount: number) => {
        const format = Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2
        });
        return `Rs. ${format}`;
    };

    // // format numbers and dates
    // const fmtDate = (d: Date) => d.toLocaleDateString(undefined, {
    //     year: "numeric",
    //     month: "short",
    //     day: "numeric",
    // });

    return (
        <Card
            ref={ref}
            className="max-w-3xl mx-auto shadow-none bg-white dark:bg-gray-900 print:bg-white rounded-2xl"
        >
            <CardHeader className="flex justify-between items-center pb-4">
                <div>
                    <CardTitle className="text-2xl">Leelame</CardTitle>
                    <p className="text-sm text-muted-foreground">Invoice</p>
                </div>
                <div className="text-right space-y-1">
                    <p className="text-sm">Invoice #{invoice._id}</p>
                    <p className="text-sm">Date: {formatDate(new Date(invoice.createdAt), "PPP")}</p>
                </div>
            </CardHeader>

            <Separator />

            <CardContent className="py-4 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold">Billed To:</h3>
                        <p>{invoice.buyerName}</p>
                        <p>{invoice.buyerContact}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Seller:</h3>
                        <p>{invoice.sellerName}</p>
                        <p>{invoice.sellerContact}</p>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Service Charge (%)</TableHead>
                            <TableHead>Price (NPR)</TableHead>
                            <TableHead>Total (NPR)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{invoice.productName}</TableCell>
                            <TableCell>{invoice.serviceCharge}</TableCell>
                            <TableCell>
                                {formatAmount(Number(invoice.price))}
                            </TableCell>
                            <TableCell>
                                {formatAmount(Number(invoice.price))}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>

            <Separator />

            <CardFooter className="flex justify-end">
                <div className="space-y-1 text-right">
                    <p className="font-medium text-lg">
                        Grand Total: {formatAmount(invoice.price)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Paid via {invoice.paymentMethod}
                    </p>
                </div>
            </CardFooter>
        </Card>
    );
});
Invoice.displayName = "Invoice";
export default Invoice;