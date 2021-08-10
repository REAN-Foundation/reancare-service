import { DoctorDomainModel, DoctorDetailsDto, DoctorDto, DoctorSearchFilters, DoctorSearchResults } from "../../../domain.types/doctor.domain.types";
import { IDoctorRepo } from "../../../repository.interfaces/doctor.repo.interface";
import { Logger } from "../../../../common/logger";
import { ApiError } from "../../../../common/api.error";
import Doctor from "../models/doctor.model";
import { DoctorMapper } from "../mappers/doctor.mapper";
import { Op } from 'sequelize';
import Person from "../models/person.model";

///////////////////////////////////////////////////////////////////////////////////

export class DoctorRepo implements IDoctorRepo {

    create = async (doctorDomainModel: DoctorDomainModel): Promise<DoctorDetailsDto> => {
        try {
            const entity = {
                UserId           : doctorDomainModel.UserId,
                PersonId         : doctorDomainModel.PersonId,
                DisplayId        : doctorDomainModel.DisplayId,
                NationalHealthId : doctorDomainModel.NationalDigiDoctorId,
                EhrId            : doctorDomainModel.EhrId
            };
            const doctor = await Doctor.create(entity);
            const dto = await DoctorMapper.toDetailsDto(doctor);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByUserId = async (userId: string): Promise<DoctorDetailsDto> => {
        try {
            const doctor = await Doctor.findOne({ where: { UserId: userId } });
            const dto = await DoctorMapper.toDetailsDto(doctor);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateByUserId = async (userId: string, doctorDomainModel: DoctorDomainModel): Promise<DoctorDetailsDto> => {
        try {
            const doctor = await Doctor.findOne({ where: { UserId: userId } });
            
            const dto = await DoctorMapper.toDetailsDto(doctor);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    search = async (filters: DoctorSearchFilters): Promise<DoctorSearchResults> => {
        try {

            const search: any = { where: {}, include: [] };

            const includesObj =
            {
                model    : Person,
                required : true,
                where    : {
                },
            };

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
                ]
            }
            if (filters.Locality != null) {
                includesObj.where['Locality'] = { [Op.like]: '%' + filters.Locality + '%' };
            }
            if (filters.Qualifications != null) {
                includesObj.where['Qualifications'] = { [Op.like]: '%' + filters.Qualifications + '%' };
            }
            if (filters.Specialities != null) {
                includesObj.where['Specialities'] = { [Op.like]: '%' + filters.Specialities + '%' };
            }
            if (filters.ProfessionalHighlights != null) {
                includesObj.where['ProfessionalHighlights'] = { [Op.like]: '%' + filters.ProfessionalHighlights + '%' };
            }

            if (filters.ConsultationFeeFrom != null && filters.ConsultationFeeTo != null) {
                includesObj.where['ConsultationFee'] = {
                    [Op.gte] : filters.ConsultationFeeFrom,
                    [Op.lte] : filters.ConsultationFeeTo,
                };
            }
            else if (filters.ConsultationFeeFrom == null && filters.ConsultationFeeTo != null) {
                includesObj.where['ConsultationFee'] = {
                    [Op.lte] : filters.ConsultationFeeTo,
                };
            }
            else if (filters.ConsultationFeeFrom != null && filters.ConsultationFeeTo == null) {
                includesObj.where['ConsultationFee'] = {
                    [Op.gte] : filters.ConsultationFeeFrom,
                };
            }

            if (filters.PractisingSinceFrom != null && filters.PractisingSinceTo != null) {
                includesObj.where['PractisingSince'] = {
                    [Op.gte] : filters.PractisingSinceFrom,
                    [Op.lte] : filters.PractisingSinceTo,
                };
            }
            else if (filters.PractisingSinceFrom == null && filters.PractisingSinceTo != null) {
                includesObj.where['PractisingSince'] = {
                    [Op.lte] : filters.PractisingSinceTo,
                };
            }
            else if (filters.PractisingSinceFrom != null && filters.PractisingSinceTo == null) {
                includesObj.where['PractisingSince'] = {
                    [Op.gte] : filters.PractisingSinceFrom,
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

            search.include.push(includesObj);

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

            const foundResults = await Doctor.findAndCountAll(search);
            
            const dtos: DoctorDto[] = [];
            for (const doctor of foundResults.rows) {
                const dto = await DoctorMapper.toDto(doctor);
                dtos.push(dto);
            }

            const searchResults: DoctorSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos
            }
            
            return searchResults;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }
    
}
