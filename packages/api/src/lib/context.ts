/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { ApiRequestMetadata } from "@repo/shared/universal";
import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import type { Logger } from "@repo/shared/utils";

export type TRPCContext = {
    req: Request;
    metadata: ApiRequestMetadata;
    logger: Logger;
    info: CreateHTTPContextOptions["info"];
    cache: Map<string | symbol, unknown>;
    res?: Response; // Optional response object for Hono
    resHeaders?: Headers; // Optional headers for Hono
};
