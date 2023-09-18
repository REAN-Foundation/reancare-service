/* eslint-disable newline-per-chained-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '../../common/logger';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import * as asyncLib from 'async';
import needle = require('needle');
import axios from 'axios';
import { Helper } from '../../common/helper';
import { updateMedicationFact } from './medication.facts.service';
import { updateNutritionFact } from './nutrition.facts.service';
import { updatePhysicalActivityFact } from './exercise.physical.activity.facts.service';
import { updateVitalFact } from './vital.facts.service';
import { updateMentalHealthFact } from './mental.health.facts.service';
import { ConfigurationManager } from "../../config/configuration.manager";

///////////////////////////////////////////////////////////////////////////////////

export interface AwardsFact {
    PatientUserId : uuid;
    RecordId      : uuid;
    FactType     ?: string;
    Facts         : any;
    RecordDate    : Date;
    RecordDateStr?: string;
    RecordTimeZone?: string;
}

///////////////////////////////////////////////////////////////////////////////////

const ASYNC_TASK_COUNT = 4;

const headers = {
    'Content-Type'    : 'application/x-www-form-urlencoded',
    Accept            : '*/*',
    'Cache-Control'   : 'no-cache',
    'Accept-Encoding' : 'gzip, deflate, br',
    Connection        : 'keep-alive',
    'x-api-key'       : process.env.AWARDS_SERVICE_API_KEY,
};

const enum FactType {
    Medication       = 'Medication',
    Nutrition        = 'Nutrition',
    PhysicalActivity = 'Physical-Activity',
    Vitals           = 'Vitals',
    Symptoms         = 'Symptoms',
    MentalHealth     = 'Mental-Health',
    Mindfulness      = 'Mindfullness'
}

///////////////////////////////////////////////////////////////////////////////////

export class AwardsFactsService {

    //#region Private static members

    static _eventTypes = [];

    static _groupActivityTypes = [];

    static _initialized = false;

    //#endregion Privates

    //#region Task queue

    static _q = asyncLib.queue((model: AwardsFact, onCompleted) => {
                        
        //Only if gamification is enabled
        if (ConfigurationManager.GamificationEnabled() === false) {
            return;
        }

        (async () => {
            await AwardsFactsService.record(model);
            onCompleted(model);
        })();
    }, ASYNC_TASK_COUNT);

    private static enqueue = (model: AwardsFact) => {
        this._q.push(model, (model, error) => {
            if (error) {
                Logger.instance().log(`Error recording Awards Facts: ${JSON.stringify(error)}`);
                Logger.instance().log(`Error recording Awards Facts: ${JSON.stringify(error.stack, null, 2)}`);
            }
            else {
                Logger.instance().log(`Recorded Awards Facts: ${JSON.stringify(model, null, 2)}`);
            }
        });
    };

    //#endregion

    //#region Private static methods

    private static record = async(model: AwardsFact) => {

        if (!AwardsFactsService._initialized) {
            await this.initialize();
        }

        if (model.FactType === FactType.Medication) {
            await updateMedicationFact(model);
            const eventType = AwardsFactsService._eventTypes.find(x => x.Name === 'Medication');
            if (eventType) {
                //Send event to awards service
                await this.notifyAwardsService(eventType.id, model);
            }
        }
        else if (model.FactType === FactType.Nutrition) {
            await updateNutritionFact(model);
            const eventType = AwardsFactsService._eventTypes.find(x => x.Name === 'Nutrition');
            if (eventType) {
                //Send event to awards service
                await this.notifyAwardsService(eventType.id, model);
            }
        }
        else if (model.FactType === FactType.PhysicalActivity) {
            await updatePhysicalActivityFact(model);
            const eventType = AwardsFactsService._eventTypes.find(x => x.Name === 'Exercise');
            if (eventType) {
                //Send event to awards service
                await this.notifyAwardsService(eventType.id, model);
            }
        }
        else if (model.FactType === FactType.Vitals) {
            await updateVitalFact(model);
            const eventType = AwardsFactsService._eventTypes.find(x => x.Name === 'Vital');
            if (eventType) {
                //Send event to awards service
                await this.notifyAwardsService(eventType.id, model);
            }
        }
        else if (model.FactType === FactType.MentalHealth) {
            await updateMentalHealthFact(model);
            const eventType = AwardsFactsService._eventTypes.find(x => x.Name === 'MentalHealth');
            if (eventType) {
                //Send event to awards service
                await this.notifyAwardsService(eventType.id, model);
            }
        }
    };

