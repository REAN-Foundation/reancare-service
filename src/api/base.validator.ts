import express from 'express';
import { body, param, query, ValidationChain, validationResult } from 'express-validator';
import { Helper } from '../common/helper';
import { integer, uuid } from '../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export enum Where {
    Body  = 'Body',
    Param = 'Param',
    Query = 'Query'
}

export class BaseValidator {

    //#region Param extraction

    isFalsy(str) {
        return !str || str === null || (str as string).length === 0;
    }

    isTruthy(str) {
        return str && str !== null && (str as string).length > 0;
    }

    getParamUuid = async(request: express.Request, field: string): Promise<uuid> => {
        this.validateUuid(request, field, Where.Param, true, false);
        this.validateRequest(request);
        return request.params[field];
    };

    getParamInt = async(request: express.Request, field: string): Promise<number> => {
        await this.validateInt(request, field, Where.Param, false, false);
        this.validateRequest(request);
        var p = request.params[field];
        return parseInt(p);
    };

    getParamDate = async(request: express.Request, field: string): Promise<Date> => {
        await this.validateDate(request, field, Where.Param, true, false);
        this.validateRequest(request);
        var p = request.params[field];
        return new Date(p);
    };

    getParamStr = async(
        request: express.Request,
        field: string,
        escape?: boolean,
        minLength?: number,
        maxLength?: number): Promise<string> => {
        await this.validateString(request, field, Where.Param, true, false, escape, minLength, maxLength);
        this.validateRequest(request);
        return request.params[field];
    };

    getQueryStr = async(
        request: express.Request,
        field: string,
        escape?: boolean,
        minLength?: number,
        maxLength?: number): Promise<string> => {
        await this.validateString(request, field, Where.Query, false, false, escape, minLength, maxLength);
        this.validateRequest(request);
        return request.query[field] ? request.query[field] as string : null;
    };

    getQueryUuid = async(
        request: express.Request,
        field: string): Promise<string> => {
        await this.validateUuid(request, field, Where.Query, false, false);
        this.validateRequest(request);
        return request.query[field] ? request.query[field] as string : null;
    };

    getQueryInt = async(request: express.Request, field): Promise<number> => {
        await this.validateInt(request, field, Where.Query, false, false);
        this.validateRequest(request);
        return request.query[field] ? parseInt(request.query[field] as string) : null;
    };

    //#endregion

    validateUuid = async(
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean) => {

        var chain: ValidationChain = this.getValidationChain(field, where);
        chain = chain.trim();
        chain = this.checkRequired(required, chain, nullable);

        await chain.run(request);
    };

    validateString = async(
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean,
        escape?: boolean,
        minLength?: number,
        maxLength?: number) => {

        var chain: ValidationChain = this.getValidationChain(field, where);
        chain = chain.trim();
        chain = this.checkRequired(required, chain, nullable);
        if (escape) chain = chain.escape();
        chain = this.checkLength(chain, minLength, maxLength);

        await chain.run(request);
    };

    validateDateString = async(
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean) => {

        var chain: ValidationChain = this.getValidationChain(field, where);
        chain = chain.trim();
        chain = this.checkRequired(required, chain, nullable);
        chain = chain.isDate();

        await chain.run(request);
    };

    validateArray = async(
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean,
        minLength?: number,
        maxLength?: number) => {

        var chain: ValidationChain = this.getValidationChain(field, where);
        chain = this.checkRequired(required, chain, nullable);
        chain = chain.isArray();
        chain = this.checkLength(chain, minLength, maxLength);

        await chain.run(request);
    };

    validateDate = async(
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean) => {

        var chain: ValidationChain = this.getValidationChain(field, where);
        chain = this.checkRequired(required, chain, nullable);

        chain = chain.customSanitizer((value) => {
            if (value !== null && value !== undefined) {
                //value = value.trim();
                var x = Date.parse(value);
                value = new Date(x);
                return value;
            }
        });

        await chain.run(request);
    };

    validateObject = async(
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean) => {

        var chain: ValidationChain = this.getValidationChain(field, where);
        chain = this.checkRequired(required, chain, nullable);
        if (required) {
            chain = chain.notEmpty();
        }

        await chain.run(request);
    };

