// eslint-disable-next-line max-classes-per-file
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
