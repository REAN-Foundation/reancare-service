import express from 'express';
import { CurrentUser } from '../../domain.types/miscellaneous/current.user';
import { AuthenticationResult } from '../../domain.types/auth/auth.domain.types';
import { uuid } from '../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export interface IUserAuthenticator {

    authenticate(request: express.Request) : Promise<AuthenticationResult>;

    generateUserSessionToken(user: CurrentUser): Promise<string>;

    generateRefreshToken(userId: uuid, sessionId: uuid, tenantId: string): Promise<string>;

    rotateUserSessionToken(refreshToken: string): Promise<string>;

}
