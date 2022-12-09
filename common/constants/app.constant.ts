export enum AppConstants {
    DEFAULT_GAS_PRICE = "0.002utaura",
    AUTO = "auto",
    DEFAULT_AMOUNT_FUND = 233444,
    DEFAULT_DENOM_FUND = "utaura",
    DEFAULT_DENOM = "utaura",
    INSUFFICIENT_FUNDS = "insufficient funds",
    ALREADY_SOLD = "already sold",
    MAX_TOKENS_PER_BATCH_MINT = 20,
    NOT_AUTHORIZED_EXEPTION = "NotAuthorizedException",
    NEW_PASS_REQUIRED = "callback.newPasswordRequired is not a function",
}

export enum DatabaseType {
    POSTGRES = "postgres",
    MYSQL = "mysql",
}

export enum CallApiMethod {
    GET = "GET",
    POST = "POST",
}

export enum ApiQuery {
    GET_DATA_CODE_ID = "/cosmwasm/wasm/v1/code/",
    GET_CODE_ID_VERIFICATION = "/api/v1/contracts/get-contract-by-code-id/",
}

export enum ContractVerification {
    VERIFIED = "VERIFIED",
    UNVERIFIED = "UNVERIFIED",
}

export enum AccountType {
    AUTHORIZED = "AUTHORIZED",
    ADMIN = "ADMIN",
}

export enum AccountStatus {
    ACTIVATED = "ACTIVATED",
    WAITING = "WAITING",
}

export enum RequestType {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    STORE_CODE_ID = "STORE_CODE_ID",
}

export enum ProjectActiveStatus {
    RELEASED = "RELEASED",
    COMING_SOON = "COMING SOON",
}

export enum ProjectStatus {
    SUBMITTED = "Submitted",
    APPROVED = "Approved",
    REJECTED = "Rejected",
}

export enum ProjectCategories {
    MARKETPLACE = "Marketplace",
    COLLECTIBLE = "Collectible",
    GAME = "Game",
    SPORTS = "Sports",
    ANALYTICS = "Analytics",
    FASHION = "Fashion",
    AVATAR = "Avatar",
    WALLETS = "Wallets",
    DEFI = "DeFi",
    EXCHANGE = "Exchange",
    FUNGIBLE_TOKEN = "Fungible Token",
    GALLERIES = "Galleries",
    ART = "Art",
    TOOLS = "Tools",
    MUSIC = "Music",
    MOBILE_APP = "Mobile App",
    THREE_D_WORLD = "3D World",
    DAO = "DAO",
    NFT_COLLECTION = "NFT Collection",
}
