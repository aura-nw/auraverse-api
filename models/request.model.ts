import { JSONSchema } from "objection";
import { ProjectActiveStatus, ProjectStatus, RequestType } from "../common";
import { BaseModel } from "./base/base.model";

export class Request extends BaseModel {
    public static jsonSchema: JSONSchema = {
        type: "object",
        required: ["projectId", "accountId"],
        properties: {
            id: { type: "integer" },
            createdAt: { type: "timestamp", default: "now()" },
            updatedAt: { type: "timestamp", default: "now()" },
            accountId: { type: "integer" },
            projectId: { type: "integer" },
            codeIds: { type: "string" },
            name: { type: "string", minLength: 1, maxLength: 255 },
            email: { type: "string", minLength: 1, maxLength: 255 },
            description: { type: "text" },
            otherDocumentation: { type: "text" },
            status: {
                type: "string",
                enum: [ProjectStatus.SUBMITTED, ProjectStatus.APPROVED, ProjectStatus.REJECTED,
                ProjectStatus.PROCESSING, ProjectStatus.ERROR],
            },
            activeStatus: {
                type: "string",
                enum: [ProjectActiveStatus.COMING_SOON, ProjectActiveStatus.RELEASED],
            },
            type: {
                type: "string",
                enum: [RequestType.CREATE, RequestType.DELETE, RequestType.UPDATE, RequestType.STORE_CODE_ID],
                default: RequestType.CREATE,
            },
            website: { type: "string", minLength: 1, maxLength: 255 },
            imageLink: { type: "string", minLength: 1, maxLength: 255 },
            categories: { type: "string" },
            whitepaper: { type: "string", minLength: 1, maxLength: 255 },
            github: { type: "string", minLength: 1, maxLength: 255 },
            telegram: { type: "string", minLength: 1, maxLength: 255 },
            wechat: { type: "string", minLength: 1, maxLength: 255 },
            linkedin: { type: "string", minLength: 1, maxLength: 255 },
            discord: { type: "string", minLength: 1, maxLength: 255 },
            medium: { type: "string", minLength: 1, maxLength: 255 },
            reddit: { type: "string", minLength: 1, maxLength: 255 },
            slack: { type: "string", minLength: 1, maxLength: 255 },
            facebook: { type: "string", minLength: 1, maxLength: 255 },
            twitter: { type: "string", minLength: 1, maxLength: 255 },
            bitcointalk: { type: "string", minLength: 1, maxLength: 255 },
            isNew: { type: "boolean", default: true },
        },
    };

    public accountId: number | undefined;
    public projectId: number | undefined;
    public codeIds: string | undefined;
    public name: string | undefined;
    public email: string | undefined;
    public description: string | undefined;
    public otherDocumentation: string | undefined;
    public status: ProjectStatus | undefined;
    public activeStatus: ProjectActiveStatus | undefined;
    public type: RequestType | undefined;
    public website: string | undefined;
    public imageLink: string | undefined;
    public categories: string | undefined;
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
}

module.exports = Request;
