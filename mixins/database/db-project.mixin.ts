/* eslint-disable id-blacklist */
import { DbTable } from "../../common";
import { knex } from "../../config/database";
import { DatabaseMixin } from "./db-base.mixin";

export class DatabaseProjectMixin extends DatabaseMixin {
    private model: string = DbTable.PROJECT;

    public constructor() {
        super(DbTable.PROJECT);
    }

    public async getListProjects(accountId?: number, limit?: number, offset?: number): Promise<any> {
        return (accountId !== undefined && accountId !== null)
            ? await knex(this.model).select("id", "name", "description", "status", "createdAt")
                .where({ accountId }).limit(limit ? limit : 10).offset(offset ? offset : 0)
            : await knex(this.model).select("id", "name", "description", "status", "createdAt")
                .limit(limit ? limit : 10).offset(offset ? offset : 0);
    }
}
