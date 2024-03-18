/* eslint-disable @typescript-eslint/no-unused-vars */
import express from "express";
import { Logger } from "../common/logger";

///////////////////////////////////////////////////////////////////////////////////////

export const errorHandlerMiddleware = (
    error, request: express.Request,
    response: express.Response,
    next: express.NextFunction) => {

    const stack = JSON.stringify(error.stack);
    Logger.instance().log(stack);
    const errMessage = error.message;
    const responseObject = {
        Status  : 'failure',
        Message : errMessage
    };
    response.status(500).send(responseObject);
};
