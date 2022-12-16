/* eslint-disable camelcase */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Knex } from "knex";
import * as bcrypt from "bcryptjs";
import { AccountStatus, AccountType, ProjectActiveStatus, ProjectStatus, RequestType } from "../common";

export async function up(knex: Knex) {
    await knex.schema.createTable("account", (table: any) => {
        table.increments("id").primary();
        table.timestamp("created_at").defaultTo(knex.raw("current_timestamp")).notNullable();
        table.timestamp("updated_at")
            .defaultTo(knex.raw("current_timestamp on update current_timestamp")).notNullable();
        table.string("username").unique().notNullable();
        table.string("email").unique().notNullable();
        table.string("password").notNullable();
        table.enum("account_type", [AccountType.ADMIN, AccountType.AUTHORIZED])
            .defaultTo(AccountType.AUTHORIZED).notNullable();
        table.enum("account_status", [AccountStatus.ACTIVATED, AccountStatus.WAITING])
            .defaultTo(AccountStatus.WAITING).notNullable();
        table.string("confirmation_token").nullable();
    });

    await knex.schema.createTable("code_id", (table: any) => {
        table.increments("id").primary();
        table.timestamp("created_at").defaultTo(knex.raw("current_timestamp")).notNullable();
        table.timestamp("updated_at")
            .defaultTo(knex.raw("current_timestamp on update current_timestamp")).notNullable();
        table.integer("code_id").unique().notNullable();
        table.integer("account_id").notNullable();
        table.string("creator").notNullable();
        table.string("data_hash").notNullable();
        table.longtext("data").notNullable();
        table.integer("mainnet_code_id").unique().nullable();
    });

    await knex.schema.createTable("project_code_id", (table: any) => {
        table.increments("id").primary();
        table.timestamp("created_at").defaultTo(knex.raw("current_timestamp")).notNullable();
        table.timestamp("updated_at")
            .defaultTo(knex.raw("current_timestamp on update current_timestamp")).notNullable();
        table.integer("project_id").notNullable();
        table.integer("internal_code_id").notNullable();
    });

    await knex.schema.createTable("project", (table: any) => {
        table.increments("id").primary();
        table.timestamp("created_at").defaultTo(knex.raw("current_timestamp")).notNullable();
        table.timestamp("updated_at")
            .defaultTo(knex.raw("current_timestamp on update current_timestamp")).notNullable();
        table.integer("account_id").notNullable();
        table.string("name").notNullable();
        table.string("email").notNullable();
        table.text("description").notNullable();
        table.text("other_documentation").nullable();
        table.enum("status", [ProjectStatus.APPROVED, ProjectStatus.REJECTED, ProjectStatus.SUBMITTED])
            .defaultTo(ProjectStatus.SUBMITTED).notNullable();
        table.enum("active_status", [ProjectActiveStatus.COMING_SOON, ProjectActiveStatus.RELEASED])
            .defaultTo(ProjectActiveStatus.COMING_SOON).notNullable();
        table.text("website").notNullable();
        table.text("image_link").notNullable();
        table.json("categories").notNullable();
        table.string("whitepaper").nullable();
        table.string("github").nullable();
        table.string("telegram").nullable();
        table.string("wechat").nullable();
        table.string("linkedin").nullable();
        table.string("discord").nullable();
        table.string("medium").nullable();
        table.string("reddit").nullable();
        table.string("slack").nullable();
        table.string("facebook").nullable();
        table.string("twitter").nullable();
        table.string("bitcointalk").nullable();
        table.boolean("is_new").defaultTo(true).notNullable();
    });

    await knex.schema.createTable("request", (table: any) => {
        table.increments("id").primary();
        table.timestamp("created_at").defaultTo(knex.raw("current_timestamp")).notNullable();
        table.timestamp("updated_at")
            .defaultTo(knex.raw("current_timestamp on update current_timestamp")).notNullable();
        table.integer("project_id").notNullable();
        table.json("codeIds").nullable();
        table.string("name").nullable();
        table.string("email").nullable();
        table.text("description").nullable();
        table.text("other_documentation").nullable();
        table.enum("status", [ProjectStatus.APPROVED, ProjectStatus.REJECTED, ProjectStatus.SUBMITTED]).nullable();
        table.enum("type", [RequestType.CREATE, RequestType.DELETE, RequestType.UPDATE, RequestType.STORE_CODE_ID])
            .defaultTo(RequestType.CREATE).nullable();
        table.text("website").nullable();
        table.text("image_link").nullable();
        table.json("categories").nullable();
        table.string("whitepaper").nullable();
        table.string("github").nullable();
        table.string("telegram").nullable();
        table.string("wechat").nullable();
        table.string("linkedin").nullable();
        table.string("discord").nullable();
        table.string("medium").nullable();
        table.string("reddit").nullable();
        table.string("slack").nullable();
        table.string("facebook").nullable();
        table.string("twitter").nullable();
        table.string("bitcointalk").nullable();
    });

    await knex("account").insert({
        username: "admin",
        email: "verify@aura.network",
        password: bcrypt.hashSync("aura@2022", 8),
        account_type: AccountType.ADMIN,
        account_status: AccountStatus.ACTIVATED,
        confirmation_token: null,
    });
}


export async function down(knex: Knex) {
    knex.schema.dropTable("account");
    knex.schema.dropTable("code_id");
    knex.schema.dropTable("project_code_id");
    knex.schema.dropTable("project");
    knex.schema.dropTable("request");
}

