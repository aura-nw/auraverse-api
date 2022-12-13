import { snakeCaseMappers } from "objection";
import { knex } from "../config/database";
import { BaseModel } from "./base/base.model";

export class CodeId extends BaseModel {
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
