import { snakeCaseMappers } from "objection";
import { knex } from "../config/database";
import { BaseModel } from "./base/base.model";

export class ProjectCodeId extends BaseModel {
    public projectId: number | undefined;
    public internalCodeId: number | undefined;

    public static get columnNameMappers() {
        return snakeCaseMappers();
    }
}

ProjectCodeId.knex(knex);

module.exports = ProjectCodeId;
