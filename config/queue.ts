"use strict";

import { Config } from "../common";

export const queueConfig = {
    redis:
        Config.REDIS_URI ??
        `redis://${Config.REDIS_USERNAME}:${Config.REDIS_PASSWORD}@${Config.REDIS_HOST}:${Config.REDIS_PORT}/${Config.REDIS_DB_NUMBER}`,
    opts: {
        prefix: "auraverse-backend",
    },
};

export const queues = [
    "request.store-code-id",
];
