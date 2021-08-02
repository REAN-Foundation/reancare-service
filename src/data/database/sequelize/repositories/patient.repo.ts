import { PatientDomainModel, PatientDetailsDto, PatientDto, PatientSearchFilters, PatientSearchResults, PatientDetailsSearchResults } from "../../../domain.types/patient.domain.types";
import { IPatientRepo } from "../../../repository.interfaces/patient.repo.interface";
import { Logger } from "../../../../common/logger";
import { ApiError } from "../../../../common/api.error";
import Patient from "../models/patient.model";
import { PatientMapper } from "../mappers/patient.mapper";
import User from "../models/user.model";
import { Op, Sequelize } from 'sequelize';
import Person from "../models/person.model";
///////////////////////////////////////////////////////////////////////////////////

export class PatientRepo implements IPatientRepo {

    create = async (patientDomainModel: PatientDomainModel): Promise<PatientDetailsDto> => {
        try {
            var entity = {
                UserId: patientDomainModel.UserId,
                PersonId: patientDomainModel.PersonId,
                DisplayId: patientDomainModel.DisplayId,
                NationalHealthId: patientDomainModel.NationalHealthId,
                MedicalProfileId: patientDomainModel.MedicalProfileId,
                EhrId: patientDomainModel.EhrId
            };
            var patient = await Patient.create(entity);
            var dto = await PatientMapper.toDetailsDto(patient);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByUserId = async (userId: string): Promise<PatientDetailsDto> => {
        try {
            var patient = await Patient.findOne({where: {UserId: userId}});
            var dto = await PatientMapper.toDetailsDto(patient);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    updateByUserId = async (userId: string, patientDomainModel: PatientDomainModel): Promise<PatientDetailsDto> => {
        try {
            var patient = await Patient.findOne({where: {UserId: userId}});
        
            var dto = await PatientMapper.toDetailsDto(patient);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    search = async (filters: PatientSearchFilters): Promise<PatientSearchResults> => {
        try {

            var search: any = { where: {}, include: [] };

            var includesObj = 
            {
                model: Person,
                required: true,
                where: { 
                },
            };

            if(filters.Phone != null) {
                includesObj.where['Phone'] = { [Op.like]: '%' + filters.Phone + '%' };
            }
            if(filters.Email != null) {
                includesObj.where['Email'] = { [Op.like]: '%' + filters.Email + '%' };
            }
            if(filters.Gender != null) {
                includesObj.where['Gender'] = filters.Gender; //This should be exact. Either Male / Female / Other / Unknown.
            }
            if (filters.Name != null) {
                includesObj.where[Op.or] = [
                    {
                        FirstName: { [Op.like]: '%' + filters.Name + '%' },
                    },
                    {
                        LastName: { [Op.like]: '%' + filters.Name + '%' },
                    },
                ]
            }

            if (filters.BirthdateFrom != null && filters.BirthdateTo != null) {
                includesObj.where['BirthDate'] = {
                    [Op.gte]: filters.BirthdateFrom,
                    [Op.lte]: filters.BirthdateTo,
                };
            } 
            else if (filters.BirthdateFrom == null && filters.BirthdateTo != null) {
                includesObj.where['BirthDate'] = {
                    [Op.lte]: filters.BirthdateTo,
                };
            } 
            else if (filters.BirthdateFrom != null && filters.BirthdateTo == null) {
                includesObj.where['BirthDate'] = {
                    [Op.gte]: filters.BirthdateFrom,
                };
            }

            if(filters.CreatedDateFrom != null && filters.CreatedDateTo != null) {
                search.where['CreatedAt'] = { 
                    [Op.gte]: filters.CreatedDateFrom,
                    [Op.lte]: filters.CreatedDateTo,
                };
            }
            else if(filters.CreatedDateFrom == null && filters.CreatedDateTo != null) {
                search.where['CreatedAt'] = { 
                    [Op.lte]: filters.CreatedDateTo,
                };
            }
            else if(filters.CreatedDateFrom != null && filters.CreatedDateTo == null) {
                search.where['CreatedAt'] = { 
                    [Op.gte]: filters.CreatedDateFrom,
                };
            }

            search.include.push(includesObj);

            //Reference: https://sequelize.org/v5/manual/querying.html#ordering
            var orderByColum = 'CreatedAt';
            var order = 'ASC';
            if (filters.Order == 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];
            if (filters.OrderBy) {
                var personAttributes = ['FirstName', 'LastName', 'BirthDate', 'Gender', 'Phone', 'Email'];
                var isPersonColumn = personAttributes.includes(filters.OrderBy);
                if(isPersonColumn) {
                    search['order'] = [[ 'Person', filters.OrderBy, order]];
                }
            }

            var limit = 25;
            if(filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            var offset = 0;
            var pageIndex = 0;
            if(filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            var foundResults = await Patient.findAndCountAll(search);
            
            var dtos: PatientDto[] = [];
            for(var patient of foundResults.rows) {
                var dto = await PatientMapper.toDto(patient);
                dtos.push(dto);
            }

            var searchResults: PatientSearchResults = {
                TotalCount: foundResults.count,
                RetrievedCount: dtos.length,
                PageIndex: pageIndex,
                ItemsPerPage: limit,
                Order: order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy: orderByColum,
                Items: dtos
            }
            
            return searchResults;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }
    
    searchFull(filters: PatientSearchFilters): Promise<PatientDetailsSearchResults> {
        throw new Error("Method not implemented.");
    }

}
