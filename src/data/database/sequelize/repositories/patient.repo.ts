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
            if(patientDomainModel.User.Person.Prefix != null) {
                patient.NationalHealthId = patientDomainModel.NationalHealthId;
            }            
            var dto = await PatientMapper.toDetailsDto(patient);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    search = async (filters: PatientSearchFilters): Promise<PatientSearchResults> => {
        try {

            var search: any = { where: { } };
            // var includes = {
            //     include: [
            //         {
            //             model: Person,
            //             where: { 
            //                 Phone: { [Op.like]: '%' + filters.Phone + '%' },
            //             },
            //         },
            //     ],
            // };

            // if(filters.Phone != null) {
            //     search.where['Person']['Phone'] = { [Op.like]: '%' + filters.Phone + '%' };
            // }
            // if(filters.Email != null) {
            //     search.where['Person']['Email'] = { [Op.like]: '%' + filters.Email + '%' };
            // }
            // if(filters.Name != null) {
            //     search.where['Person']['FirstName'] = { [Op.like]: '%' + filters.Name + '%' };
            //     search.where['Person']['LastName'] = { [Op.like]: '%' + filters.Name + '%' };
            // }
            // if(filters.Gender != null) {
            //     search.where['Person']['Gender'] = { [Op.like]: '%' + filters.Gender + '%' };
            // }
            // if(filters.BirthdateFrom != null && filters.BirthdateTo != null) {
            //     search.where['Person']['BirthDate'] = { 
            //         [Op.gte]: filters.BirthdateFrom,
            //         [Op.lte]: filters.BirthdateTo,
            //     };
            // }
            // else if(filters.BirthdateFrom == null && filters.BirthdateTo != null) {
            //     search.where['Person']['BirthDate'] = { 
            //         [Op.lte]: filters.BirthdateTo,
            //     };
            // }
            // else if(filters.BirthdateFrom != null && filters.BirthdateTo == null) {
            //     search.where['Person']['BirthDate'] = { 
            //         [Op.gte]: filters.BirthdateFrom,
            //     };
            // }
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
            var orderByColum = 'CreatedAt';
            // if (filters.OrderBy) {
            //     orderByColum = filters.OrderBy;
            // }
            var order = 'ASC';
            if (filters.Order == 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

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
            for(var address of foundResults.rows) {
                var dto = await PatientMapper.toDto(address);
                dtos.push(dto);
            }

            var searchResults: PatientSearchResults = {
                TotalCount: foundResults.count,
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
