import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { MedicationStockImageDomainModel } from '../../../../../../domain.types/clinical/medication/medication.stock.image/medication.stock.image.domain.model';
import { MedicationStockImageDto } from '../../../../../../domain.types/clinical/medication/medication.stock.image/medication.stock.image.dto';
import { IMedicationStockImageRepo } from '../../../../../repository.interfaces/clinical/medication/medication.stock.image.repo.interface';
import { MedicationStockImageMapper } from '../../../mappers/clinical/medication/medication.stock.image.mapper';
import MedicationStockImage from '../../../models/clinical/medication/medication.stock.image.model';

///////////////////////////////////////////////////////////////////////

export class MedicationStockImageRepo implements IMedicationStockImageRepo {

    create = async (domainModel: MedicationStockImageDomainModel): Promise<MedicationStockImageDto> => {
        try {
            const entity = {
                Code       : domainModel.Code,
                FileName   : domainModel.FileName ?? null,
                ResourceId : domainModel.ResourceId ?? null,
                PublicUrl  : domainModel.PublicUrl ?? null,
            };
            const stockImage = await MedicationStockImage.create(entity);
            const dto = await MedicationStockImageMapper.toDto(stockImage);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: number): Promise<MedicationStockImageDto> => {
        try {
            const stockImage = await MedicationStockImage.findByPk(id);
            const dto = await MedicationStockImageMapper.toDto(stockImage);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByCode = async (code: string): Promise<MedicationStockImageDto> => {
        try {
            const stockImage = await MedicationStockImage.findOne({
                where : {
                    Code : code
                }
            });
            const dto = await MedicationStockImageMapper.toDto(stockImage);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAll = async (): Promise<MedicationStockImageDto[]> => {
        try {

            const foundResults = await MedicationStockImage.findAll();

            const dtos: MedicationStockImageDto[] = [];
            for (const stockImage of foundResults) {
                const dto = await MedicationStockImageMapper.toDto(stockImage);
                dtos.push(dto);
            }

            return dtos;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
