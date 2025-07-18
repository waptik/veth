// @see https://github.com/documenso/documenso/blob/main/packages/lib/universal/get-ip-address.ts
export const getIpAddress = (req: Request) => {
    // Check for forwarded headers first (common in proxy setups)
    const forwarded = req.headers.get("x-forwarded-for");
    console.log("[getIpAddress] >> Forwarded", forwarded);

    if (forwarded) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return forwarded.split(",")[0].trim();
    }

    // Check for real IP header (used by some proxies)
    const realIp = req.headers.get("x-real-ip");
    console.log("[getIpAddress] >> Real IP", realIp);

    if (realIp) {
        return realIp;
    }

    // Check for client IP header
    const clientIp = req.headers.get("x-client-ip");
    console.log("[getIpAddress] >> Client IP", clientIp);

    if (clientIp) {
        return clientIp;
    }

    // Check for CF-Connecting-IP (Cloudflare)
    const cfConnectingIp = req.headers.get("cf-connecting-ip");
    console.log("[getIpAddress] >> CF Connecting IP", cfConnectingIp);

    if (cfConnectingIp) {
        return cfConnectingIp;
    }

    // Check for True-Client-IP (Akamai and Cloudflare)
    const trueClientIp = req.headers.get("true-client-ip");
    console.log("[getIpAddress] >> True Client IP", trueClientIp);

    if (trueClientIp) {
        return trueClientIp;
    }

    throw new Error("No IP address found");
};
