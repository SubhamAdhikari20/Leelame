// src/app/(app)/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { CurrentUser } from "@/types/current-user.ts";


interface HomePageProps {
    currentUser?: CurrentUser | null;
}

const HomePage: React.FC<HomePageProps> = ({ currentUser }) => {
    const [phraseIndex, setPhraseIndex] = useState(0);

    // Hero Text Phrases
    const phrases = (currentUser && currentUser.buyerProfile)
        ? [
            `Welcome, ${currentUser.buyerProfile.fullName ?? currentUser.buyerProfile.username}`,
            `Hello, ${currentUser.buyerProfile.fullName ?? currentUser.buyerProfile.username}`,
            `Bid on, ${currentUser.buyerProfile.fullName ?? currentUser.buyerProfile.username}`,
        ]
        : ["Leelame", "Your Bid Companion", "Bid with Peace of Mind"];

    useEffect(() => {
        const iv = setInterval(
            () => setPhraseIndex((i) => (i + 1) % phrases.length),
            3000
        );
        return () => clearInterval(iv);
    }, [phrases.length]);

    // Features Data
    const features = [
        {
            title: "Wide Range of Items",
            image: "/images/wide_range_items.jpg",
            description: "From antiques to electronics, find the perfect item to bid on for any interest.",
        },
        {
            title: "Transparent Bidding",
            image: "/images/transparent_bidding.jpg",
            description: "Clear bid history, live timers, and instant notifications — never miss a moment.",
        },
        {
            title: "Real-Time Bidding",
            image: "/images/real-time_bidding.jpg",
            description: "Stay updated with live bid updates for an exciting and competitive auction experience.",
        },
        {
            title: "AI Price Suggestions",
            image: "/images/ai_recommendations.jpg",
            description: "Get AI recommended bid ranges and probability hints to place smarter bids.",
        },
        {
            title: "Secure Escrow",
            image: "/images/secure_escrow.jpg",
            description: "Funds are held in escrow until the item is verified and delivered — safer trades.",
        },
        {
            title: "Secure Payments",
            image: "/images/secure_payment.jpg",
            description: "Enjoy smooth and secure transactions with integrated gateways for winning bids.",
        },
    ];

    // Testimonials Data
    const testimonials = [
        {
            name: "Subham Sharma",
            role: "Collectibles Enthusiast",
            avatar: "/images/pp1.jpg",
            quote: `“Leelame’s real-time bid tracking turned my auction hunts into pure excitement—no more missing out on deals. Bidding was instant, the items were authentic, and payments were a breeze. Truly seamless from start to finish.”`
        },
        {
            name: "Aayush Parazuli",
            role: "Tech Bidder",
            avatar: "/images/pp2.jpg",
            quote: `“I placed a bid on Leelame for a rare gadget and was blown away by the smooth app experience. Updating my bid took seconds, the notifications were spot-on, and I won the auction. Top-notch service!”`
        },
        {
            name: "Susmita Malla",
            role: "Art Collector",
            avatar: "/images/pp3.jpg",
            quote: `“Whether I'm bidding on vintage art or modern pieces, Leelame delivers perfect reliability. Their 24/7 support, transparent pricing, and live bid updates mean I can bid with total confidence.”`
        },
        {
            name: "Rajan Thapa",
            role: "Collector",
            avatar: "/images/pp5.jpg",
            quote: `“Leelame helped me land a rare vintage camera — the bidding UI and escrow flow were flawless.”`
        },
        {
            name: "Nisha Gurung",
            role: "Reseller",
            avatar: "/images/pp4.jpg",
            quote: `“Fast payouts, helpful AI suggestions, and reliable buyer verification. Highly recommended.”`
        },
        {
            name: "Prakash Singh",
            role: "Casual Bidder",
            avatar: "/images/pp6.jpg",
            quote: `“The live timers and bid reminders made bidding so much simpler. Won my first auction here!”`
        },
    ]

    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 md:px-0 min-h-screen flex items-center border-b dark:border-gray-700">
                {/* Background Image */}
                <div className="absolute inset-0 z-10 hover:animate-out overflow-hidden">
                    <Image
                        src="/images/bid_bg1.jpg"
                        alt="Bike Logo"
                        fill
                        className="object-cover opacity-70"
                        priority
                    />

                    {/* Overlay gradients */}
                    <div className="absolute inset-0 bg-linear-to-r from-blue-900/40 to-purple-900/40 dark:from-blue-900/40 dark:to-gray-900/50 mix-blend-multiply dark:mix-blend-normal"></div>
                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-background/80 dark:to-background/50"></div>
                </div>

                <div className="container mx-auto flex flex-col items-center justify-center text-center gap-6 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 dark:text-gray-200">
                        {phrases[phraseIndex]}
                    </h1>
                    {currentUser ? (
                        <>
                            <p className="max-w-xl text-gray-700 dark:text-gray-400 text-base sm:text-lg md:text-xl">
                                Your Premium Auction Platform. Whether you want to bid on antiques, electronics, or unique collectibles, we’ve got you covered.
                            </p>
                            <p className="max-w-xl text-gray-800 dark:text-gray-200 text-base sm:text-lg md:text-xl">
                                Enjoy real-time bid tracking, seamless payments, and 24/7 support—your bid, your way.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/products">
                                    <Button className="px-6 py-3 text-base">Browse Products</Button>
                                </Link>
                                <Link href="/my-bids">
                                    <Button variant="outline" className="px-6 py-3 text-base">
                                        My Bids
                                    </Button>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="max-w-xl text-gray-800 dark:text-gray-300 text-base sm:text-lg md:text-xl">
                                Discover the thrill of online auctions. Bid on unique items quickly and securely with:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-400 space-y-2 max-w-md text-sm sm:text-base">
                                <li>Real-time bid tracking</li>
                                <li>Seamless payments</li>
                                <li>Flexible auction durations</li>
                                <li>24/7 customer support</li>
                            </ul>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/login">
                                    <Button className="px-6 py-3 text-base">Get Started</Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 bg-background">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Why Choose Leelame?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <Card key={i} className="p-0 gap-2 dark:hover:shadow-[0_10px_15px_2px_rgba(255,255,255,0.1),0_2px_8px_3px_rgba(255,255,255,0.1)] transition-shadow hover:shadow-lg duration-200 overflow-hidden">
                                <CardHeader className="p-0">
                                    <div className="relative h-60 w-full overflow-hidden">
                                        <Image
                                            src={f.image}
                                            alt={f.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover hover:scale-110 transition-transform duration-200"
                                        />
                                    </div>
                                    <CardTitle className="px-4 pt-2 text-xl font-semibold">
                                        {f.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-600 dark:text-gray-400 text-sm px-4 py-2 mb-2">
                                    {f.description}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-12 bg-background">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-8">Testimonials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <Card key={i} className="bg-muted p-6">
                                <CardContent className="flex flex-col h-full justify-between">
                                    <div className="space-y-4">
                                        <Quote className="w-6 h-6 text-muted-foreground" />
                                        <p className="text-sm text-foreground leading-relaxed md:text-[16px]">
                                            {t.quote}
                                        </p>
                                    </div>
                                    <div className="flex items-center mt-6">
                                        <Avatar className="border border-gray-900 dark:border-gray-100 w-15 h-15">
                                            <AvatarImage src={t.avatar} alt={t.name} />
                                            <AvatarFallback>{t.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 text-left">
                                            <p className="font-medium text-foreground">{t.name}</p>
                                            <p className="text-xs text-muted-foreground">{t.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call To Action */}
            <section className="relative h-[600px] sm:h-[900px] flex items-center overflow-hidden">
                {/* Background Image */}
                <Image
                    src="/images/bid_bg2.jpg"
                    alt="Auction Adventure"
                    fill
                    className="object-cover opacity-70 absolute z-10 inset-0"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/60" />

                <div className="container mx-auto px-4 relative z-10 text-center text-white space-y-4">
                    <h2 className="text-4xl sm:text-5xl font-extrabold">
                        Start Bidding Today
                    </h2>
                    <p className="max-w-xl mx-auto text-lg sm:text-xl">
                        Bid on exciting items in seconds and win big in our online auctions.
                    </p>
                    <Link href="/products">
                        <Button size="lg" className="mt-4 bg-gray-50 text-gray-800 font-bold text-[17px] hover:bg-gray-200">
                            Start Now
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Demo / Video Section */}
            <section className="py-12 bg-background">
                <div className="container mx-auto px-4 flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-center mb-8">Experience Leelame in Action</h2>
                    <div className="w-full max-w-3xl aspect-video rounded overflow-hidden shadow-lg">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/w0B9ToQL34w?si=BZsvfPphF0q-6T7O"
                            // src="https://www.youtube.com/embed/C-eCWfDIUXA?si=CrADAmA31-Hcqron"
                            title="Leelame Demo Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;