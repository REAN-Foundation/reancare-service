import fs = require('fs');
import path = require('path');
import express from 'express';
import { Sequelize, Dialect } from 'sequelize';
import jwt = require('jsonwebtoken');

import { Logger } from '../../common/logger';
import { ResponseHandler } from '../../common/response.handler';
import { IAuthorizer } from '../../interfaces/authorizer.interface';
import { CurrentUser } from '../../data/domain.types/current.user';
import { ApiError } from '../../common/api.error';

const execSync = require('child_process').execSync;

//////////////////////////////////////////////////////////////

export class Authorizer_custom implements IAuthorizer {
    public authorize = async (request: express.Request, response: express.Response) => {

        const authHeader = request.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            throw new ApiError(401, 'Unauthorized access');
        }

        // try {
        // } catch (error) {
        //     throw new ApiError(401, 'Unauthorized access' + error.message);
        // }
    };

    public generateUserSessionToken = async (user: CurrentUser): Promise<string> => {
        return new Promise((resolve, reject) => {
            try {
                const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '90d' });
                resolve(token);
            } catch (error) {
                reject(error);
            }
        });
    };
}
