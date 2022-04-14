import fs from 'fs';
import _ from "lodash";
import path from 'path';
import { ApiError } from "../../../../common/api.error";
import { Helper } from '../../../../common/helper';
import { Logger } from "../../../../common/logger";
import { TimeHelper } from "../../../../common/time.helper";
import { CAssessmentTemplate, QueryResponseType } from "../../../../domain.types/clinical/assessment/assessment.types";
import { FormDto } from "../../../../domain.types/clinical/assessment/form.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import {
    ThirdpartyApiCredentialsDomainModel,
    ThirdpartyApiCredentialsDto
} from "../../../../domain.types/thirdparty/thirdparty.api.credentials";
import { IFormsService } from "../../interfaces/forms.service.interface";
import { KoboFileConverter } from "./kobo.file.converter";
import needle = require('needle');
import { URL } from 'url';

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
        var writer = fs.createWriteStream(filepath);

        // const buffer = await needle.get(url, options);
        // fs.writeFileSync(filepath, buffer);
        // return filepath;
        
        var ws = fs.createWriteStream(filepath);
        const buffer = await needle.get(url, options);
        return new Promise((resolve, reject) => {
            buffer.pipe(writer);
            writer.on('error', reject);
            writer.on('finish', (err) => {
                if (err) {
                    reject(`Error dowmloading form! : ${err.message}`);
                }
                ws.end();
                resolve(filepath);
            });
        });

    };

    public downloadFile = async (connectionModel: ThirdpartyApiCredentialsDto, fileUrl: string)
        : Promise<string> => {

        var u = new URL(fileUrl);
        var urlFilePath = u.searchParams.get('media_file');
        var filename = path.basename(urlFilePath);

        var options = this.getRequestOptions(connectionModel.Token);
        var folder = await Helper.createTempDownloadFolder();
        const downloadFolderPath = path.join(folder, TimeHelper.timestamp(new Date()));
        await fs.promises.mkdir(downloadFolderPath, { recursive: true });
        var filepath = path.join(downloadFolderPath, filename);
        var writer = fs.createWriteStream(filepath);
       
        var ws = fs.createWriteStream(filepath);
        const buffer = await needle.get(fileUrl, options);
        return new Promise((resolve, reject) => {
            buffer.pipe(writer);
            writer.on('error', reject);
            writer.on('finish', (err) => {
                if (err) {
                    reject(`Error dowmloading file! : ${err.message}`);
                }
                ws.end();
                resolve(filepath);
            });
        });

    };

    public importFormFileAsAssessmentTemplate = async (userId: uuid, providerFormId: string, downloadedFilepath: string)
            : Promise<CAssessmentTemplate> => {
        const converter = new KoboFileConverter();
        return await converter.readKoboXlsAsTemplate(userId, providerFormId, downloadedFilepath);
    };

    public importFormSubmissions = async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string)
        : Promise<any[]> => {

        var options = this.getRequestOptions(connectionModel.Token);
        var url = connectionModel.BaseUrl + `v1/data/${providerFormId}?format=json`;
        var response = await needle('get', url, options);
        if (response.statusCode === 200) {
            Logger.instance().log('Successfully retrieved form submission list!');
            var submissions = response.body;
            return submissions;
        }
        else {
            Logger.instance().error('Unable to retrieve KoboToolbox form submissions for the account!', response.statusCode, null);
            throw new ApiError(response.statusCode, 'Unable to retrieve KoboToolbox forms for the account!');
        }
    };

    processQueryResponse(responseType: QueryResponseType, value: any) {
        if (responseType === QueryResponseType.MultiChoiceSelection) {
            var tokens = (value as string).split(' ');
            tokens = tokens.map(x => x.trim());
            return tokens;
        }
        return value;
    }
    
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

        return {
            headers    : headers,
            compressed : true,
        };
    }

}
