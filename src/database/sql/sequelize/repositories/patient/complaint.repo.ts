import { IComplaintRepo } from '../../../../repository.interfaces/patient/complaint.repo.interface';
import Complaint from '../../models/patient/complaint.model';
import { Op } from 'sequelize';
import { ComplaintMapper } from '../../mappers/patient/complaint.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { ComplaintDomainModel } from '../../../../../domain.types/patient/complaint/complaint.domain.model';
import { ComplaintDto } from '../../../../../domain.types/patient/complaint/complaint.dto';

///////////////////////////////////////////////////////////////////////

export class ComplaintRepo implements IComplaintRepo {

    create = async (complaintDomainModel: ComplaintDomainModel): Promise<ComplaintDto> => {
        try {
            const entity = {
                PatientUserId             : complaintDomainModel.PatientUserId ?? null,
                MedicalPractitionerUserId : complaintDomainModel.MedicalPractitionerUserId ?? null,
                VisitId                   : complaintDomainModel.VisitId ? complaintDomainModel.VisitId : undefined,
                EhrId                     : complaintDomainModel.EhrId ?? null,
                Complaint                 : complaintDomainModel.Complaint ?? null,
                Severity                  : complaintDomainModel.Severity ?? null,
                RecordDate                : complaintDomainModel.RecordDate ?? null
            };
            const complaint = await Complaint.create(entity);
            const dto = await ComplaintMapper.toDto(complaint);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<ComplaintDto> => {
        try {
            const complaint = await Complaint.findByPk(id);
            const dto = await ComplaintMapper.toDto(complaint);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (id: string): Promise<ComplaintDto[]> => {
        try {
            const search = { where: {} };

            if (id != null) {
                search.where['PatientUserId'] = { [Op.eq]: id };
            }

            const foundResults = await Complaint.findAll(search);

            const dtos: ComplaintDto[] = [];
            for (const complaint of foundResults) {
                const dto = await ComplaintMapper.toDto(complaint);
                dtos.push(dto);
            }

            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, complaintDomainModel: ComplaintDomainModel): Promise<ComplaintDto> => {
        try {
            const complaint = await Complaint.findByPk(id);

            if (complaintDomainModel.PatientUserId != null) {
                complaint.PatientUserId = complaintDomainModel.PatientUserId;
            }
            if (complaintDomainModel.MedicalPractitionerUserId != null) {
                complaint.MedicalPractitionerUserId = complaintDomainModel.MedicalPractitionerUserId;
            }
            if (complaintDomainModel.VisitId != null) {
                complaint.VisitId = complaintDomainModel.VisitId;
            }
            if (complaintDomainModel.EhrId != null) {
                complaint.EhrId = complaintDomainModel.EhrId;
            }
            if (complaintDomainModel.Complaint != null) {
                complaint.Complaint = complaintDomainModel.Complaint;
            }
            if (complaintDomainModel.Severity != null) {
                complaint.Severity = complaintDomainModel.Severity;
            }
            if (complaintDomainModel.RecordDate != null) {
                complaint.RecordDate = complaintDomainModel.RecordDate;
            }
            await complaint.save();

            const dto = await ComplaintMapper.toDto(complaint);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await Complaint.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
