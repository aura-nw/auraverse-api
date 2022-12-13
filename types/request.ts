// eslint-disable-next-line max-classes-per-file
import { ProjectActiveStatus, ProjectCategories } from "../common";

export class SignUpPersonalAccountRequest {
    public username: string | undefined;
    public email: string | undefined;
    public password: string | undefined;
}

export class LoginRequest {
    public username: string | undefined;
    public password: string | undefined;
}

export class ConfirmSignUpRequest {
    public confirmationToken: string | undefined;
}

export class ForgotPasswordRequest {
    public email: string | undefined;
}

export class ChangePasswordRequest {
    public username: string | undefined;
    public oldPassword: string | undefined;
    public newPassword: string | undefined;
}

export class ChangeEmailRequest {
    public username: string | undefined;
    public newEmail: string | undefined;
    public password: string | undefined;
}

export class VerifyCodeIdOwnershipRequest {
    public codeId: number | undefined;
    public accountId: number | undefined;
}

export class CreateProjectRequest {
    public accountId: number | undefined;
    public codeIds: number[] | undefined;
    public name: string | undefined;
    public email: string | undefined;
    public description: string | undefined;
    public otherDocumentation: string | undefined;
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
}

export class UpdateProjectRequest {
    public projectId: number | undefined;
    public codeIds: number[] | undefined;
    public name: string | undefined;
    public email: string | undefined;
    public description: string | undefined;
    public otherDocumentation: string | undefined;
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
}