    validateEmail = async(
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean) => {

        var chain: ValidationChain = this.getValidationChain(field, where);
        chain = this.checkRequired(required, chain, nullable);

        chain = chain.trim();
        chain = chain.isEmail();
        chain = chain.normalizeEmail();

        await chain.run(request);
    };

    validatePhone = async(
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean) => {

        var chain: ValidationChain = this.getValidationChain(field, where);
        chain = chain.trim();
        chain = this.checkRequired(required, chain, nullable);
        chain = chain.notEmpty();
        chain = chain.customSanitizer(Helper.sanitizePhone);
        chain = chain.custom(Helper.validatePhone);

        await chain.run(request);
    };

    validateBoolean = async(
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean) => {

        var chain: ValidationChain = this.getValidationChain(field, where);
        chain = chain.trim();
        chain = this.checkRequired(required, chain, nullable);
        chain = chain.isBoolean();
        chain = chain.toBoolean();

        await chain.run(request);
    };

    validateInt = async(
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean) => {

        var chain: ValidationChain = this.getValidationChain(field, where);
        chain = chain.trim();
        chain = this.checkRequired(required, chain, nullable);
        chain = chain.isInt();
        chain = chain.toInt();

        await chain.run(request);
    };

    validateDecimal = async(
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean) => {

        var chain: ValidationChain = this.getValidationChain(field, where);
        chain = chain.trim();
        chain = this.checkRequired(required, chain, nullable);
        chain = chain.isDecimal();
        chain = chain.toFloat();

        await chain.run(request);
    };

    validateAny = async(
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean) => {

        var chain: ValidationChain = this.getValidationChain(field, where);
        chain = chain.trim();
        chain = this.checkRequired(required, chain, nullable);
        await chain.run(request);
    };

    validateBaseSearchFilters = async(request: express.Request) => {

        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);
        await this.validateString(request, 'orderBy', Where.Query, false, false, true);
        await this.validateString(request, 'order', Where.Query, false, false, true);
        await this.validateInt(request, 'pageIndex', Where.Query, false, false);
        await this.validateInt(request, 'itemsPerPage', Where.Query, false, false);

        if (request.query.order !== undefined &&
            request.query.order !== 'descending' &&
            request.query.order !== 'ascending') {
            request.query.order = 'descending';
        }
    };

    validateRequest = (request: express.Request) => {
        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    };

    updateBaseSearchFilters = (request: express.Request, filters: any): any => {

        const pageIndex: integer = request.query.pageIndex !== 'undefined' ?
            parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage: integer = request.query.itemsPerPage !== 'undefined' ?
            parseInt(request.query.itemsPerPage as string, 10) : 25;

        filters['CreatedDateFrom'] = request.query.createdDateFrom ? new Date(request.query.createdDateFrom as string) : null;
        filters['CreatedDateTo']   = request.query.createdDateTo ? new Date(request.query.createdDateTo as string) : null;
        filters['OrderBy']         = request.query.orderBy as string ?? 'CreatedAt';
        filters['Order']           = request.query.order as string ?? 'descending';
        filters['PageIndex']       = pageIndex;
        filters['ItemsPerPage']    = itemsPerPage;

        return filters;
    };

    //#region Protected

    checkLength(chain: ValidationChain, minLength?: number, maxLength?: number) {

        if (minLength || maxLength) {
            var options = {};
            if (minLength)
                options['min'] = minLength;
            if (maxLength)
                options['max'] = maxLength;
            chain = chain.isLength(options);
        }
        return chain;
    }

    checkRequired(required: boolean, chain: ValidationChain, nullable: boolean) {
        if (required) {
            chain = chain.exists();
        }
        else {
            chain = chain.optional({ nullable: nullable });
        }
        return chain;
    }

    getValidationChain(field: string, where: Where): ValidationChain {

        var chain: ValidationChain = null;

        if (where === Where.Body) {
            chain = body(field);
        }
        else if (where === Where.Param) {
            chain = param(field);
        }
        else {
            chain = query(field);
        }
        return chain;
    }

    //#endregion

}
