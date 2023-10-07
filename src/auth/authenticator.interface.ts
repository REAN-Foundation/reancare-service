import express from 'express';
import { AuthenticationResult } from '../domain.types/auth/auth.domain.types';
import { CurrentUser } from '../domain.types/miscellaneous/current.user';
import { uuid } from '../domain.types/miscellaneous/system.types';

export interface IAuthenticator {

    authenticateUser(request: express.Request) : Promise<AuthenticationResult>;

    generateUserSessionToken(user: CurrentUser): Promise<string>;

    generateRefreshToken(userId: uuid, sessionId: uuid, tenantId: string): Promise<string>;

    rotateUserSessionToken(refreshToken: string): Promise<string>;

}
