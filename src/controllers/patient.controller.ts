import express from 'express';
const { query, body, oneOf, validationResult, param } = require('express-validator');
import { Loader } from '../startup/loader';
import { Helper } from '../common/helper';
import { ResponseHandler } from '../common/response.handler';

///////////////////////////////////////////////////////////////////////////////////////

export class UserController {
    constructor() {}

    //#region create

    create = async (request: express.Request, response: express.Response) => {
        throw new Error('Method not implemented.');
    };

    setCreateContext = (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) => {
        request.context = 'User.Create';
        next();
    };

    sanitizeCreate = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) => {
        try {
            await body('prefix')
                .exists()
                .isLength({ min: 1 })
                .trim()
                .escape()
                .run(request);
            await body('first_name')
                .exists()
                .isAlpha()
                .isLength({ min: 1 })
                .trim()
                .escape()
                .run(request);
            await body('last_name')
                .exists()
                .isAlpha()
                .isLength({ min: 1 })
                .trim()
                .escape()
                .run(request);
            await body('phone')
                .isMobilePhone()
                .isLength({ min: 10 })
                .trim()
                .escape()
                .run(request);
            await body('email')
                .normalizeEmail()
                .isEmail()
                .trim()
                .escape()
                .run(request);
            await body('password').trim().run(request);

            // await body('company_id').isUUID().run(request);
            const result = validationResult(request);
            if (!result.isEmpty()) {
                Helper.handleValidationError(result);
            }
            next();
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    //#endregion

    //#region userExists

    userExists = async (
        request: express.Request,
        response: express.Response
    ) => {};

    //#endregion

    //#region loginWithPassword

    loginWithPassword = async (
        request: express.Request,
        response: express.Response
    ) => {};

    //#endregion

    //#region generateOtp

    generateOtp = async (
        request: express.Request,
        response: express.Response
    ) => {};

    //#endregion

    //#region loginWithOtp

    loginWithOtp = async (
        request: express.Request,
        response: express.Response
    ) => {};

    //#endregion

    
};