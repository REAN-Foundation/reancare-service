import express from 'express';
import { Authorizer } from '../../../../auth/authorizer';
import { ResponseHandler } from '../../../../common/response.handler';
// import { DocumentTypesList } from '../../../../domain.types/users/patient/document/document.types';
import { FileResourceService } from '../../../../services/general/file.resource.service';
import { StatisticsService } from '../../../../services/users/patient/statistics.service';
import { Loader } from '../../../../startup/loader';
import { StatisticsValidator } from './statistics.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class StatisticsController {

    //#region member variables and constructors

    _service: StatisticsService = null;

    _fileResourceService: FileResourceService = null;

    _authorizer: Authorizer = null;

    _validator: StatisticsValidator = new StatisticsValidator();

    _personService: any;

    constructor() {
        this._service = Loader.container.resolve(StatisticsService);
        this._fileResourceService = Loader.container.resolve(FileResourceService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    getPatientStats = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientStatistics.GetPatientStats';
            //await this._authorizer.authorize(request, response);
            const patientUserId: string = await this._validator.getParamUuid(request, 'patientUserId');
            const stats = await this._service.getPatientStats(patientUserId);
            ResponseHandler.success(request, response, 'Document retrieved successfully!', 200, {
                Statistics : stats,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPatientStatsReport = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientStatistics.GetPatientStatsReport';

            await this._authorizer.authorize(request, response);

            const patientUserId: string = await this._validator.getParamUuid(request, 'patientUserId');
            const stats = await this._service.getPatientStats(patientUserId);
            const reportUrl = await this._service.generateReport(stats);
            ResponseHandler.success(request, response, 'Document retrieved successfully!', 200, {
                ReportUrl : reportUrl,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
