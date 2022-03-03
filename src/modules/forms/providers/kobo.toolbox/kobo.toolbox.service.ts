import _ from "lodash";
import { ApiError } from "../../../../common/api.error";
import { Helper } from '../../../../common/helper';
import { Logger } from "../../../../common/logger";
import { TimeHelper } from "../../../../common/time.helper";
import { AssessmentTemplateDto } from "../../../../domain.types/clinical/assessment/assessment.template.dto";
import { FormDto } from "../../../../domain.types/clinical/assessment/form.types";
import {
    ThirdpartyApiCredentialsDomainModel,
    ThirdpartyApiCredentialsDto
} from "../../../../domain.types/thirdparty/thirdparty.api.credentials";
import { IFormsService } from "../../interfaces/forms.service.interface";
import needle = require('needle');
import fs from 'fs';
import path from 'path';
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { KoboFileConverter } from "./kobo.file.converter";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class KoboToolboxService  implements IFormsService {

    //#region Publics

    providerName = (): string => {
        return "KoboToolbox";
    };

    public connect = async (connectionModel: ThirdpartyApiCredentialsDomainModel) => {

        var options = this.getRequestOptions(connectionModel.Token);
        var url = connectionModel.SecondaryUrl + 'v2/assets.json';
        var response = await needle('get', url, options);
        if (response.statusCode === 200) {
            const assetCount = response.body.count;
            Logger.instance().log(`Available Kobo assets for this account: ${assetCount}`);
            Logger.instance().log('Successfully connected to KoboToolbox API service!');
            return true;
        }
        else {
            Logger.instance().error('Unable to connect KoboToolbox API service!', response.statusCode, null);
            return false;
        }
    };

    public getFormsList = async (connectionModel: ThirdpartyApiCredentialsDto): Promise<FormDto[]> => {

        var options = this.getRequestOptions(connectionModel.Token);
        var url = connectionModel.BaseUrl + 'v1/forms';
        var response = await needle('get', url, options);
        if (response.statusCode === 200) {
            Logger.instance().log('Successfully retrieved forms list!');
            var formList = response.body;
            var forms: FormDto[] = formList.map(x => this.toFormDto(x));
            return forms;
        }
        else {
            Logger.instance().error('Unable to retrieve KoboToolbox forms for the account!', response.statusCode, null);
            throw new ApiError(response.statusCode, 'Unable to retrieve KoboToolbox forms for the account!');
        }
    };

    public formExists = async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string)
        : Promise<boolean> => {
        var options = this.getRequestOptions(connectionModel.Token);
        var url = connectionModel.BaseUrl + `v1/forms/${providerFormId}`;
        var response = await needle('get', url, options);
        if (response.statusCode === 200) {
            return !_.isEmpty(response.body);
        } else {
            return false;
        }
    };

    public getForm = async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string)
    : Promise<FormDto> => {
        var options = this.getRequestOptions(connectionModel.Token);
        var url = connectionModel.BaseUrl + `v1/forms/${providerFormId}`;
        var response = await needle('get', url, options);
        if (response.statusCode === 200) {
            return this.toFormDto(response.body);
        } else {
            return null;
        }
    };

    public downloadForm = async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string)
        : Promise<string> => {

        var form = await this.getForm(connectionModel, providerFormId);
        if (!form) {
            throw new ApiError(404, 'Form does not exist!');
        }
        
        var providerFormCode = form.ProviderCode;
        var options = this.getRequestOptions(connectionModel.Token);
        var url = connectionModel.SecondaryUrl + `v2/assets/${providerFormCode}.xls`;
        var folder = await Helper.createTempDownloadFolder();
        const downloadFolderPath = path.join(folder, TimeHelper.timestamp(new Date()));
        await fs.promises.mkdir(downloadFolderPath, { recursive: true });
        var filename = `${providerFormCode}.xls`;
        var filepath = path.join(downloadFolderPath, filename);

        return new Promise((resolve, reject) => {
            needle.get(url, options)
                .pipe(fs.createWriteStream(filepath))
                .on('done', (err) => {
                    if (err) {
                        reject(`Error dowmloading form! : ${err.message}`);
                    }
                    resolve(filepath);
                });
        });

    };

    public importFormFileAsAssessmentTemplate = async (userId: uuid, downloadedFilepath: string)
            : Promise<AssessmentTemplateDto> => {
        return await KoboFileConverter.readKoboXlsAsTemplate(userId, downloadedFilepath);
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

    private getRequestOptions(token: string) {

        var headers = {
            'Content-Type'    : 'application/json',
            Accept            : '*/*',
            'Cache-Control'   : 'no-cache',
            'Accept-Encoding' : 'gzip, deflate, br',
            Connection        : 'keep-alive',
            Authorization     : `Token ${token}`
        };

        var options = {
            headers    : headers,
            compressed : true,
        };
        return options;
    }

}
