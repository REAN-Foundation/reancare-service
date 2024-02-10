import { Logger } from "../common/logger";

///////////////////////////////////////////////////////////////////////////////////////

export const errorHandlerMiddleware = (err, req, res, next) => {
    const stack = JSON.stringify(err.stack);
    Logger.instance().log(stack);
    const errMessage = err.message;
    const responseObject = {
        Status  : 'failure',
        Message : errMessage
    };
    res.status(500).send(responseObject);
};
