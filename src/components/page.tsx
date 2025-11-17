// src/app/page.tsx (server)
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options.ts";
import Home from "@/components/home-user.tsx";

const Page = async () => {
    const session = await getServerSession(authOptions);

    // If user is logged in and has buyerProfile username, redirect to /:username
    const username = session?.user?.buyerProfile?.username;
    if (username) {
        // if you want the buyer's landing to be their username route
        redirect(`/${username}`);
    }

    // else render the public home UI component (client) that shows generic CTA
    return <Home />;
}

export default Page;