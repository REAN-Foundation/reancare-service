
import { OtpMapper } from '../../../mappers/users/user/otp.mapper';
import { Logger } from "../../../../../../common/logger";
import { ApiError } from "../../../../../../common/api.error";
import { IOtpRepo } from "../../../../../repository.interfaces/users/user/otp.repo.interface";
import { OtpPersistenceEntity } from "../../../../../../domain.types/users/otp/otp.domain.types";
import Otp from "../../../models/users/user/otp.model";
import { Op, Sequelize } from 'sequelize';
import { OtpDto } from '../../../../../../domain.types/users/otp/otp.dto';

///////////////////////////////////////////////////////////////////////

export class OtpRepo implements IOtpRepo {

    create = async (entity: OtpPersistenceEntity): Promise<OtpDto> => {
        try {
            const otp = await Otp.create(entity as any);
            const dto = await OtpMapper.toDto(otp);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getLatestByUserId = async (userId: string): Promise<OtpDto> => {
        try {
            const otps = await Otp.findAll({
                where : {
                    UserId    : userId,
                    ValidTill : { [Op.lte]: new Date() },
                    Utilized  : false,
                },
                order : Sequelize.literal('max(ValidTill) DESC'),
            });
            if (otps.length > 0) {
                const otp = otps[0];
                const dto = await OtpMapper.toDto(otp);
                return dto;
            }
            return null;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByOtpAndUserId = async (userId: string, otp: string): Promise<OtpDto> => {
        try {
            return await Otp.findOne({
                where : {
                    UserId   : userId,
                    Otp      : otp,
                    Utilized : false,
                },
            });
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    markAsUtilized = async (id: string): Promise<OtpDto> => {
        try {
            const otp = await Otp.findByPk(id);
            otp.Utilized = true;
            await otp.save();
            const dto = await OtpMapper.toDto(otp);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
