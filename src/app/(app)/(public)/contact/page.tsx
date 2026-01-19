// src/app/(app)/(public)/contact/page.tsx
"use client";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { messageContactSchema } from "@/schemas/message-contact.schema.ts";


const ContactPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const messageContactForm = useForm<z.infer<typeof messageContactSchema>>({
        resolver: zodResolver(messageContactSchema),
        defaultValues: {
            fullName: "",
            email: "",
            contact: "",
            message: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof messageContactSchema>) => {
        setIsSubmitting(true);
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        messageContactForm.reset();
    };

    return (
        <section className="flex justify-center items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-900 border p-8 rounded-lg shadow-lg">
                {/* Informational Section */}
                <div className="space-y-5">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Contact Us</h1>
                    <p className="text-gray-500 dark:text-[#A0AEC0]">
                        Whether you’re a bidder, a seller, or a partner — we’d love to hear from you. Have a question, a suggestion, or want to collaborate? Reach out and we’ll get back to you soon.
                    </p>
                    <img
                        src="/images/contact_bg.jpg"
                        alt="Contact Us Image"
                        className="rounded-lg object-cover"
                    />

                    <div className="flex items-baseline-last justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Office Address
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">Kathmandu, Nepal</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
                                Business Inquiries
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                support@leelame.com <br />
                                +977 9800000000
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <form
                    id="sign-up-form"
                    onSubmit={messageContactForm.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FieldGroup>
                        <Controller
                            name="fullName"
                            control={messageContactForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name} className="text-gray-600 dark:text-[#CBD5E0]">
                                        Full Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Full Name"
                                        className="bg-white text-[#1A202C] dark:text-gray-100 placeholder:text-[#A0AEC0]"
                                    // autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="email"
                            control={messageContactForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name} className="text-gray-600 dark:text-[#CBD5E0]">
                                        Email Address
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Email"
                                        className="bg-white text-[#1A202C] dark:text-gray-100 placeholder:text-[#A0AEC0]"
                                    // autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="contact"
                            control={messageContactForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name} className="text-gray-600 dark:text-[#CBD5E0]">
                                        Contact
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Contact"
                                        className="bg-white text-[#1A202C] dark:text-gray-100 placeholder:text-[#A0AEC0]"
                                    // autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="message"
                            control={messageContactForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name} className="text-gray-600 dark:text-[#CBD5E0]">
                                        Contact
                                    </FieldLabel>
                                    <Textarea
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Type your message here"
                                        className="bg-white text-[#1A202C] dark:text-gray-100 placeholder:text-[#A0AEC0] min-h-25 max-h-50"
                                    // autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />


                    </FieldGroup>

                    <div className="flex items-center justify-center">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? (
                                <>
                                    Please wait... <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                </>
                            ) : (
                                "Send Message"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ContactPage;