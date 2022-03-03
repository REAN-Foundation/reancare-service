import { ApiError } from "../../../../common/api.error";
import { Logger } from "../../../../common/logger";
import { AssessmentTemplateDto } from "../../../../domain.types/clinical/assessment/assessment.template.dto";
import { FormDto } from "../../../../domain.types/clinical/assessment/form.types";
import { ThirdpartyApiCredentialsDomainModel, ThirdpartyApiCredentialsDto } from "../../../../domain.types/thirdparty/thirdparty.api.credentials";
import { IFormsService } from "../../interfaces/forms.service.interface";
import needle = require('needle');

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class KoboToolboxService  implements IFormsService {

    //#region Publics

    providerName = (): string => {
        return "KoboToolbox";
    };

    public connect = async (connectionModel: ThirdpartyApiCredentialsDomainModel) => {

        var headers = {
            'Content-Type'    : 'application/json',
            Accept            : '*/*',
            'Cache-Control'   : 'no-cache',
            'Accept-Encoding' : 'gzip, deflate, br',
            Connection        : 'keep-alive',
            Authorization     : `Token ${connectionModel.Token}`
        };

        var options = {
            headers    : headers,
            compressed : true,
        };

        var url = connectionModel.SecondaryUrl + 'v2/assets.json';

        var response = await needle('get', url, options);
        if (response.statusCode === 200) {
            const assetCount = response.body.count;
            Logger.instance().log(`Available Kobo assets for this account: ${assetCount}`);
            Logger.instance().log('Successfully connected to KoboToolbox API service!');
            return true;
        } else {
            Logger.instance().error('Unable to connect KoboToolbox API service!', response.statusCode, null);
            return false;
        }

    };

    public getFormsList = async (connectionModel: ThirdpartyApiCredentialsDto): Promise<FormDto[]> => {
        var headers = {
            'Content-Type'    : 'application/json',
            Accept            : '*/*',
            'Cache-Control'   : 'no-cache',
            'Accept-Encoding' : 'gzip, deflate, br',
            Connection        : 'keep-alive',
            Authorization     : `Token ${connectionModel.Token}`
        };

        var options = {
            headers    : headers,
            compressed : true,
        };

        var url = connectionModel.BaseUrl + 'v1/forms';

        var response = await needle('get', url, options);
        if (response.statusCode === 200) {
            const assetCount = response.body.count;
            Logger.instance().log(`Available Kobo assets for this account: ${assetCount}`);
            Logger.instance().log('Successfully connected to KoboToolbox API service!');
            var formList = response.body;
            var forms: FormDto[] = formList.map(x => this.toFormDto(x));
            return forms;
        } else {
            Logger.instance().error('Unable to retrieve KoboToolbox forms for the account!', response.statusCode, null);
            throw new ApiError(response.statusCode, 'Unable to retrieve KoboToolbox forms for the account!');
        }
    };

    public formExists = async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string): Promise<boolean> => {
        throw new Error("Method not implemented.");
    };

    public downloadForm = async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string): Promise<string> => {
        throw new Error("Method not implemented.");
    };

    public importFormFileAsAssessmentTemplate =
        async (connectionModel: ThirdpartyApiCredentialsDto, downloadedFilepath: string): Promise<AssessmentTemplateDto> => {
        throw new Error("Method not implemented.");
    };

    //#endregion

    private toFormDto = (metadata: any) => {
        if (!metadata) {
            return null;
        }
        var form: FormDto = {
            Provider        : 'KoboToolbox',
            ProviderId      : String(metadata.formid),
            ProviderCode    : metadata.id_string,
            Title           : metadata.title,
            Description     : metadata.description,
            CreatedAt       : new Date(metadata.date_created),
            UpdatedAt       : new Date(metadata.date_modified),
            ProviderVersion : null,
            Tags            : metadata.tags,
            Url             : metadata.url
        };
        return form;
    };

}
