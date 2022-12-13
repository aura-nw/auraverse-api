import { snakeCaseMappers } from "objection";
import { AccountStatus, AccountType } from "../common";
import { knex } from "../config/database";
import { BaseModel } from "./base/base.model";

export class Account extends BaseModel {
    public username: string | undefined;
    public email: string | undefined;
    public password: string | undefined;
    public accountType: AccountType | undefined;
    public accountStatus: AccountStatus | undefined;
    public confirmationToken: string | undefined;

    public static get columnNameMappers() {
        return snakeCaseMappers();
    }
}

Account.knex(knex);

module.exports = Account;
