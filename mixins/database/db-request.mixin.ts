/* eslint-disable id-blacklist */
import { DbTable } from "../../common";
import { knex } from "../../config/database";
import { DatabaseMixin } from "./db-base.mixin";

export class DatabaseRequestMixin extends DatabaseMixin {
    private model: string = DbTable.REQUEST;

    public constructor() {
        super(DbTable.REQUEST);
    }

    public async getListRequests(accountId?: number, limit?: number, offset?: number): Promise<any> {
        return (accountId !== undefined && accountId !== null)
            ? await knex(this.model).select("id", "name", "type", "status", "createdAt")
                .where({ accountId }).limit(limit ? limit : 10).offset(offset ? offset : 0)
            : await knex(this.model).select("id", "name", "type", "status", "createdAt")
                .limit(limit ? limit : 10).offset(offset ? offset : 0);
    }
}
