import { IDoctorRepo } from "../../../../repository.interfaces/users/doctor.repo.interface";
import { Logger } from "../../../../../common/logger";
import { ApiError } from "../../../../../common/api.error";
import Doctor from "../../models/users/doctor.model";
import { DoctorMapper } from "../../mappers/users/doctor.mapper";
import { Op } from 'sequelize';
import Person from "../../models/person/person.model";
import { DoctorDetailsDto, DoctorDto } from '../../../../../domain.types/users/doctor/doctor.dto';
import { DoctorDomainModel } from '../../../../../domain.types/users/doctor/doctor.domain.model';
import { DoctorSearchFilters, DoctorSearchResults } from '../../../../../domain.types/users/doctor/doctor.search.types';

///////////////////////////////////////////////////////////////////////////////////

export class DoctorRepo implements IDoctorRepo {

    create = async (doctorDomainModel: DoctorDomainModel): Promise<DoctorDetailsDto> => {

        var specialities = doctorDomainModel.Specialities && doctorDomainModel.Specialities.length > 0 ?
            JSON.stringify(doctorDomainModel.Specialities) : '[]';

        var professionalHighlights = doctorDomainModel.ProfessionalHighlights &&
            doctorDomainModel.ProfessionalHighlights.length > 0 ?
            JSON.stringify(doctorDomainModel.ProfessionalHighlights) : '[]';

        try {
            const entity = {
                UserId                 : doctorDomainModel.UserId,
                PersonId               : doctorDomainModel.PersonId,
                DisplayId              : doctorDomainModel.DisplayId,
                NationalDigiDoctorId   : doctorDomainModel.NationalDigiDoctorId,
                EhrId                  : doctorDomainModel.EhrId,
                About                  : doctorDomainModel.About,
                Locality               : doctorDomainModel.Locality,
                Qualifications         : doctorDomainModel.Qualifications,
                PractisingSince        : doctorDomainModel.PractisingSince,
                Specialities           : specialities,
                ProfessionalHighlights : professionalHighlights,
                ConsultationFee        : doctorDomainModel.ConsultationFee
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
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateByUserId = async (userId: string, model: DoctorDomainModel): Promise<DoctorDetailsDto> => {
        try {
            const doctor = await Doctor.findOne({ where: { UserId: userId } });

            if (model.NationalDigiDoctorId != null) {
                doctor.NationalDigiDoctorId = model.NationalDigiDoctorId;
            }
            if (model.EhrId != null) {
                doctor.EhrId = model.EhrId;
            }
            if (model.About != null) {
                doctor.About = model.About;
            }
            if (model.Locality != null) {
                doctor.Locality = model.Locality;
            }
            if (model.Qualifications != null) {
                doctor.Qualifications = model.Qualifications;
            }
            if (model.PractisingSince != null) {
                doctor.PractisingSince = model.PractisingSince;
            }
            if (model.Specialities != null && model.Specialities.length > 0) {

                var specialities = model.Specialities.length > 0 ?
                    JSON.stringify(model.Specialities) : '[]';

                doctor.Specialities = specialities;
            }
            if (model.ProfessionalHighlights != null && model.ProfessionalHighlights.length > 0) {

                var professionalHighlights = model.ProfessionalHighlights.length > 0 ?
                    JSON.stringify(model.ProfessionalHighlights) : '[]';

                doctor.ProfessionalHighlights = professionalHighlights;
            }
            if (model.ConsultationFee != null) {
                doctor.ConsultationFee = model.ConsultationFee;
            }

            await doctor.save();

            const dto = await DoctorMapper.toDetailsDto(doctor);

            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

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
                ];
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

            const count = foundResults.count;
            const totalCount = typeof count === "number" ? count : count[0];

            const searchResults: DoctorSearchResults = {
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

}
