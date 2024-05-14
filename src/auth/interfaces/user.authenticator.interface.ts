import express from 'express';
import { CurrentUser } from '../../domain.types/miscellaneous/current.user';
import { AuthResult } from '../auth.types';
import { uuid } from '../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export interface IUserAuthenticator {

    authenticate(request: express.Request) : Promise<AuthResult>;

    generateUserSessionToken(user: CurrentUser): Promise<string>;

    generateRefreshToken(userId: uuid, sessionId: uuid, tenantId: string): Promise<string>;

    rotateUserSessionToken(refreshToken: string): Promise<string>;

}
