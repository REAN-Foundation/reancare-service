import { Op } from 'sequelize';
import { ApiError } from "../../../../../../common/api.error";
import { Logger } from "../../../../../../common/logger";
import { PatientDomainModel } from "../../../../../../domain.types/users/patient/patient/patient.domain.model";
import { PatientDetailsDto, PatientDto } from "../../../../../../domain.types/users/patient/patient/patient.dto";
import { PatientSearchFilters, PatientSearchResults } from "../../../../../../domain.types/users/patient/patient/patient.search.types";
import { IPatientRepo } from "../../../../../repository.interfaces/users/patient/patient.repo.interface";
import { PatientMapper } from "../../../mappers/users/patient/patient.mapper";
import Patient from "../../../models/users/patient/patient.model";
import Person from "../../../models/person/person.model";
import { AuthDomainModel } from '../../../../../../domain.types/webhook/auth.domain.model';
import { ReAuthDomainModel } from '../../../../../../domain.types/webhook/reauth.domain.model';
import User from '../../../models/users/user/user.model';

///////////////////////////////////////////////////////////////////////////////////

export class PatientRepo implements IPatientRepo {

    create = async (patientDomainModel: PatientDomainModel): Promise<PatientDetailsDto> => {
        try {
            const entity = {
                UserId           : patientDomainModel.UserId,
                PersonId         : patientDomainModel.PersonId,
                DisplayId        : patientDomainModel.DisplayId,
                NationalHealthId : patientDomainModel.NationalHealthId,
                MedicalProfileId : patientDomainModel.MedicalProfileId,
                EhrId            : patientDomainModel.EhrId
            };
            const patient = await Patient.create(entity);
            const dto = await PatientMapper.toDetailsDto(patient);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByUserId = async (userId: string): Promise<PatientDetailsDto> => {
        try {
            const patient = await Patient.findOne({ where: { UserId: userId } });
            return await PatientMapper.toDetailsDto(patient);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByPersonId = async (personId: string): Promise<PatientDetailsDto> => {
        try {
            const patient = await Patient.findOne({ where: { PersonId: personId } });
            return await PatientMapper.toDetailsDto(patient);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateByUserId = async (userId: string, model: PatientDomainModel): Promise<PatientDetailsDto> => {
        try {
            const patient = await Patient.findOne({ where: { UserId: userId } });

            if (model.NationalHealthId !== undefined) {
                patient.NationalHealthId = model.NationalHealthId;
            }
            if (model.EhrId !== undefined) {
                patient.EhrId = model.EhrId;
            }
            if (model.HealthSystem != null) {
                patient.HealthSystem = model.HealthSystem;
            }
            if (model.AssociatedHospital != null) {
                patient.AssociatedHospital = model.AssociatedHospital;
            }
            if (model.DonorAcceptance != null) {
                patient.DonorAcceptance = model.DonorAcceptance;
            }
            if (model.IsRemindersLoaded != null) {
                patient.IsRemindersLoaded = model.IsRemindersLoaded;
            }
            await patient.save();
            return await PatientMapper.toDetailsDto(patient);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    deleteByUserId = async (userId: string): Promise<boolean> => {
        try {
            const count = await Patient.destroy({
                where : {
                    UserId : userId
                }
            });
            return count === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: PatientSearchFilters): Promise<PatientSearchResults> => {
        try {

            const search: any = { where: {}, include: [] };

            const includesObj =
            {
                model    : Person,
                required : true,
                where    : {
                },
            };

            const userIncludesObj =
            {
                model    : User,
                required : true,
                where    : {
                },
            };

            if (filters.UserName != null) {
                userIncludesObj.where['UserName'] = filters.UserName;
            }
            if (filters.Phone != null) {
                includesObj.where['Phone'] = { [Op.like]: '%' + filters.Phone + '%' };
            }
            if (filters.Email != null) {
                includesObj.where['Email'] = { [Op.like]: '%' + filters.Email + '%' };
            }
            if (filters.Gender != null) {
                includesObj.where['Gender'] = filters.Gender; //This should be exact. Either Male / Female / Other / Unknown.
            }
            if (filters.Name != null) {
                includesObj.where[Op.or] = [
                    {
                        FirstName : { [Op.like]: '%' + filters.Name + '%' },
                    },
                    {
                        LastName : { [Op.like]: '%' + filters.Name + '%' },
                    },
                ];
            }

            if (filters.BirthdateFrom != null && filters.BirthdateTo != null) {
                includesObj.where['BirthDate'] = {
                    [Op.gte] : filters.BirthdateFrom,
                    [Op.lte] : filters.BirthdateTo,
                };
            }
            else if (filters.BirthdateFrom == null && filters.BirthdateTo != null) {
                includesObj.where['BirthDate'] = {
                    [Op.lte] : filters.BirthdateTo,
                };
            }
            else if (filters.BirthdateFrom != null && filters.BirthdateTo == null) {
                includesObj.where['BirthDate'] = {
                    [Op.gte] : filters.BirthdateFrom,
                };
            }

            if (filters.CreatedDateFrom != null && filters.CreatedDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                    [Op.lte] : filters.CreatedDateTo,
                };
            }
            else if (filters.CreatedDateFrom == null && filters.CreatedDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.CreatedDateTo,
                };
            }
            else if (filters.CreatedDateFrom != null && filters.CreatedDateTo == null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                };
            }

            if (filters.DonorAcceptance != null) {
                search.where['DonorAcceptance'] = filters.DonorAcceptance;
            }

            search.include.push(includesObj);
            search.include.push(userIncludesObj);

            //Reference: https://sequelize.org/v5/manual/querying.html#ordering
            const orderByColum = 'CreatedAt';
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];
            if (filters.OrderBy) {
                const personAttributes = ['FirstName', 'LastName', 'BirthDate', 'Gender', 'Phone', 'Email'];
                const isPersonColumn = personAttributes.includes(filters.OrderBy);
                if (isPersonColumn) {
                    search['order'] = [[ 'Person', filters.OrderBy, order]];
                }
            }

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

            const foundResults = await Patient.findAndCountAll(search);

            const dtos: PatientDto[] = [];
            for (const patient of foundResults.rows) {
                const dto = await PatientMapper.toDto(patient);
                dtos.push(dto);
            }
            const count = foundResults.count;
            const totalCount = typeof count === "number" ? count : count[0];

            const searchResults: PatientSearchResults = {
                TotalCount     : totalCount,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos
            };

            return searchResults;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAllPatientUserIds = async (): Promise<any[]> => {
        try {
            const patients = await Patient.findAll({ attributes: ["UserId"] });
            var patientUserIds = [];
            patients.forEach(p => {
                patientUserIds.push(p.UserId);
            });

            return patientUserIds;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getPatientsRegisteredLastMonth = async (): Promise<any[]> => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
    
            const lastMonth = new Date(today);
            lastMonth.setDate(lastMonth.getDate() - 30);
    
            const patients = await Patient.findAll({
                where: {
                    CreatedAt: {
                        [Op.between]: [lastMonth, today],
                    },
                },
            });
    
            return patients;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAllRegisteredPatients = async (): Promise<any[]> => {
        try {
            const patients = await Patient.findAll();
            return patients;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    terraAuth = async (reference_id: string, model: AuthDomainModel) => {
        try {
            const patient = await Patient.findOne({ where: { UserId: reference_id } });

            if (model.User.UserId != null) {
                patient.TerraUserId = model.User.UserId;
            }
            if (model.User.Provider != null) {
                patient.TerraProvider = model.User.Provider;
            }
            if (model.User.Scopes != null) {
                patient.TerraScopes = model.User.Scopes;
            }
            await patient.save();
            await PatientMapper.toDetailsDto(patient);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    terraReAuth = async (referenceId: string, model: ReAuthDomainModel) => {
        try {
            const patient = await Patient.findOne({ where: { UserId: referenceId } });

            if (model.NewUser.UserId != null) {
                patient.TerraUserId = model.NewUser.UserId;
            }
            if (model.NewUser.Provider != null) {
                patient.TerraProvider = model.NewUser.Provider;
            }
            if (model.NewUser.Scopes != null) {
                patient.TerraScopes = model.NewUser.Scopes;
            }
            await patient.save();
            await PatientMapper.toDetailsDto(patient);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
