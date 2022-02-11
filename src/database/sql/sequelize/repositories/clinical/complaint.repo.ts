import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { ComplaintDomainModel } from '../../../../../domain.types/clinical/complaint/complaint.domain.model';
import { ComplaintDto } from '../../../../../domain.types/clinical/complaint/complaint.dto';
import { IComplaintRepo } from '../../../../repository.interfaces/clinical/complaint.repo.interface';
import { ComplaintMapper } from '../../mappers/clinical/complaint.mapper';
import Complaint from '../../models/clinical/complaint.model';

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
            return await ComplaintMapper.toDto(complaint);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<ComplaintDto> => {
        try {
            const complaint = await Complaint.findByPk(id);
            return await ComplaintMapper.toDto(complaint);
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

    update = async (id: string, updateModel: ComplaintDomainModel): Promise<ComplaintDto> => {
        try {
            const complaint = await Complaint.findByPk(id);

            if (updateModel.PatientUserId != null) {
                complaint.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.MedicalPractitionerUserId != null) {
                complaint.MedicalPractitionerUserId = updateModel.MedicalPractitionerUserId;
            }
            if (updateModel.VisitId != null) {
                complaint.VisitId = updateModel.VisitId;
            }
            if (updateModel.EhrId != null) {
                complaint.EhrId = updateModel.EhrId;
            }
            if (updateModel.Complaint != null) {
                complaint.Complaint = updateModel.Complaint;
            }
            if (updateModel.Severity != null) {
                complaint.Severity = updateModel.Severity;
            }
            if (updateModel.RecordDate != null) {
                complaint.RecordDate = updateModel.RecordDate;
            }
            await complaint.save();

            return await ComplaintMapper.toDto(complaint);
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
