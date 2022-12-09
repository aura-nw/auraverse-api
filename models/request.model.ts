/* eslint-disable @typescript-eslint/no-var-requires */
import { Column, Entity } from "typeorm";
import { ProjectCategories, ProjectStatus, RequestType } from "../common";
import { knex } from "../config/database";
import { BaseModel } from "./base/base.model";

@Entity({ name: "request" })
export class Request extends BaseModel {
    @Column({ name: "project_id" })
    public projectId: number | undefined;

    @Column({
        name: "name",
        nullable: true,
    })
    public name: string | undefined;

    @Column({
        name: "email",
        nullable: true,
    })
    public email: string | undefined;

    @Column({
        name: "description",
        type: "text",
        nullable: true,
    })
    public description: string | undefined;

    @Column({
        name: "other_documentation",
        type: "text",
        nullable: true,
    })
    public otherDocumentation: string | undefined;

    @Column({
        name: "status",
        type: "enum",
        nullable: true,
    })
    public status: ProjectStatus | undefined;

    @Column({
        name: "type",
        type: "enum",
        default: RequestType.CREATE,
    })
    public type: RequestType | undefined;

    @Column({
        name: "website",
        type: "text",
        nullable: true,
    })
    public website: string | undefined;

    @Column({
        name: "image_link",
        type: "text",
        nullable: true,
    })
    public imageLink: string | undefined;

    @Column({
        name: "categories",
        type: "json",
        nullable: true,
    })
    public categories: ProjectCategories[] | undefined;

    @Column({
        name: "whitepaper",
        nullable: true,
    })
    public whitepaper: string | undefined;

    @Column({
        name: "github",
        nullable: true,
    })
    public github: string | undefined;

    @Column({
        name: "telegram",
        nullable: true,
    })
    public telegram: string | undefined;

    @Column({
        name: "wechat",
        nullable: true,
    })
    public wechat: string | undefined;

    @Column({
        name: "linkedin",
        nullable: true,
    })
    public linkedin: string | undefined;

    @Column({
        name: "discord",
        nullable: true,
    })
    public discord: string | undefined;

    @Column({
        name: "medium",
        nullable: true,
    })
    public medium: string | undefined;

    @Column({
        name: "reddit",
        nullable: true,
    })
    public reddit: string | undefined;

    @Column({
        name: "slack",
        nullable: true,
    })
    public slack: string | undefined;

    @Column({
        name: "facebook",
        nullable: true,
    })
    public facebook: string | undefined;

    @Column({
        name: "twitter",
        nullable: true,
    })
    public twitter: string | undefined;

    @Column({
        name: "bitcointalk",
        nullable: true,
    })
    public bitcointalk: string | undefined;
}

Request.knex(knex);

module.exports = Request;
