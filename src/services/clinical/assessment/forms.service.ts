import { inject, injectable } from "tsyringe";
import { IAssessmentHelperRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface";
import { IAssessmentRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface";
import { IAssessmentTemplateRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface";
import { AssessmentTemplateDto } from "../../../domain.types/clinical/assessment/assessment.template.dto";
import { FormDto } from "../../../domain.types/clinical/assessment/form.types";
import { ThirdpartyApiCredentialsDomainModel, ThirdpartyApiCredentialsDto } from "../../../domain.types/thirdparty/thirdparty.api.credentials";
import { FormsHandler } from "../../../modules/forms/forms.handler";

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
            : Promise<AssessmentTemplateDto> => {
        var downloadedFilepath = await FormsHandler.downloadForm(connectionModel, providerFormId);
        var assessmentTemplate = await FormsHandler.importFormFileAsAssessmentTemplate(
            connectionModel, downloadedFilepath);
        return assessmentTemplate;
    };

    public formExists = async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string)
        : Promise<boolean> => {
        return await FormsHandler.formExists(connectionModel, providerFormId);
    };

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
