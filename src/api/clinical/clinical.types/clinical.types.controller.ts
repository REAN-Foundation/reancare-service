import express from 'express';
import { ResponseHandler } from '../../../common/response.handler';
import { ClinicalInterpretationList, ClinicalValidationStatusList } from '../../../domain.types/miscellaneous/clinical.types';
import { SeverityList } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ClinicalTypesController {

    //#region Action methods

    getSeverities = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            ResponseHandler.success(request, response, 'Severities retrieved successfully!', 200, {
                Severities : SeverityList,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getClinicalValidationStatuses = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            ResponseHandler.success(request, response, 'Clinical validation status list retrieved successfully!', 200, {
                ClinicalValidationStatusList : ClinicalValidationStatusList,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getInterpretations = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            ResponseHandler.success(request, response, 'Clinical interpreation list retrieved successfully!', 200, {
                ClinicalInterpretations : ClinicalInterpretationList,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
