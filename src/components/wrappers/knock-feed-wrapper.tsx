// src/components/wrappers/knock-feed-wrapper.tsx
"use client";
import { KnockFeedProvider } from "@knocklabs/react";

interface KnockFeedWrapperProps {
    children: React.ReactNode;
    currentUser: any;
}

const KnockFeedWrapper = ({ children, currentUser }: KnockFeedWrapperProps) => {
    const feedId = process.env.NEXT_PUBLIC_KNOCK_PUBLIC_FEED_ID;
    if (!feedId) {
        console.error("NEXT_PUBLIC_KNOCK_PUBLIC_FEED_ID is missing.");
        return <>{children}</>;
    }

    if (!currentUser?._id) {
        return <>{children}</>;
    }

    return (
        <KnockFeedProvider feedId={feedId}>
            {children}
        </KnockFeedProvider>
    );
}

export default KnockFeedWrapper;