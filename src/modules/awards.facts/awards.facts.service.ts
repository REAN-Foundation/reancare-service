/* eslint-disable newline-per-chained-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '../../common/logger';
import { AwardsFactsSource } from '../awards.facts/awards.facts.db.connector';
import { MedicationFact } from './models/medication.fact.model';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { Repository } from 'typeorm';
import * as asyncLib from 'async';

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

///////////////////////////////////////////////////////////////////////////////////

export class AwardsFactsService {

    //#region Privates

    static _medfactRepository: Repository<MedicationFact> = AwardsFactsSource.getRepository(MedicationFact);

    static _q = asyncLib.queue((model: AwardsFact, onCompleted) => {
        (async () => {
            await AwardsFactsService.record(model);
            onCompleted(model);
        })();
    }, ASYNC_TASK_COUNT);

    private static addOrUpdate = (model: AwardsFact) => {
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

    private static record = async(model: AwardsFact) => {
        if (model.FactType === 'Medication') {
            await this.updateMedicationFact(model);
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
    //#endregion Privates

    public static addOrUpdateMedicationFact = (model: AwardsFact) => {
        try {
            model.FactType = 'Medication';
            model.RecordDateStr = (new Date()).toISOString().split('T')[0];
            AwardsFactsService.addOrUpdate(model);
        }
        catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
    };

}
