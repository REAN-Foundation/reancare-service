/* eslint-disable newline-per-chained-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '../../common/logger';
import { AwardsFactsSource } from '../awards.facts/awards.facts.db.connector';
import { MedicationFact } from './models/medication.fact.model';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { Repository } from 'typeorm';
import * as asyncLib from 'async';
import needle = require('needle');
import { Helper } from '../../common/helper';

///////////////////////////////////////////////////////////////////////////////////

export interface AwardsFact {
    PatientUserId : uuid;
    RecordId      : uuid;
    FactType     ?: string;
    Facts         : any;
    RecordDate    : Date;
    RecordDateStr?: string;
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

///////////////////////////////////////////////////////////////////////////////////

export class AwardsFactsService {

    //#region Private static members

    static _medfactRepository: Repository<MedicationFact> = AwardsFactsSource.getRepository(MedicationFact);

    static _eventTypes: { id: uuid; Name: string; Description: string; } [] = [];

    static _initialized = false;

    //#endregion Privates

    //#region Task queue

    static _q = asyncLib.queue((model: AwardsFact, onCompleted) => {
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

        if (!this._initialized) {
            await this.initialize();
        }

        if (model.FactType === 'Medication') {
            await this.updateMedicationFact(model);
            const eventType = this._eventTypes.find(x => x.Name === 'Medication');
            if (eventType) {
                //Send event to awards service
                await this.notifyAwardsService(eventType.id, model);
            }
        }
    }

    private static getEventTypes = async () => {
        try {
            const options = Helper.getNeedleOptions(headers);
            var url = process.env.AWARDS_SERVICE_BASE_URL + '/api/v1/types/event-types';
            var response = await needle('get', url, options);
            if (response.statusCode === 200) {
                Logger.instance().log('Successfully triggered award event!');
                this._eventTypes = response.body.Data;
                this._initialized = true;
                return true;
            } else {
                Logger.instance().error('Unable to trigger award event!', response.statusCode, response.Data);
                this._initialized = true;
                return false;
            }
        }
        catch (error) {
            Logger.instance().log(`${error.message}`);
        }
    }

    private static notifyAwardsService = async (eventTypeId: uuid, model: AwardsFact) => {
        try {
            const options = Helper.getNeedleOptions(headers);
            var url = process.env.AWARDS_SERVICE_BASE_URL + '/api/v1/engine/events';
            var body = {
                TypeId      : eventTypeId,
                ReferenceId : model.PatientUserId,
                Payload     : model,
            };
            var response = await needle('post', url, body, options);
            if (response.statusCode === 201) {
                Logger.instance().log('Successfully triggered award event!');
                return true;
            } else {
                Logger.instance().error('Unable to trigger award event!', response.statusCode, response.body.Data);
                return false;
            }
        }
        catch (error) {
            Logger.instance().log(`${error.message}`);
        }
    }

    private static async updateMedicationFact(model: AwardsFact) {
        const existing = await this._medfactRepository.findOne({
            where : {
                RecordId : model.RecordId
            }
        });
        if (!existing) {
            const fact = {
                RecordId           : model.RecordId,
                ContextReferenceId : model.PatientUserId,
                MedicationId       : model.Facts.MedicationId,
                Taken              : model.Facts.Taken,
                Missed             : model.Facts.Missed,
                RecordDate         : model.RecordDate,
                RecrodDateStr      : model.RecordDateStr
            };
            const record = await this._medfactRepository.create(fact);
            const saved = await this._medfactRepository.save(record);
        }
        else {
            existing.Taken = model.Facts.Taken ?? (await existing).Taken;
            existing.Missed = model.Facts.Missed ?? (await existing).Missed;
            const updated = await this._medfactRepository.save(existing);
        }
    }

    //#endregion

    public static addOrUpdateMedicationFact = (model: AwardsFact) => {
        try {
            model.FactType = 'Medication';
            model.RecordDateStr = (new Date()).toISOString().split('T')[0];
            AwardsFactsService.enqueue(model);
        }
        catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
    };

    public static initialize = async () => {
        if (this._initialized) {
            return true;
        }
        return await this.getEventTypes();
    }

}
