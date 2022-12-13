import { JSONSchema, snakeCaseMappers } from "objection";
import { knex } from "../config/database";
import { BaseModel } from "./base/base.model";

export class CodeId extends BaseModel {
    public static jsonSchema: JSONSchema = {
        type: "object",
        required: ["codeId", "accountId", "creator", "dataHash", "data"],
        properties: {
            id: { type: "integer" },
            createdAt: { type: "timestamp", default: "now()" },
            updatedAt: { type: "timestamp", default: "now()" },
            codeId: { type: "integer" },
            accountId: { type: "integer" },
            creator: { type: "string", minLength: 1, maxLength: 255 },
            dataHash: { type: "string", minLength: 1, maxLength: 255 },
            data: { type: "text" },
        },
    };

    public codeId: number | undefined;
    public accountId: number | undefined;
    public creator: string | undefined;
    public dataHash: string | undefined;
    public data: string | undefined;
    public mainnetCodeId: number | undefined;

    public static get columnNameMappers() {
        return snakeCaseMappers();
    }
}

CodeId.knex(knex);

module.exports = CodeId;
