import { snakeCaseMappers } from "objection";
import { knex } from "../config/database";
import { ProjectActiveStatus, ProjectCategories, ProjectStatus } from "../common";
import { BaseModel } from "./base/base.model";

export class Project extends BaseModel {
    public accountId: number | undefined;
    public name: string | undefined;
    public email: string | undefined;
    public description: string | undefined;
    public otherDocumentation: string | undefined;
    public status: ProjectStatus | undefined;
    public activeStatus: ProjectActiveStatus | undefined;
    public website: string | undefined;
    public imageLink: string | undefined;
    public categories: ProjectCategories[] | undefined;
    public whitepaper: string | undefined;
    public github: string | undefined;
    public telegram: string | undefined;
    public wechat: string | undefined;
    public linkedin: string | undefined;
    public discord: string | undefined;
    public medium: string | undefined;
    public reddit: string | undefined;
    public slack: string | undefined;
    public facebook: string | undefined;
    public twitter: string | undefined;
    public bitcointalk: string | undefined;
    public isNew: boolean | undefined;

    public static get columnNameMappers() {
        return snakeCaseMappers();
    }
}

Project.knex(knex);

module.exports = Project;