    private static getEventTypes = async () => {
        try {
            const options = Helper.getNeedleOptions(headers);
            var url = process.env.AWARDS_SERVICE_BASE_URL + '/api/v1/types/event-types';
            var response = await needle('get', url, options);
            if (response.statusCode === 200) {
                Logger.instance().log('Successfully retrieved award event types!');
                AwardsFactsService._eventTypes = response.body.Data.Types;
                AwardsFactsService._initialized = true;
                return true;
            } else {
                Logger.instance().error('Unable to retrieve award event types!', response.statusCode, response.Data);
                AwardsFactsService._initialized = true;
                return false;
            }
        }
        catch (error) {
            Logger.instance().log(`${error.message}`);
        }
    };

    private static getGroupActivityTypes = async () => {
        try {
            const options = Helper.getNeedleOptions(headers);
            var url = process.env.AWARDS_SERVICE_BASE_URL + '/api/v1/types/group-activity-types';
            var response = await needle('get', url, options);
            if (response.statusCode === 200) {
                Logger.instance().log('Successfully retrieved award group activity types!');
                AwardsFactsService._groupActivityTypes = response.body.Data.Types;
            } else {
                Logger.instance().error('Unable to retrieve award group activity types!', response.statusCode, response.Data);
                return [];
            }
        }
        catch (error) {
            Logger.instance().log(`${error.message}`);
        }
    };

    private static notifyAwardsService = async (eventTypeId: uuid, model: AwardsFact) => {
        try {
            var url = process.env.AWARDS_SERVICE_BASE_URL + '/api/v1/engine/events';
            var body = {
                TypeId      : eventTypeId,
                ReferenceId : model.PatientUserId,
                Payload     : model,
            };
            var response = await axios.post(url, body, { headers });
            if (response.status === 201) {
                Logger.instance().log('Successfully triggered award event!');
                return true;
            } else {
                Logger.instance().error('Unable to trigger award event!', response.status, response.data);
                return false;
            }
        }
        catch (error) {
            Logger.instance().log(`${error.message}`);
        }
    };

    //#endregion

    public static addOrUpdateMedicationFact = (model: AwardsFact) => {
        try {
            model.FactType = 'Medication';
            model.RecordDateStr = (model.RecordDate).toISOString().split('T')[0];
            AwardsFactsService.enqueue(model);
        }
        catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
    };

    public static addOrUpdateNutritionResponseFact = (model: AwardsFact) => {
        try {
            model.FactType = 'Nutrition';
            model.RecordDateStr = (model.RecordDate).toISOString().split('T')[0];
            AwardsFactsService.enqueue(model);
        }
        catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
    };

    public static addOrUpdatePhysicalActivityResponseFact = (model: AwardsFact) => {
        try {
            model.FactType = 'Physical-Activity';
            model.RecordDateStr = (model.RecordDate).toISOString().split('T')[0];
            AwardsFactsService.enqueue(model);
        }
        catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
    };

    public static addOrUpdateVitalFact = (model: AwardsFact) => {
        try {
            model.FactType = 'Vitals';
            model.RecordDateStr = (model.RecordDate).toISOString().split('T')[0];
            AwardsFactsService.enqueue(model);
        }
        catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
    };

    public static addOrUpdateMentalHealthResponseFact = (model: AwardsFact) => {
        try {
            model.FactType = 'Mental-Health';
            model.RecordDateStr = (model.RecordDate).toISOString().split('T')[0];
            AwardsFactsService.enqueue(model);
        }
        catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
    };

    public static initialize = async () => {

        //Only if gamification is enabled
        if (ConfigurationManager.GamificationEnabled() === false) {
            return true;
        }

        if (this._initialized) {
            return true;
        }
        await this.getGroupActivityTypes();
        return await this.getEventTypes();
    };

}
