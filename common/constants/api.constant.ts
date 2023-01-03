export enum ApiConstants {
    SIGN_UP_PERSONAL_ACCOUNT = "sign-up",
    CONFIRM_SIGN_UP = "confirm/:confirmationToken",
    LOGIN = "login",
    FORGOT_PASSWORD = "forgot-password",
    CHANGE_PASSWORD = "change-password",
    CHANGE_EMAIL = "change-email",
    VERIFY_CODE_ID_OWNERSHIP = "verify-code-id-ownership",
    CREATE = "create",
    UPDATE = "update",
    LIST = "list",
    LIST_YOUR = "list/:accountId",
    DETAILS = "details/:id",
    CONFIRM = "confirm",
    REJECT = "reject",
    REQUEST_STORE_CODE_ID = "store-code-id"
}

export enum ModulePath {
    OPENAPI = "openapi",
    AUTH = "auth",
    ACCOUNT = "account",
    PROJECT = "project",
    REQUEST = "request",
}
