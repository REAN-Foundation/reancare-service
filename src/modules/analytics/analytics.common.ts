import express from 'express';
import { UserDetailsDto } from "../../domain.types/users/user/user.dto";

export const getCommonEventParams = (request: express.Request, user?: UserDetailsDto) => {
    const sourceName = request.currentClient?.ClientName ?? 'Unknown';
    const userId     = user?.id ?? request.currentUser.UserId ?? null;
    const tenantId   = user?.TenantId ?? request.currentUser.TenantId ?? null;
    const sessionId  = request.currentUser?.SessionId ?? null;
    const actionType = 'user-action';
    return { 
        UserId: userId, 
        TenantId: tenantId, 
        SessionId: sessionId, 
        SourceName: sourceName, 
        SourceVersion: 'unknown',
        ActionType: actionType,
        Timestamp: new Date()
    };

};
