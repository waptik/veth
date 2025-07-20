/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { Context } from "hono";

import type { Logger } from "@repo/shared/utils";
import { HonoEnv } from "@repo/shared";
import { ApiRequestMetadata } from "@repo/shared/universal";

export type TRPCContext = {
  req: Request;
  metadata: ApiRequestMetadata;
  logger: Logger;
  info: CreateHTTPContextOptions["info"];
  cache: Map<string | symbol, unknown>;
  res?: Response; // Optional response object for Hono
  resHeaders?: Headers; // Optional headers for Hono
};
