/* eslint-disable @typescript-eslint/no-var-requires */
import { Column, Entity } from "typeorm";
import { ProjectActiveStatus, ProjectCategories, ProjectStatus } from "../common";
import { knex } from "../config/database";
import { BaseModel } from "./base/base.model";

@Entity({ name: "project" })
export class Project extends BaseModel {
    @Column({ name: "account_id" })
    public accountId: number | undefined;

    @Column({ name: "name" })
    public name: string | undefined;

    @Column({ name: "email" })
    public email: string | undefined;

    @Column({
        name: "description",
        type: "text",
    })
    public description: string | undefined;

    @Column({
        name: "other_documentation",
        type: "text",
    })
    public otherDocumentation: string | undefined;

    @Column({
        name: "status",
        type: "enum",
        default: ProjectStatus.SUBMITTED,
    })
    public status: ProjectStatus | undefined;

    @Column({
        name: "active_status",
        type: "enum",
        default: ProjectActiveStatus.COMING_SOON,
    })
    public activeStatus: ProjectActiveStatus | undefined;

    @Column({
        name: "website",
        type: "text",
    })
    public website: string | undefined;

    @Column({
        name: "image_link",
        type: "text",
    })
    public imageLink: string | undefined;

    @Column({
        name: "categories",
        type: "json",
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

    @Column({
        name: "is_new",
        default: true,
    })
    public isNew: boolean | undefined;
}

Project.knex(knex);

module.exports = Project;
