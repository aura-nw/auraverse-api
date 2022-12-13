/* eslint-disable camelcase */
import { AccountStatus, DbTable } from "../../common";
import { knex } from "../../config/database";
import { DatabaseMixin } from "./db-base.mixin";


export class DatabaseAccountMixin extends DatabaseMixin {
    private model: string = DbTable.ACCOUNT;

    public constructor() {
        super(DbTable.ACCOUNT);
    }

    public async checkExistAccount(username: string, email: string): Promise<any> {
        return await knex(this.model).select("*").
            where({ account_status: AccountStatus.ACTIVATED })
            .andWhere((builder: any) =>
                builder.where({ username }).orWhere({ email })
            ).first();
    }
}
