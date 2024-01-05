import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { MedicationDomainModel } from '../../../../../../domain.types/clinical/medication/medication/medication.domain.model';
import { MedicationDto } from '../../../../../../domain.types/clinical/medication/medication/medication.dto';
import { MedicationSearchFilters, MedicationSearchResults } from '../../../../../../domain.types/clinical/medication/medication/medication.search.types';
import { IMedicationRepo } from '../../../../../repository.interfaces/clinical/medication/medication.repo.interface';
import { MedicationMapper } from '../../../mappers/clinical/medication/medication.mapper';
import Medication from '../../../models/clinical/medication/medication.model';

///////////////////////////////////////////////////////////////////////

export class MedicationRepo implements IMedicationRepo {

    create = async (model: MedicationDomainModel): Promise<MedicationDto> => {
        try {
            const entity = {
                PatientUserId             : model.PatientUserId,
                MedicalPractitionerUserId : model.MedicalPractitionerUserId ?? null,
                VisitId                   : model.VisitId ?? null,
                OrderId                   : model.OrderId ?? null,
                DrugId                    : model.DrugId,
                DrugName                  : model.DrugName,
                Dose                      : model.Dose.toString(),
                DosageUnit                : model.DosageUnit,
                TimeSchedules             : JSON.stringify(model.TimeSchedules),
                Frequency                 : model.Frequency,
                FrequencyUnit             : model.FrequencyUnit,
                Route                     : model.Route,
                Duration                  : model.Duration,
                DurationUnit              : model.DurationUnit,
                StartDate                 : model.StartDate,
                EndDate                   : model.EndDate,
                RefillNeeded              : model.RefillNeeded,
                RefillCount               : model.RefillCount,
                Instructions              : model.Instructions,
                ImageResourceId           : model.ImageResourceId ?? null,
                IsExistingMedication      : model.IsExistingMedication,
                TakenForLastNDays         : model.TakenForLastNDays,
                ToBeTakenForNextNDays     : model.ToBeTakenForNextNDays,
                IsCancelled               : model.IsCancelled,
            };
            const medication = await Medication.create(entity);
            return await MedicationMapper.toDto(medication);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<MedicationDto> => {
        try {
            const medication = await Medication.findByPk(id);
            const dto = await MedicationMapper.toDto(medication);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getCurrentMedications = async (patientUserId: string): Promise<MedicationDto[]> => {
        try {
            
            var today = new Date();
            const medications = await Medication.findAll({
                where : {
                    PatientUserId : patientUserId,
                    StartDate     : {
                        [Op.lte] : today
                    },
                    EndDate : {
                        [Op.gte] : today
                    }
                }
            });

            return medications.map(x => MedicationMapper.toDto(x));

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: MedicationSearchFilters): Promise<MedicationSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.DrugName != null) {
                search.where['DrugName'] = { [Op.like]: '%' + filters.DrugName + '%' };
            }
            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MedicalPractitionerUserId != null) {
                search.where['MedicalPractitionerUserId'] = filters.MedicalPractitionerUserId;
            }
            if (filters.VisitId != null) {
                search.where['VisitId'] = filters.VisitId;
            }
            if (filters.OrderId != null) {
                search.where['OrderId'] = filters.OrderId;
            }
            if (filters.RefillNeeded != null) {
                search.where['RefillNeeded'] = filters.RefillNeeded;
            }
            if (filters.IsExistingMedication != null) {
                search.where['IsExistingMedication'] = filters.IsExistingMedication;
            }

            if (filters.StartDateFrom != null && filters.StartDateTo != null) {
                search.where['StartDate'] = {
                    [Op.gte] : filters.StartDateFrom,
                    [Op.lte] : filters.StartDateTo,
                };
            } else if (filters.StartDateFrom === null && filters.StartDateTo !== null) {
                search.where['StartDate'] = {
                    [Op.lte] : filters.StartDateTo,
                };
            } else if (filters.StartDateFrom !== null && filters.StartDateTo === null) {
                search.where['StartDate'] = {
                    [Op.gte] : filters.StartDateFrom,
                };
            }

            if (filters.EndDateFrom != null && filters.EndDateTo != null) {
                search.where['EndDate'] = {
                    [Op.gte] : filters.EndDateFrom,
                    [Op.lte] : filters.EndDateTo,
                };
            } else if (filters.EndDateFrom === null && filters.EndDateTo !== null) {
                search.where['EndDate'] = {
                    [Op.lte] : filters.EndDateTo,
                };
            } else if (filters.EndDateFrom !== null && filters.EndDateTo === null) {
                search.where['EndDate'] = {
                    [Op.gte] : filters.EndDateFrom,
                };
            }
            
            if (filters.CreatedDateFrom != null && filters.CreatedDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                    [Op.lte] : filters.CreatedDateTo,
                };
            } else if (filters.CreatedDateFrom === null && filters.CreatedDateTo !== null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.CreatedDateTo,
                };
            } else if (filters.CreatedDateFrom !== null && filters.CreatedDateTo === null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                };
            }

            let orderByColum = 'DrugName';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await Medication.findAndCountAll(search);

            const dtos: MedicationDto[] = [];
            for (const medication of foundResults.rows) {
                const dto = await MedicationMapper.toDto(medication);
                dtos.push(dto);
            }

            const searchResults: MedicationSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };

            return searchResults;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, model: MedicationDomainModel): Promise<MedicationDto> => {
        try {
            const medication = await Medication.findByPk(id);

            if (model.EhrId != null) {
                medication.EhrId = model.EhrId;
            }
            if (model.MedicalPractitionerUserId != null) {
                medication.MedicalPractitionerUserId = model.MedicalPractitionerUserId;
            }
            if (model.VisitId != null) {
                medication.VisitId = model.VisitId;
            }
            if (model.OrderId != null) {
                medication.OrderId = model.OrderId;
            }

            // if (model.DrugName != null) {
            //     medication.DrugName = model.DrugName;
            // }
            
            if (model.DrugId != null) {
                medication.DrugId = model.DrugId;
            }
            if (model.Dose != null) {
                medication.Dose = model.Dose.toString();
            }
            if (model.DosageUnit != null) {
                medication.DosageUnit = model.DosageUnit;
            }
            if (model.TimeSchedules != null) {
                var schedules = JSON.stringify(model.TimeSchedules);
                medication.TimeSchedules = schedules;
            }
            if (model.Frequency != null) {
                medication.Frequency = model.Frequency;
            }
            if (model.FrequencyUnit != null) {
                medication.FrequencyUnit = model.FrequencyUnit;
            }
            if (model.Route != null) {
                medication.Route = model.Route;
            }
            if (model.Duration != null) {
                medication.Duration = model.Duration;
            }
            if (model.DurationUnit != null) {
                medication.DurationUnit = model.DurationUnit;
            }
            if (model.StartDate != null) {
                medication.StartDate = model.StartDate;
            }
            if (model.ImageResourceId != null) {
                medication.ImageResourceId = model.ImageResourceId;
            }
            if (model.Instructions != null) {
                medication.Instructions = model.Instructions;
            }
            if (model.EndDate != null) {
                medication.EndDate = model.EndDate;
            }

            await medication.save();

            const dto = await MedicationMapper.toDto(medication);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await Medication.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
