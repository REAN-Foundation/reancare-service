import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { AntenatalMedicationDomainModel } from '../../../../../../domain.types/clinical/maternity/antenatal.medication/antenatal.medication.domain.model';
import { AntenatalMedicationDto } from '../../../../../../domain.types/clinical/maternity/antenatal.medication/antenatal.medication.dto';
import { IAntenatalMedicationRepo } from '../../../../../repository.interfaces/clinical/maternity/antenatal.medication.repo.interface';
import { AntenatalMedicationMapper } from '../../../mappers/clinical/maternity/antenatal.medication.mapper';
import AntenatalMedication from '../../../models/clinical/maternity/antenatal.medication.model';

///////////////////////////////////////////////////////////////////////

export class AntenatalMedicationRepo implements IAntenatalMedicationRepo {

    totalCount = async (): Promise<number> => {
        try {
            return await AntenatalMedication.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    create = async (createModel: AntenatalMedicationDomainModel): Promise<AntenatalMedicationDto> => {
        try {
            const entity = {
                AnteNatalVisitId : createModel.AnteNatalVisitId,
                PregnancyId      : createModel.PregnancyId,
                VisitId          : createModel.VisitId,
                Name             : createModel.Name,
                Given            : createModel.Given,
                MedicationId     : createModel.MedicationId
            };

            const medication = await AntenatalMedication.create(entity);
            return AntenatalMedicationMapper.toDto(medication);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<AntenatalMedicationDto> => {
        try {
            const medication = await AntenatalMedication.findByPk(id);
            return AntenatalMedicationMapper.toDto(medication);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (antenatalMedicationId: string, updateModel: AntenatalMedicationDomainModel):
    Promise<AntenatalMedicationDto> => {
        try {
            const medication = await AntenatalMedication.findByPk(antenatalMedicationId);
            if (!medication) throw new ApiError(404, 'Antenatal medication not found');

            if (updateModel.Name != null) medication.Name = updateModel.Name;
            if (updateModel.Given != null) medication.Given = updateModel.Given;

            await medication.save();

            return AntenatalMedicationMapper.toDto(medication);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await AntenatalMedication.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
