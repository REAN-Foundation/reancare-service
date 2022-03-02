import { IFormsService } from "./interfaces/forms.service.interface";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import Dictionary from "../../common/dictionary";
import { ProviderResolver } from "./provider.resolver";
import { ThirdpartyApiCredentialsDomainModel } from "../../domain.types/thirdparty/thirdparty.api.credentials";

////////////////////////////////////////////////////////////////////////

export class FormsHandler {

    static _services: Dictionary<IFormsService> = new Dictionary<IFormsService>();

    public static connect = async (connectionModel: ThirdpartyApiCredentialsDomainModel): Promise<boolean> => {

        const provider = connectionModel.Provider;

        FormsHandler._services = ProviderResolver.resolve();

        var service = FormsHandler._services.getItem(provider);
        return await service.connect(connectionModel);

    };

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
