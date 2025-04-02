import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { PregnancyService } from '../../../../services/clinical/maternity/pregnancy.service';
import { VaccinationService } from '../../../../services/clinical/maternity/vaccination.service';
import { Injector } from '../../../../startup/injector';
import { PregnancyValidator } from './pregnancy.validator';
import { BaseController } from '../../../base.controller';
import { UserService } from '../../../../services/users/user/user.service';

///////////////////////////////////////////////////////////////////////////////////////

export class PregnancyController extends BaseController {

    //#region member variables and constructors

    _service: PregnancyService = Injector.Container.resolve(PregnancyService);

    _vaccinationService: VaccinationService = Injector.Container.resolve(VaccinationService);

    _validator: PregnancyValidator = new PregnancyValidator();

    _userService: UserService = Injector.Container.resolve(UserService);

    constructor() {
        super();
    }

    //#endregion

    //#region Pregnancy methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.create(request);
            const pregnancy = await this._service.create(model);
            if (pregnancy == null) {
                throw new ApiError(400, 'Cannot create record for pregnancy!');
            }

            ResponseHandler.success(request, response, 'Pregnancy record created successfully!', 201, {
                Pregnancy: pregnancy,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const pregnancy = await this._service.getById(id);
            if (pregnancy == null) {
                throw new ApiError(404, 'Pregnancy record not found.');
            }

            ResponseHandler.success(request, response, 'Pregnancy record retrieved successfully!', 200, {
                Pregnancy: pregnancy,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} pregnancy records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Pregnancies: searchResults
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Pregnancy record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update pregnancy record!');
            }

            ResponseHandler.success(request, response, 'Pregnancy record updated successfully!', 200, {
                Pregnancy: updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Pregnancy record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Pregnancy record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Pregnancy record deleted successfully!', 200, {
                Deleted: true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Vaccination methods

createVaccination = async (request: express.Request, response: express.Response): Promise<void> => {
    try {
        const model = await this._validator.createVaccination(request);
        const vaccination = await this._vaccinationService.create(model);
        if (vaccination == null) {
            throw new ApiError(400, 'Cannot create vaccination record!');
        }

        ResponseHandler.success(request, response, 'Vaccination record created successfully!', 201, {
            Vaccination: vaccination,
        });
    } catch (error) {
        ResponseHandler.handleError(request, response, error);
    }
};

getVaccinationById = async (request: express.Request, response: express.Response): Promise<void> => {
    try {
        const vaccinationId: uuid = await this._validator.getParamUuid(request, 'vaccinationId');
        const vaccination = await this._vaccinationService.getById(vaccinationId);
        if (vaccination == null) {
            throw new ApiError(404, 'Vaccination record not found.');
        }

        ResponseHandler.success(request, response, 'Vaccination record retrieved successfully!', 200, {
            Vaccination: vaccination,
        });
    } catch (error) {
        ResponseHandler.handleError(request, response, error);
    }
};

searchVaccination = async (request: express.Request, response: express.Response): Promise<void> => {
    try {
        const filters = await this._validator.searchVaccination(request);
        const searchResults = await this._vaccinationService.search(filters);
        const count = searchResults.Items.length;
        const message =
            count === 0
                ? 'No vaccination records found!'
                : `Total ${count} vaccination records retrieved successfully!`;

        ResponseHandler.success(request, response, message, 200, {
            Vaccinations: searchResults
        });
    } catch (error) {
        ResponseHandler.handleError(request, response, error);
    }
};

updateVaccination = async (request: express.Request, response: express.Response): Promise<void> => {
    try {
        const domainModel = await this._validator.updateVaccination(request);
        const vaccinationId: uuid = await this._validator.getParamUuid(request, 'vaccinationId');
        const existingRecord = await this._vaccinationService.getById(vaccinationId);
        if (existingRecord == null) {
            throw new ApiError(404, 'Vaccination record not found.');
        }

        const updated = await this._vaccinationService.update(domainModel.id, domainModel);
        if (updated == null) {
            throw new ApiError(400, 'Unable to update vaccination record!');
        }

        ResponseHandler.success(request, response, 'Vaccination record updated successfully!', 200, {
            Vaccination: updated,
        });
    } catch (error) {
        ResponseHandler.handleError(request, response, error);
    }
};

deleteVaccination = async (request: express.Request, response: express.Response): Promise<void> => {
    try {
        const vaccinationId: uuid = await this._validator.getParamUuid(request, 'vaccinationId');
        const existingRecord = await this._vaccinationService.getById(vaccinationId);
        if (existingRecord == null) {
            throw new ApiError(404, 'Vaccination record not found.');
        }

        const deleted = await this._vaccinationService.delete(vaccinationId);
        if (!deleted) {
            throw new ApiError(400, 'Vaccination record cannot be deleted.');
        }

        ResponseHandler.success(request, response, 'Vaccination record deleted successfully!', 200, {
            Deleted: true,
        });
    } catch (error) {
        ResponseHandler.handleError(request, response, error);
    }
};

//#endregion
}
