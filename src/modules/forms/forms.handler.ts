import { IFormsService } from "./interfaces/forms.service.interface";
import Dictionary from "../../common/dictionary";
import { ProviderResolver } from "./provider.resolver";
import { ThirdpartyApiCredentialsDomainModel, ThirdpartyApiCredentialsDto } from "../../domain.types/thirdparty/thirdparty.api.credentials";
import { FormDto } from "../../domain.types/clinical/assessment/form.types";

////////////////////////////////////////////////////////////////////////

export class FormsHandler {

    static _services: Dictionary<IFormsService> = new Dictionary<IFormsService>();

    public static connect = async (connectionModel: ThirdpartyApiCredentialsDomainModel): Promise<boolean> => {
        const provider = connectionModel.Provider;
        FormsHandler._services = ProviderResolver.resolve();
        var service = FormsHandler._services.getItem(provider);
        return await service.connect(connectionModel);
    };

    public static getFormsList = async (connectionModel: ThirdpartyApiCredentialsDto): Promise<FormDto[]> => {
        const provider = connectionModel.Provider;
        FormsHandler._services = ProviderResolver.resolve();
        var service = FormsHandler._services.getItem(provider);
        return await service.getFormsList(connectionModel);
    }

    // public convertFormToAssessmentTemplate = async (assessmentActivity: CareplanActivity)
    //     : Promise<SAssessmentTemplate> => {
    //     var service = FormsHandler._services.getItem(assessmentActivity.Provider);
    //     return await service.convertToAssessmentTemplate(assessmentActivity);
    // };

    // public convertFormResponseToAssessmentResponse = async (assessmentActivity: CareplanActivity)
    // : Promise<SAssessmentTemplate> => {
    //     var service = FormsHandler._services.getItem(assessmentActivity.Provider);
    //     return await service.convertToAssessmentTemplate(assessmentActivity);
    // };

}
