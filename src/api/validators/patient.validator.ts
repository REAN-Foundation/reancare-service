import express from 'express';
import { query, body, validationResult, param } from 'express-validator';
import { Helper } from '../../common/helper';
import { PatientDomainModel, PatientSearchFilters } from '../../data/domain.types/patient.domain.types';
import { AddressDomainModel } from '../../data/domain.types/address.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientValidator {

        static getDomainModel = async (request: express.Request): Promise<PatientDomainModel> => {
                
                const addressModel: AddressDomainModel = {
                        Type        : 'Home',
                        AddressLine : request.body.Address.AddressLine ?? null,
                        City        : request.body.Address.City ?? null,
                        District    : request.body.Address.District ?? null,
                        State       : request.body.Address.State ?? null,
                        Country     : request.body.Address.Country ?? null,
                        PostalCode  : request.body.Address.PostalCode ?? null,
                        Longitude   : request.body.Address.Longitude ?? null,
                        Lattitude   : request.body.Address.Lattitude ?? null,
                };

                const birthdate =
                        request.body.BirthDate != null && typeof request.body.BirthDate !== undefined
                                ? new Date(Date.parse(request.body.BirthDate))
                                : null;

                const phone = request.body.Phone;

                const entity: PatientDomainModel = {
                        User : {
                                Person : {
                                        FirstName       : request.body.FirstName ?? null,
                                        LastName        : request.body.LastName ?? null,
                                        Prefix          : request.body.Prefix ?? null,
                                        Phone           : phone,
                                        Email           : request.body.Email ?? null,
                                        Gender          : request.body.Gender ?? null,
                                        BirthDate       : birthdate,
                                        ImageResourceId : request.body.ImageResourceId ?? null,
                                },
                                id               : request.params.userId,
                                Password         : request.body.Password ?? null,
                                DefaultTimeZone  : request.body.DefaultTimeZone ?? null,
                                CurrentTimeZone  : request.body.DefaultTimeZone ?? null,
                                GenerateLoginOTP : request.body.DefaultTimeZone ?? null,
                        },
                        UserId  : request.params.userId,
                        Address : addressModel,
                };
                if (entity.User.Person.Gender != null && entity.User.Person.Prefix == null) {
                        entity.User.Person.Prefix = Helper.guessPrefixByGender(entity.User.Person.Gender);
                }
                return entity;
        };

        static create = async (
                request: express.Request
        ): Promise<PatientDomainModel> => {

                await body('Phone')
                        .exists()
                        .notEmpty()
                        .trim()
                        .escape()
                        .customSanitizer(Helper.sanitizePhone)
                        .custom(Helper.validatePhone)
                        .run(request);

                await body('Email').optional()
                        .trim()
                        .isEmail()
                        .escape()
                        .normalizeEmail()
                        .run(request);
                await body('FirstName').optional()
                        .trim()
                        .escape()
                        .run(request);
                await body('LastName').optional()
                        .trim()
                        .escape()
                        .run(request);
                await body('Prefix').optional()
                        .trim()
                        .escape()
                        .run(request);
                await body('Gender').optional()
                        .trim()
                        .escape()
                        .run(request);
                await body('BirthDate').optional()
                        .trim()
                        .escape()
                        .isDate()
                        .run(request);
                await body('ImageResourceId').optional()
                        .trim()
                        .escape()
                        .isUUID()
                        .run(request);

                // await body('Longitude').optional().trim().escape().isDecimal().run(request);
                // await body('Lattitude').optional().trim().escape().isDecimal().run(request);
                // await body('Address').optional().trim().escape().run(request);

                const result = validationResult(request);
                if (!result.isEmpty()) {
                        Helper.handleValidationError(result);
                }
                return PatientValidator.getDomainModel(request);
        };

        static getByUserId = async (request: express.Request): Promise<string> => {
                await param('userId').trim()
                        .escape()
                        .isUUID()
                        .run(request);
                const result = validationResult(request);
                if (!result.isEmpty()) {
                        Helper.handleValidationError(result);
                }
                return request.params.userId;
        };

        static delete = async (request: express.Request): Promise<string> => {
                await param('userId').trim()
                        .escape()
                        .isUUID()
                        .run(request);
                const result = validationResult(request);
                if (!result.isEmpty()) {
                        Helper.handleValidationError(result);
                }
                return request.params.userId;
        };

        static search = async (
                request: express.Request
        ): Promise<PatientSearchFilters> => {
                await query('phone').optional()
                        .trim()
                        .run(request);
                await query('email').optional()
                        .trim()
                        .escape()
                        .run(request);
                await query('name').optional()
                        .trim()
                        .escape()
                        .run(request);
                await query('gender').optional()
                        .isAlpha()
                        .trim()
                        .escape()
                        .run(request);
                await query('birthdateFrom').optional()
                        .isDate()
                        .trim()
                        .escape()
                        .run(request);
                await query('birthdateTo').optional()
                        .isDate()
                        .trim()
                        .escape()
                        .run(request);
                await query('createdDateFrom').optional()
                        .isDate()
                        .trim()
                        .escape()
                        .run(request);
                await query('createdDateTo').optional()
                        .isDate()
                        .trim()
                        .escape()
                        .run(request);
                await query('orderBy').optional()
                        .trim()
                        .escape()
                        .run(request);
                await query('order').optional()
                        .trim()
                        .escape()
                        .run(request);
                await query('pageIndex').optional()
                        .isInt()
                        .trim()
                        .escape()
                        .run(request);
                await query('itemsPerPage').optional()
                        .isInt()
                        .trim()
                        .escape()
                        .run(request);
                await query('fullDetails').optional()
                        .isBoolean()
                        .run(request);

                const result = validationResult(request);
                if (!result.isEmpty()) {
                        Helper.handleValidationError(result);
                }

                return PatientValidator.getFilter(request);
        };

        private static getFilter(request): PatientSearchFilters {
                const pageIndex =
                        request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

                const itemsPerPage =
                        request.query.itemsPerPage !== 'undefined'
                                ? parseInt(request.query.itemsPerPage as string, 10)
                                : 25;

                const filters: PatientSearchFilters = {
                        Phone           : request.query.phone ?? null,
                        Email           : request.query.email ?? null,
                        Name            : request.query.name ?? null,
                        Gender          : request.query.gender ?? null,
                        BirthdateFrom   : request.query.birthdateFrom ?? null,
                        BirthdateTo     : request.query.birthdateTo ?? null,
                        CreatedDateFrom : request.query.createdDateFrom ?? null,
                        CreatedDateTo   : request.query.createdDateTo ?? null,
                        OrderBy         : request.query.orderBy ?? 'CreatedAt',
                        Order           : request.query.order ?? 'descending',
                        PageIndex       : pageIndex,
                        ItemsPerPage    : itemsPerPage,
                };
                return filters;
        }

        static updateByUserId = async (
                request: express.Request
        ): Promise<PatientDomainModel> => {

                await body('Phone')
                        .optional()
                        .notEmpty()
                        .trim()
                        .escape()
                        .customSanitizer(Helper.sanitizePhone)
                        .custom(Helper.validatePhone)
                        .run(request);

                await body('Email').optional()
                        .trim()
                        .isEmail()
                        .escape()
                        .normalizeEmail()
                        .run(request);
                await body('FirstName').optional()
                        .trim()
                        .escape()
                        .run(request);
                await body('LastName').optional()
                        .trim()
                        .escape()
                        .run(request);
                await body('Prefix').optional()
                        .trim()
                        .escape()
                        .run(request);
                await body('Gender').optional()
                        .trim()
                        .escape()
                        .run(request);
                await body('BirthDate').optional()
                        .trim()
                        .escape()
                        .isDate()
                        .run(request);
                await body('ImageResourceId').optional()
                        .trim()
                        .escape()
                        .isUUID()
                        .run(request);

                // await body('Longitude').optional().trim().escape().isDecimal().run(request);
                // await body('Lattitude').optional().trim().escape().isDecimal().run(request);
                // await body('Address').optional().trim().escape().run(request);

                const result = validationResult(request);
                if (!result.isEmpty()) {
                        Helper.handleValidationError(result);
                }
                return PatientValidator.getDomainModel(request);
        };

}
