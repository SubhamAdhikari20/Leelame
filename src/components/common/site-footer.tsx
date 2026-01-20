// src/components/common/site-footer.tsx
import React from "react";


const SiteFooter = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="min-h-[5vh] sticky bottom-0 z-20 inset-x-0 px-4 text-sm text-muted-foreground border-t bg-white dark:bg-background flex justify-center items-center">
            <p className="text-xs sm:text-sm">
                &copy; {currentYear} Leelame. All rights reserved.
            </p>
        </footer>
    );
};

export default SiteFooter;