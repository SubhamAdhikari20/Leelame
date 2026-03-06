// components/buyer/receipt.tsx
"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import Invoice from "./invoice.tsx";
import { useReactToPrint } from "react-to-print";
import type { ReceiptPagePropsType } from "@/types/buyer-prop.type.ts";


const Receipt = ({ currentUser, invoice, isSuccess }: ReceiptPagePropsType) => {
    const router = useRouter();
    const invoiceRef = useRef<HTMLDivElement>(null);

    // Print handler
    const handlePrint = useReactToPrint({
        contentRef: invoiceRef,
        documentTitle: `Invoice_${invoice._id}`,
        pageStyle: `
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none !important; }
          }
        `,
    });

    // // Download PDF handler
    // const downloadPdf = async () => {
    //     if (!invoiceRef.current) {
    //         toast.error("Nothing to download");
    //         return;
    //     }

    //     try {
    //         const canvas = await html2canvas(invoiceRef.current, {
    //             scale: 2.5,
    //             useCORS: true,
    //             logging: false,
    //             scrollY: -window.scrollY,
    //             backgroundColor: "#ffffff",
    //         });

    //         const imgData = canvas.toDataURL("image/png");
    //         const pdf = new jsPDF({
    //             orientation: "portrait",
    //             unit: "px",
    //             format: "a4",
    //         });

    //         const pageWidth = pdf.internal.pageSize.getWidth();
    //         const pageHeight = pdf.internal.pageSize.getHeight();

    //         const imgProps = pdf.getImageProperties(imgData);
    //         const ratio = Math.min((pageWidth - 40) / imgProps.width, (pageHeight - 40) / imgProps.height);
    //         const imgWidth = imgProps.width * ratio;
    //         const imgHeight = imgProps.height * ratio;

    //         pdf.addImage(
    //             imgData,
    //             "PNG",
    //             (pageWidth - imgWidth) / 2,
    //             20,
    //             imgWidth,
    //             imgHeight
    //         );

    //         pdf.save(`Leelame_Invoice_${invoice._id}.pdf`);
    //         toast.success("Invoice downloaded successfully");
    //     }
    //     catch (error: Error | any) {
    //         console.error("PDF error:", error);
    //         toast.error("PDF generation failed. Try printing instead.");
    //     }

    //     // try {
    //     //     // html2canvas options tuned:
    //     //     const canvas = await html2canvas(invoiceRef.current, {
    //     //         scale: 2,
    //     //         useCORS: true,
    //     //         logging: true,
    //     //         scrollY: -window.scrollY,      // capture the element at its on‐screen position
    //     //         windowWidth: document.body.scrollWidth,
    //     //         windowHeight: document.body.scrollHeight,
    //     //         backgroundColor: "#ffffff",
    //     //     });

    //     //     const imgData = canvas.toDataURL("image/png");
    //     //     const pdf = new jsPDF({ unit: "px", format: "a4" });
    //     //     const pageWidth = pdf.internal.pageSize.getWidth();
    //     //     const pageHeight = pdf.internal.pageSize.getHeight();

    //     //     // Fit the rendered image to an A4 page:
    //     //     const imgProps = (pdf as any).getImageProperties(imgData);
    //     //     const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
    //     //     const imgWidth = imgProps.width * ratio;
    //     //     const imgHeight = imgProps.height * ratio;

    //     //     pdf.addImage(
    //     //         imgData,
    //     //         "PNG",
    //     //         (pageWidth - imgWidth) / 2, // center horizontally
    //     //         20,                         // top margin
    //     //         imgWidth,
    //     //         imgHeight
    //     //     );

    //     //     pdf.save(`Invoice_${invoice._id}.pdf`);
    //     // }
    //     // catch (err: any) {
    //     //     console.error("PDF generation error:", err);
    //     //     toast.error("Unable to generate PDF. Please try printing instead.");
    //     // }
    // };

    return (
        <section className="p-4 md:p-8 flex items-start justify-center">
            <div className="w-full max-w-3xl">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 px-4">
                    <div className="flex items-center space-x-3">
                        {isSuccess ? (
                            <CheckCircle className="h-10 w-10 text-green-500" />
                        ) : (
                            <XCircle className="h-10 w-10 text-red-500" />
                        )}
                        <h2 className="text-2xl font-semibold">
                            {isSuccess ? "Payment Successful!" : "Payment Failed"}
                        </h2>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.replace("/")}
                        className="mt-4 sm:mt-0"
                    >
                        Go to Dashboard
                    </Button>
                </div>

                {isSuccess && invoice && (
                    <div className="no-print flex flex-col sm:flex-row justify-center gap-2 mb-4 px-4">
                        <Button onClick={() => handlePrint()}>Print Bill</Button>
                        {/* <Button variant="outline" onClick={() => downloadPdf()}>
                            Download PDF
                        </Button> */}
                    </div>
                )}

                {/* Invoice */}
                <div className="px-4">
                    <div
                        ref={invoiceRef}
                        className="invoice-print bg-white dark:bg-background shadow-2xl rounded-2xl overflow-hidden"
                    >
                        {invoice && <Invoice invoice={invoice} />}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Receipt;