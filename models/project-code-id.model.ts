import { JSONSchema, snakeCaseMappers } from "objection";
import { knex } from "../config/database";
import { BaseModel } from "./base/base.model";

export class ProjectCodeId extends BaseModel {
    public static jsonSchema: JSONSchema = {
        type: "object",
        required: ["projectId", "internalCodeId"],
        properties: {
            id: { type: "integer" },
            createdAt: { type: "timestamp", default: "now()" },
            updatedAt: { type: "timestamp", default: "now()" },
            projectId: { type: "integer" },
            internalCodeId: { type: "integer" },
        },
    };

    public projectId: number | undefined;
    public internalCodeId: number | undefined;

    public static get columnNameMappers() {
        return snakeCaseMappers();
    }
}

ProjectCodeId.knex(knex);

module.exports = ProjectCodeId;
