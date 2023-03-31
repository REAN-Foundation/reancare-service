/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '../../common/logger';
import { AwardsFactsSource } from '../awards.facts/awards.facts.db.connector';
import { MedicationFact } from './models/medication.fact.model';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { Repository } from 'typeorm';
import * as asyncLib from 'async';

///////////////////////////////////////////////////////////////////////////////////

export interface AwardsFact {
    PatientUserId: uuid;
    RecordId: uuid;
    FactType: string;
    Facts: any;
    RecordDate: Date;
    RecordDateStr: string;
}

///////////////////////////////////////////////////////////////////////////////////

export class AwardsFactsService {

    static _medfactRepository: Repository<MedicationFact> = AwardsFactsSource.getRepository(MedicationFact);

    static _numAsyncTasks = 4;

    static _q = asyncLib.queue((model: AwardsFact, onCompleted) => {
        (async () => {
            model.RecordDateStr = (new Date()).toISOString()
                .split('T')[0];
            await AwardsFactsService.record(model);
            onCompleted(model);
        })();
    }, AwardsFactsService._numAsyncTasks);

    private static addOrUpdate = (model: AwardsFact) => {
        AwardsFactsService._q.push(model, (model, error) => {
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
    }

    public addOrUpdateMedicationFact = (model: AwardsFact) => {
        try {
            AwardsFactsService.addOrUpdate(model);
        }
        catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
    };

}
