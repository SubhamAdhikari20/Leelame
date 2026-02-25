// src/helpers/http-url.helper.ts

export const normalizeHttpUrl = (url?: string | null): string | null => {
    if (!url) {
        return null;
    }

    if (/^https?:\/\//.test(url)) {
        return url;
    }

    const base = process.env.NEXT_PUBLIC_API_URL;
    if (!base) {
        throw new Error("Missing backend api url!  Please set NEXT_PUBLIC_API_URL.");
    }

    const fullUrl = `${base.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
    // console.log(fullUrl);

    return fullUrl;
};