import { KoboCredentials } from "./kobo.credentials";
import { IFormsService } from "../../interfaces/forms.service.interface";
import { ApiError } from "../../../../common/api.error";
import needle = require('needle');

import { ProgressStatus, uuid } from "../../../../domain.types/miscellaneous/system.types";
import { TimeHelper } from "../../../../common/time.helper";
import { DurationType } from "../../../../domain.types/miscellaneous/time.types";
import { Logger } from "../../../../common/logger";
import { IUserActionService } from "../user/user.action.service.interface";
import { AssessmentTemplateDto } from "../../../../domain.types/clinical/assessment/assessment.template.dto";
import { SAssessmentTemplate } from "../../../../domain.types/clinical/assessment/assessment.types";
import { CareplanActivity } from "../../../../domain.types/clinical/careplan/activity/careplan.activity";
import { CareplanConfig } from "../../../../config/configuration.types";
import { AssessmentDomainModel } from "../../../../domain.types/clinical/assessment/assessment.domain.model";
import { CareplanActivityDto } from "../../../../domain.types/clinical/careplan/activity/careplan.activity.dto";
import { AssessmentDto } from "../../../../domain.types/clinical/assessment/assessment.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class KoboToolboxService  implements IFormsService {

    //#region Publics

    connect = async (creds: KoboCredentials) => {

        var headers = {
            'Content-Type'    : 'application/x-www-form-urlencoded',
            Accept            : '*/*',
            'Cache-Control'   : 'no-cache',
            'Accept-Encoding' : 'gzip, deflate, br',
            Connection        : 'keep-alive',
        };

        var options = {
            headers    : headers,
            compressed : true,
            json       : false,
        };

        var url = process.env.AHA_API_BASE_URL + '/token';

        var body = {
            client_id     : process.env.AHA_CONTINUITY_CLIENT_ID,
            client_secret : process.env.AHA_CONTINUITY_CLIENT_SECRET,
            grant_type    : 'client_credentials',
        };

        var response = await needle('post', url, body, options);
        if (response.statusCode === 200) {
            AhaCache.SetWebToken(response.body.access_token, response.body.expires_in);
            Logger.instance().log('Successfully connected to AHA API service!');
            return true;
        } else {
            Logger.instance().error('Unable to connect AHA API service!', response.statusCode, null);
            return false;
        }

    }

    create = async (doctorDomainModel: DoctorDomainModel): Promise<DoctorDetailsDto> => {
        
        const ehrId = await this._ehrDoctorStore.create(doctorDomainModel);
        doctorDomainModel.EhrId = ehrId;

        var dto = await this._doctorRepo.create(doctorDomainModel);
        dto = await this.updateDetailsDto(dto);
        const role = await this._roleRepo.getByName(Roles.Doctor);
        await this._personRoleRepo.addPersonRole(dto.User.Person.id, role.id);

        return dto;
    };

    public getByUserId = async (id: string): Promise<DoctorDetailsDto> => {
        var dto = await this._doctorRepo.getByUserId(id);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public search = async (
        filters: DoctorSearchFilters
    ): Promise<DoctorDetailsSearchResults | DoctorSearchResults> => {
        var items = [];
        var results = await this._doctorRepo.search(filters);
        for await (var dto of results.Items) {
            dto = await this.updateDto(dto);
            items.push(dto);
        }
        results.Items = items;
        return results;
    };


    //#endregion

}
