import express from 'express';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class UserEngagementValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDateRanges = async (request: express.Request) => {
        await this.validateDateString(request, 'from', Where.Query, false, true);
        await this.validateDateString(request, 'to', Where.Query, false, true);
        this.validateRequest(request);
        const from = request.query.from;
        const to = request.query.to;
        return { from, to };
    };

}
