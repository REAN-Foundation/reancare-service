import fs = require('fs');
import path = require('path');
import express from 'express';
import { Sequelize, Dialect } from 'sequelize';
import jwt = require('jsonwebtoken');

import { Logger } from '../../common/logger';
import { ResponseHandler } from '../../common/response.handler';
import { IAuthenticator } from '../../interfaces/authenticator.interface';
import { ApiClientService } from '../../services/api.client.service';
import { Loader } from '../../startup/loader';
import { CurrentClient } from '../../data/domain.types/current.client';

const execSync = require('child_process').execSync;

//////////////////////////////////////////////////////////////

export class Authenticator_jwt implements IAuthenticator {
    _clientService: ApiClientService = null;

    constructor() {
        this._clientService = Loader.container.resolve(ApiClientService);
    }

    public authenticateUser = async (request: express.Request, response: express.Response) => {
        const authHeader = request.headers['authorization'];
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
        } catch (err) {
            Logger.instance().log(JSON.stringify(err, null, 2));
        }
    };

    public authenticateClient = async (request: express.Request, response: express.Response) => {
        try {
            var apiKey: string = request.headers['X-API-KEY'] as string;
            if (!apiKey) {
                ResponseHandler.failure(request, response, 'Missing API key for the client', 401);
                return;
            }
            apiKey = apiKey.trim();
            var client: CurrentClient = await this._clientService.isApiKeyValid(apiKey);
            if (!client) {
                ResponseHandler.failure(request, response, 'Invalid API Key: Forebidden access', 403);
                return;
            }
            request.currentClient = client;
        } catch (err) {
            Logger.instance().log(JSON.stringify(err, null, 2));
        }
    };
}
