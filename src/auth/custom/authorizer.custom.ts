import fs = require('fs');
import path = require('path');
import express from 'express';
import { Sequelize, Dialect } from 'sequelize';
import jwt = require('jsonwebtoken');

import { Logger } from '../../common/logger';
import { ResponseHandler } from '../../common/response.handler';
import { IAuthorizer } from '../../interfaces/authorizer.interface';

const execSync = require('child_process').execSync;

//////////////////////////////////////////////////////////////

export class Authorizer_custom implements IAuthorizer {

    public authorize = async (

        request: express.Request,
        response: express.Response) => {

            const authHeader = request.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1];
        
            if (token == null) {
                ResponseHandler.failure(request, response, 'Unauthorized access', 401);
                return;
            }
        
            try {

            }
            catch (err) {
                ResponseHandler.failure(request, response, 'Unauthorized access', 401);
            }            
    };




}
