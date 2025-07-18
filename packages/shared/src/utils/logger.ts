import { pino, type TransportTargetOptions } from "pino";

const transports: TransportTargetOptions[] = [];

if (
    process.env.NODE_ENV !== "production" &&
    !process.env.INTERNAL_FORCE_JSON_LOGGER
) {
    transports.push({
        target: "pino-pretty",
        level: "info",
    });
}

const loggingFilePath = process.env.VITE_PRIVATE_LOGGER_FILE_PATH;

if (loggingFilePath) {
    transports.push({
        target: "pino/file",
        level: "info",
        options: {
            destination: loggingFilePath,
            mkdir: true,
        },
    });
}

export const logger = pino({
    level: "info",
    transport: transports.length > 0
        ? {
            targets: transports,
        }
        : undefined,
});
