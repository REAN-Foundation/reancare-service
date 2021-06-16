import express from 'express';
import { query, body, oneOf, validationResult, param } from 'express-validator';
import { ResponseHandler } from '../../common/response.handler';
import { Helper } from '../../common/helper';
import { PatientDomainModel, PatientSearchFilters } from '../../data/domain.types/patient.domain.types';
import { exists } from 'fs';
import { TypeHandler } from '../../common/type.handler';
import { Gender } from '../../common/system.types';
import { AddressDomainModel } from '../../data/domain.types/address.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientInputValidator {

    static getDomainModel = async (request: express.Request): Promise<PatientDomainModel> => {

        var addressModel: AddressDomainModel = null;
        var address = TypeHandler.checkObj(request.body.Address);
        if (address != null) {
            addressModel = {
                Type: 'Home',
                Line: request.body.Address.Line ?? null,
                City: request.body.Address.City ?? null,
                District: request.body.Address.District ?? null,
                State: request.body.Address.State ?? null,
                Country: request.body.Address.Country ?? null,
                PostalCode: request.body.Address.PostalCode ?? null,
                LocationCoordsLongitude: request.body.Address.LocationCoordsLongitude ?? null,
                LocationCoordsLattitude: request.body.Address.LocationCoordsLattitude ?? null,
            };
        }

        if (
            request.body.Gender !== 'Male' &&
            request.body.Gender !== 'Female' &&
            request.body.Gender !== 'male' &&
            request.body.Gender !== 'female' &&
            request.body.Gender !== 'Other' &&
            request.body.Gender !== 'other'
        ) {
            request.body.Gender = 'Unknown';
        }
        var entity: PatientDomainModel = {
            FirstName: request.body.FirstName ?? null,
            LastName: request.body.LastName ?? null,
            Prefix: request.body.Prefix ?? null,
            Phone: request.body.Phone ?? null,
            Email: request.body.Email ?? null,
            Gender: request.body.Gender ?? null,
            BirthDate: request.body.BirthDate ?? null,
            ImageResourceId: request.body.ImageResourceId ?? null,
            Address: addressModel,
        };
        if(entity.Gender != null && entity.Prefix == null) {
            entity.Prefix = Helper.guessPrefixByGender(entity.Gender);
        }
        return entity;
    };

    static create = async (
        request: express.Request,
        response: express.Response): Promise<PatientDomainModel> => {

        await oneOf([
            body('FirstName').optional().trim().escape(),
            body('LastName').optional().trim().escape(),
        ]).run(request);

        await oneOf([
            body('Phone').optional().trim().escape(), 
            body('Email').optional().trim().isEmail().escape()
        ]).run(request);

        await body('Prefix').optional().trim().escape().run(request);
        await body('Gender').optional().trim().escape().run(request);
        await body('BirthDate').optional().trim().escape().isDate().run(request);
        await body('ImageResourceId').optional().trim().escape().isUUID().run(request);
        await body('LocationCoordsLongitude').optional().trim().escape().isDecimal().run(request);
        await body('LocationCoordsLattitude').optional().trim().escape().isDecimal().run(request);
        await body('Address').optional().trim().escape().run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return PatientInputValidator.getDomainModel(request.body);
    };

    static getByUserId = async (request: express.Request, response: express.Response): Promise<string> => {
        await param('userId').trim().escape().isUUID().run(request);
        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.userId;
    };

    static search = async (
        request: express.Request,
        response: express.Response
    ): Promise<PatientSearchFilters> => {
        try {
            await query('phone').optional().trim().escape().run(request);
            await query('email').optional().trim().escape().run(request);
            await query('name').optional().trim().escape().run(request);
            await query('gender').optional().isAlpha().trim().escape().run(request);
            await query('birthdateFrom').optional().isDate().trim().escape().run(request);
            await query('birthdateTo').optional().isDate().trim().escape().run(request);
            await query('createdDateFrom').optional().isDate().trim().escape().run(request);
            await query('createdDateTo').optional().isDate().trim().escape().run(request);
            await query('orderBy').optional().trim().escape().run(request);
            await query('order').optional().trim().escape().run(request);
            await query('pageIndex').optional().isInt().trim().escape().run(request);
            await query('itemsPerPage').optional().isInt().trim().escape().run(request);
            await query('fullDetails').optional().isBoolean().run(request);

            const result = validationResult(request);
            if (!result.isEmpty()) {
                Helper.handleValidationError(result);
            }

            return PatientInputValidator.getFilter(request);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    private static getFilter(request): PatientSearchFilters {

        var pageIndex =
            request.query.pageIndex != 'undefined' 
                ? parseInt(request.query.pageIndex as string, 10) 
                : 0;

        var itemsPerPage =
            request.query.itemsPerPage != 'undefined'
                ? parseInt(request.query.itemsPerPage as string, 10)
                : 25;

        var filters: PatientSearchFilters = {
            Phone: request.query.phone ?? null,
            Email: request.query.email ?? null,
            Name: request.query.name ?? null,
            Gender: request.query.gender ?? null,
            BirthdateFrom: request.query.birthdateFrom ?? null,
            BirthdateTo: request.query.birthdateTo ?? null,
            CreatedDateFrom: request.query.createdDateFrom ?? null,
            CreatedDateTo: request.query.createdDateTo ?? null,
            OrderBy: request.query.orderBy ?? 'CreateAt',
            Order: request.query.order ?? 'descending',
            PageIndex: pageIndex,
            ItemsPerPage: itemsPerPage,
        };
        return filters;
    }

    static updateByUserId = async (
        request: express.Request,
        response: express.Response
    ): Promise<PatientDomainModel> => {
        try {

            await body('FirstName').optional().trim().escape().run(request);
            await body('LastName').optional().trim().escape().run(request);
            await body('Phone').optional().trim().escape().run(request);
            await body('Email').optional().trim().escape().isEmail().run(request);
            await body('Prefix').optional().trim().escape().run(request);
            await body('Gender').optional().trim().escape().run(request);
            await body('BirthDate').optional().trim().escape().isDate().run(request);
            await body('ImageResourceId').optional().trim().escape().isUUID().run(request);
            await body('LocationCoordsLongitude').optional().trim().escape().isDecimal().run(request);
            await body('LocationCoordsLattitude').optional().trim().escape().isDecimal().run(request);
            await body('Address').optional().trim().escape().run(request);

            const result = validationResult(request);
            if (!result.isEmpty()) {
                Helper.handleValidationError(result);
            }
            return PatientInputValidator.getDomainModel(request.body);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
}
