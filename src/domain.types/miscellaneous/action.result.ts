import { integer } from "./system.types";

export class ActionResult {

    Status   : boolean;

    Message  : string;

    ErrorCode: number;

    constructor(status: boolean, message: string, errorCode: integer) {
        this.Status = status;
        this.Message = message;
        this.ErrorCode = errorCode;
    }

}
