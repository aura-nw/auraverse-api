import { CustomError, ErrorMap } from "../common";

export class ResponseDto {
    public Code: string | undefined;
    public Message: string | undefined;
    public Data: any;

    public static response(
        errorMap: typeof ErrorMap.SUCCESSFUL,
        data?: any,
    ) {
        const res = new ResponseDto();
        return res.return(errorMap, data);
    }

    public static responseError(logger: any, error: Error | CustomError) {
        if (error instanceof CustomError) { return this.response(error.errorMap, error.msg); }
        logger.error(`${ErrorMap.E500.Code}: ${ErrorMap.E500.Message}`);
        logger.error(`${error.name}: ${error.message}`);
        logger.error(`${error.stack}`);
        return ResponseDto.response(ErrorMap.E500, error.message);
    }

    public return(
        errorMap: typeof ErrorMap.SUCCESSFUL,
        data?: any,
    ): ResponseDto {
        this.Code = errorMap.Code;
        this.Message = errorMap.Message;
        this.Data = data || {};
        return this;
    }
}
