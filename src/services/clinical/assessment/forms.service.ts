import { CAssessmentTemplate } from "../../../domain.types/clinical/assessment/assessment.types";
import { inject, injectable } from "tsyringe";
import { IAssessmentHelperRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface";
import { IAssessmentRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface";
import { IAssessmentTemplateRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface";
import { FormDto } from "../../../domain.types/clinical/assessment/form.types";
import { ThirdpartyApiCredentialsDomainModel, ThirdpartyApiCredentialsDto } from "../../../domain.types/thirdparty/thirdparty.api.credentials";
import { FormsHandler } from "../../../modules/forms/forms.handler";
import { AssessmentTemplateDto } from "../../../domain.types/clinical/assessment/assessment.template.dto";
import { AssessmentDto } from "../../../domain.types/clinical/assessment/assessment.dto";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { PatientDetailsDto } from "../../../domain.types/patient/patient/patient.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class FormsService {

    _handler: FormsHandler = new FormsHandler();

    constructor(
        @inject('IAssessmentTemplateRepo') private _assessmentTemplateRepo: IAssessmentTemplateRepo,
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,
        @inject('IAssessmentHelperRepo') private _assessmentHelperRepo: IAssessmentHelperRepo,
        //@inject('IFormsRepo') private _formsRepo: IFormsRepo,
    ) {}

    public connectFormsProviderApi = async (connectionModel: ThirdpartyApiCredentialsDomainModel): Promise<boolean> => {
        return await FormsHandler.connect(connectionModel);
    };

    public getFormsList = async (connectionModel: ThirdpartyApiCredentialsDto): Promise<FormDto[]> => {
        return await FormsHandler.getFormsList(connectionModel);
    };
    
    public importFormAsAssessmentTemplate = async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string)
            : Promise<CAssessmentTemplate> => {
        var downloadedFilepath = await FormsHandler.downloadForm(connectionModel, providerFormId);
        var assessmentTemplate = await FormsHandler.importFormFileAsAssessmentTemplate(
            connectionModel, providerFormId, downloadedFilepath);
        return assessmentTemplate;
    };

    public formExists = async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string)
        : Promise<boolean> => {
        return await FormsHandler.formExists(connectionModel, providerFormId);
    };

    public importFormSubmissions = async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string)
        : Promise<any[]> => {
        return await FormsHandler.importFormSubmissions(connectionModel, providerFormId);
    }

    public getTemplateForForm = async (provider: string, providerFormId: string)
        : Promise<AssessmentTemplateDto> => {
        return await this._assessmentTemplateRepo.getByProviderAssessmentCode(provider, providerFormId);
    }

    public IdentifyUserDetailsFromSubmission = async (submission: any): Promise<PatientDetailsDto> => {
        throw new Error('Method not implemented.');
    }

    public addAssessment = async (patientUserId: uuid, templateId: uuid, providerFormId: string, submission: any)
        : Promise<AssessmentDto> => {
        throw new Error('Method not implemented.');
    }

    // public getById = async (id: string): Promise<AssessmentTemplateDto> => {
    //     return await this._assessmentRepo.getById(id);
    // };

    // public search = async (filters: AssessmentTemplateSearchFilters): Promise<AssessmentTemplateSearchResults> => {
    //     return await this._assessmentRepo.search(filters);
    // };

    // public update = async (id: string, assessmentDomainModel: AssessmentTemplateDomainModel):
    //     Promise<AssessmentTemplateDto> => {
    //     return await this._assessmentRepo.update(id, assessmentDomainModel);
    // };

    // public delete = async (id: string): Promise<boolean> => {
    //     return await this._assessmentRepo.delete(id);
    // };

}
