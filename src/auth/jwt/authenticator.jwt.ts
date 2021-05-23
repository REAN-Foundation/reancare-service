import fs = require('fs');
import path = require('path');
import express from 'express';
import { Sequelize, Dialect } from 'sequelize';
import jwt = require('jsonwebtoken');

import { Logger } from '../../common/logger';
import { ResponseHandler } from '../../common/response.handler';
import { IAuthenticator } from '../../interfaces/authenticator.interface';

const execSync = require('child_process').execSync;

//////////////////////////////////////////////////////////////

export class Authenticator_jwt implements IAuthenticator {

    public authenticate = async (

        request: express.Request,
        response: express.Response) => {

            const authHeader = request.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1];
        
            if (token == null) {
                ResponseHandler.failure(request, response, 'Unauthorized access', 401);
                return;
            }
        
            try {
                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
                    if (error) {
                        ResponseHandler.failure(request, response, 'Forebidden access', 403);
                        return;
                    }
                    request.currentUser = user;
                });
            }
            catch (err) {
                Logger.instance().log(JSON.stringify(err, null, 2));
            }            
    };




}
