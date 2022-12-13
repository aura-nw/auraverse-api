import { JSONSchema, snakeCaseMappers } from "objection";
import { AccountStatus, AccountType } from "../common";
import { knex } from "../config/database";
import { BaseModel } from "./base/base.model";

export class Account extends BaseModel {
    public static jsonSchema: JSONSchema = {
        type: "object",
        required: ["username", "email", "password", "accountType", "accountStatus"],
        properties: {
            id: { type: "integer" },
            createdAt: { type: "timestamp", default: "now()" },
            updatedAt: { type: "timestamp", default: "now()" },
            username: { type: "string", minLength: 1, maxLength: 255 },
            email: { type: "string", minLength: 1, maxLength: 255 },
            password: { type: "string", minLength: 1, maxLength: 255 },
            accountType: {
                type: "string",
                enum: [AccountType.ADMIN, AccountType.AUTHORIZED],
                default: AccountType.AUTHORIZED,
            },
            accountStatus: {
                type: "string",
                enum: [AccountStatus.WAITING, AccountStatus.ACTIVATED],
                default: AccountStatus.WAITING,
            },
            confirmationToken: { type: "string", minLength: 1, maxLength: 255 },
        },
    };

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
