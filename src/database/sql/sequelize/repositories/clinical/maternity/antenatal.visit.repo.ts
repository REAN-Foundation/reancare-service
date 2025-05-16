import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { AntenatalVisitDomainModel } from '../../../../../../domain.types/clinical/maternity/antenatal.visit/antenatal.visit.domain.type';
import { AntenatalVisitDto } from '../../../../../../domain.types/clinical/maternity/antenatal.visit/antenatal.visit.dto';
import { IAntenatalVisitRepo } from '../../../../../repository.interfaces/clinical/maternity/antenatal.visit.repo.interface';
import { AntenatalVisitMapper } from '../../../mappers/clinical/maternity/antenatal.visit.mapper';
import AnteNatalVisit from '../../../models/clinical/maternity/antenatal.visit.model';

///////////////////////////////////////////////////////////////////////

export class AntenatalVisitRepo implements IAntenatalVisitRepo {

    totalCount = async (): Promise<number> => {
        try {
            return await AnteNatalVisit.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    create = async (createModel: AntenatalVisitDomainModel): Promise<AntenatalVisitDto> => {
        try {
            const entity = {
                VisitId           : createModel.VisitId,
                ExternalVisitId   : createModel.ExternalVisitId,
                PregnancyId       : createModel.PregnancyId,
                PatientUserId     : createModel.PatientUserId,
                DateOfVisit       : createModel.DateOfVisit,
                GestationInWeeks  : createModel.GestationInWeeks,
                FetalHeartRateBPM : createModel.FetalHeartRateBPM,
                FundalHeight      : createModel.FundalHeight ? JSON.stringify(createModel.FundalHeight) : null,
                DateOfNextVisit   : createModel.DateOfNextVisit,
                BodyWeightID      : createModel.BodyWeightID,
                BodyTemperatureId : createModel.BodyTemperatureId,
                BloodPressureId   : createModel.BloodPressureId
            };

            const visit = await AnteNatalVisit.create(entity);
            return AntenatalVisitMapper.toDto(visit);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<AntenatalVisitDto> => {
        try {
            const visit = await AnteNatalVisit.findByPk(id);
            return AntenatalVisitMapper.toDto(visit);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, updateModel: AntenatalVisitDomainModel): Promise<AntenatalVisitDto> => {
        try {
            const antenatalVisit = await AnteNatalVisit.findByPk(id);

            if (!antenatalVisit) {
                throw new ApiError(404, "Antenatal visit record not found.");
            }

            if (updateModel.DateOfVisit != null) {
                antenatalVisit.DateOfVisit = updateModel.DateOfVisit;
            }
            if (updateModel.GestationInWeeks != null) {
                antenatalVisit.GestationInWeeks = updateModel.GestationInWeeks;
            }
            if (updateModel.FetalHeartRateBPM != null) {
                antenatalVisit.FetalHeartRateBPM = updateModel.FetalHeartRateBPM;
            }

            if (updateModel.FundalHeight != null) {
                antenatalVisit.FundalHeight = JSON.stringify(updateModel.FundalHeight);
            }

            await antenatalVisit.save();

            return AntenatalVisitMapper.toDto(antenatalVisit);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await AnteNatalVisit.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
