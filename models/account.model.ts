/* eslint-disable @typescript-eslint/no-var-requires */
import { Column, Entity } from "typeorm";
import { AccountStatus, AccountType } from "../common";
import { knex } from "../config/database";
import { BaseModel } from "./base/base.model";

@Entity({ name: "account" })
export class Account extends BaseModel {
    @Column({
        name: "username",
        unique: true,
    })
    public username: string | undefined;

    @Column({
        name: "email",
        unique: true,
    })
    public email: string | undefined;

    @Column({ name: "password" })
    public password: string | undefined;

    @Column({
        name: "account_type",
        type: "enum",
        default: AccountType.AUTHORIZED,
    })
    public accountType: AccountType | undefined;

    @Column({
        name: "account_status",
        type: "enum",
        default: AccountStatus.WAITING,
    })
    public accountStatus: AccountStatus | undefined;

    @Column({
        name: "confirmation_token",
        nullable: true,
    })
    public confirmationToken: string | undefined;
}

Account.knex(knex);

module.exports = Account;
