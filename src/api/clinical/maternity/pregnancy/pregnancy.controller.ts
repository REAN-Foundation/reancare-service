import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { PregnancyService } from '../../../../services/clinical/maternity/pregnancy.service';
import { Injector } from '../../../../startup/injector';
import { PregnancyValidator } from './pregnancy.validator';
import { BaseController } from '../../../base.controller';
import { AntenatalVisitService } from '../../../../services/clinical/maternity/antenatal.visit.service';
import { AntenatalMedicationService } from '../../../../services/clinical/maternity/antenatal.medication.service'
import { TestService } from '../../../../services/clinical/maternity/test.service';

///////////////////////////////////////////////////////////////////////////////////////

export class PregnancyController extends BaseController {

    //#region member variables and constructors

    _service: PregnancyService = Injector.Container.resolve(PregnancyService);

    _validator: PregnancyValidator = new PregnancyValidator();
    
    _antenatalService: AntenatalVisitService = Injector.Container.resolve(AntenatalVisitService);

    _antenatalMedicationService: AntenatalMedicationService = Injector.Container.resolve(AntenatalMedicationService);

    _testService: TestService = Injector.Container.resolve(TestService);

    constructor() {
        super();
    }

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

    //#region Antenatal Visit Action methods

    createAntenatalVisit = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.createAntenatalVisit(request);
            const visit = await this._antenatalService.create(model);
            if (visit == null) {
                throw new ApiError(400, 'Cannot create record for antenatal visit!');
            }

            ResponseHandler.success(request, response, 'Antenatal visit record created successfully!', 201, {
                AntenatalVisit: visit,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        } 
    }

    getAntenatalVisitById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const antenatalVisitId: uuid = await this._validator.getParamUuid(request, 'antenatalVisitId');
            const visit = await this._antenatalService.getById(antenatalVisitId);
            if (visit == null) {
                throw new ApiError(404, 'Antenatal visit record not found.');
            }

            ResponseHandler.success(request, response, 'Antenatal visit record retrieved successfully!', 200, {
                AntenatalVisit: visit,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateAntenatalVisit = async (request: express.Request, response: express.Response) => {
        try {
            const antenatalVisitId: uuid = await this._validator.getParamUuid(request, 'antenatalVisitId');
            const updates = await this._validator.updateAntenatalVisit(request);
    
            const existingVisit = await this._antenatalService.getById(antenatalVisitId);
            if (!existingVisit) {
                throw new ApiError(404, 'Cannot retrieve record for antenatal visit!');
            }
    
            const updatedVisit = await this._antenatalService.update(antenatalVisitId, updates);
            if (!updatedVisit) {
                throw new ApiError(500, 'Unable to update antenatal visit!');
            }
    
            ResponseHandler.success(request, response, 'Antenatal visit updated successfully!', 200, {
                AntenatalVisit: updatedVisit,
            });
    
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    deleteAntenatalVisit = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const antenatalVisitId: uuid = await this._validator.getParamUuid(request, 'antenatalVisitId');
            await this._antenatalService.delete(antenatalVisitId);
            ResponseHandler.success(request, response, 'Antenatal visit deleted successfully!', 200, { Deleted: true });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Antenatal Medication Action methods

    createAntenatalMedication = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.createAntenatalMedication(request);
            const medication = await this._antenatalMedicationService.create(model);
            if (medication == null) {
                throw new ApiError(400, 'Cannot create record for antenatal medication!');
            }

            ResponseHandler.success(request, response, 'Antenatal medication record created successfully!', 201, {
                AntenatalMedication: medication,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getAntenatalMedicationById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const antenatalMedicationId: uuid = await this._validator.getParamUuid(request, 'antenatalMedicationId');
            const medication = await this._antenatalMedicationService.getById(antenatalMedicationId);
            if (medication == null) {
                throw new ApiError(404, 'Antenatal medication record not found.');
            }

            ResponseHandler.success(request, response, 'Antenatal medication record retrieved successfully!', 200, {
                AntenatalMedication: medication,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateAntenatalMedication = async (request: express.Request, response: express.Response) => {
        try {
            const antenatalMedicationId: uuid = await this._validator.getParamUuid(request, 'antenatalMedicationId');
            const updates = await this._validator.updateAntenatalMedication(request);
    
            const existingMedication = await this._antenatalMedicationService.getById(antenatalMedicationId);
            if (!existingMedication) {
                throw new ApiError(404, 'Cannot retrieve record for antenatal medication!');
            }
    
            const updatedMedication = await this._antenatalMedicationService.update(antenatalMedicationId, updates);
            if (!updatedMedication) {
                throw new ApiError(500, 'Unable to update antenatal medication!');
            }
    
            ResponseHandler.success(request, response, 'Antenatal medication updated successfully!', 200, {
                AntenatalMedication: updatedMedication,
            });
    
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteAntenatalMedication = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const antenatalMedicationId: uuid = await this._validator.getParamUuid(request, 'antenatalMedicationId');
            await this._antenatalMedicationService.delete(antenatalMedicationId);
            ResponseHandler.success(request, response, 'Antenatal medication deleted successfully!', 200, { Deleted: true });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Test Action Methods

    createTest = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const testModel = await this._validator.createTest(request);
            const test = await this._testService.create(testModel);
            if (test == null) {
                throw new ApiError(400, "Cannot create record for test!");
            }

            ResponseHandler.success(request, response, "Test record created successfully!", 201, {
                Test: test,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getTestById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const testId: string = await this._validator.getParamUuid(request, "testId");
            const test = await this._testService.getById(testId);
            if (test == null) {
                throw new ApiError(404, "Test record not found.");
            }

            ResponseHandler.success(request, response, "Test record retrieved successfully!", 200, {
                Test: test,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateTest = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const testId: string = await this._validator.getParamUuid(request, "testId");
            const updates = await this._validator.updateTest(request);

            const existingTest = await this._testService.getById(testId);
            if (!existingTest) {
                throw new ApiError(404, "Cannot retrieve record for test!");
            }

            const updatedTest = await this._testService.update(testId, updates);
            if (!updatedTest) {
                throw new ApiError(500, "Unable to update test record!");
            }

            ResponseHandler.success(request, response, "Test record updated successfully!", 200, {
                Test: updatedTest,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteTest = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const testId: string = await this._validator.getParamUuid(request, "testId");
            await this._testService.delete(testId);
            ResponseHandler.success(request, response, "Test record deleted successfully!", 200, { Deleted: true });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}