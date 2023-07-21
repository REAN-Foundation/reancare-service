import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ReminderService } from '../../../services/general/reminder.service';
import { OrganizationService } from '../../../services/general/organization.service';
import { PersonService } from '../../../services/person/person.service';
import { RoleService } from '../../../services/role/role.service';
import { Loader } from '../../../startup/loader';
import { ReminderValidator } from './reminder.validator';
import { BaseController } from '../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class ReminderController extends BaseController {

    //#region member variables and constructors

    _service: ReminderService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _organizationService: OrganizationService = null;

    _validator = new ReminderValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(ReminderService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._organizationService = Loader.container.resolve(OrganizationService);
    }

    //#endregion

    //#region Action methods

    createOneTimeReminder = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Reminder.CreateOneTimeReminder', request, response);

            const domainModel = await this._validator.createOneTimeReminder(request);
            const reminder = await this._service.create(domainModel);
            if (reminder == null) {
                throw new ApiError(400, 'Cannot create reminder!');
            }

            ResponseHandler.success(request, response, 'Reminder created successfully!', 201, {
                Reminder : reminder,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    createReminderWithRepeatAfterEveryN = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Reminder.CreateReminderWithRepeatAfterEveryN', request, response);

            const domainModel = await this._validator.createReminderWithRepeatAfterEveryN(request);
            const reminder = await this._service.create(domainModel);
            if (reminder == null) {
                throw new ApiError(400, 'Cannot create reminder!');
            }

            ResponseHandler.success(request, response, 'Reminder created successfully!', 201, {
                Reminder : reminder,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    createReminderWithRepeatEveryWeekday = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Reminder.CreateReminderWithRepeatEveryWeekday', request, response);

            const domainModel = await this._validator.createReminderWithRepeatEveryWeekday(request);
            const reminder = await this._service.create(domainModel);
            if (reminder == null) {
                throw new ApiError(400, 'Cannot create reminder!');
            }

            ResponseHandler.success(request, response, 'Reminder created successfully!', 201, {
                Reminder : reminder,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    createReminderWithRepeatEveryWeekOnDays = async (
        request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Reminder.CreateReminderWithRepeatEveryWeekOnDays', request, response);

            const domainModel = await this._validator.createReminderWithRepeatEveryWeekOnDays(request);
            const reminder = await this._service.create(domainModel);
            if (reminder == null) {
                throw new ApiError(400, 'Cannot create reminder!');
            }

            ResponseHandler.success(request, response, 'Reminder created successfully!', 201, {
                Reminder : reminder,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    createReminderWithEveryMonthOn = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Reminder.CreateReminderWithEveryMonthOn', request, response);

            const domainModel = await this._validator.createReminderWithEveryMonthOn(request);
            const reminder = await this._service.create(domainModel);
            if (reminder == null) {
                throw new ApiError(400, 'Cannot create reminder!');
            }

            ResponseHandler.success(request, response, 'Reminder created successfully!', 201, {
                Reminder : reminder,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    createReminderWithEveryQuarterOn = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Reminder.CreateReminderWithEveryQuarterOn', request, response);

            const domainModel = await this._validator.createReminderWithEveryQuarterOn(request);
            const reminder = await this._service.create(domainModel);
            if (reminder == null) {
                throw new ApiError(400, 'Cannot create reminder!');
            }

            ResponseHandler.success(request, response, 'Reminder created successfully!', 201, {
                Reminder : reminder,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    createReminderWithRepeatEveryHour = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Reminder.CreateReminderWithRepeatEveryHour', request, response);

            const domainModel = await this._validator.createReminderWithRepeatEveryHour(request);
            const reminder = await this._service.create(domainModel);
            if (reminder == null) {
                throw new ApiError(400, 'Cannot create reminder!');
            }

            ResponseHandler.success(request, response, 'Reminder created successfully!', 201, {
                Reminder : reminder,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    createReminderWithRepeatEveryDay = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Reminder.CreateReminderWithRepeatEveryDay', request, response);

            const domainModel = await this._validator.createReminderWithRepeatEveryDay(request);
            const reminder = await this._service.create(domainModel);
            if (reminder == null) {
                throw new ApiError(400, 'Cannot create reminder!');
            }

            ResponseHandler.success(request, response, 'Reminder created successfully!', 201, {
                Reminder : reminder,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Reminder.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const reminder = await this._service.getById(id);
            if (reminder == null) {
                throw new ApiError(404, 'Reminder not found.');
            }

            ResponseHandler.success(request, response, 'Reminder retrieved successfully!', 200, {
                Reminder : reminder,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    GetRemindersForUser = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Reminder.GetRemindersForUser', request, response);
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const reminders = await this._service.getRemindersForUser(userId);
            if (reminders == null || reminders.length === 0) {
                throw new ApiError(404, 'Reminders not found.');
            }
            ResponseHandler.success(request, response, 'Reminders retrieved successfully!', 200, {
                Reminders : reminders,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Reminder.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} reminder records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { Reminders: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Reminder.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingReminder = await this._service.getById(id);
            if (existingReminder == null) {
                throw new ApiError(404, 'Reminder not found.');
            }
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Reminder cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Reminder record deleted successfully!', 200, {
                Deleted : true,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteRemindersForUser = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Reminder.DeleteRemindersForUser', request, response);

            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const reminders = await this._service.getRemindersForUser(userId);
            if (reminders == null || reminders.length === 0) {
                throw new ApiError(404, 'Reminders not found.');
            }
            const deleted = await this._service.deleteRemindersForUser(userId);
            if (!deleted) {
                throw new ApiError(400, 'Reminders cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Reminders record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
