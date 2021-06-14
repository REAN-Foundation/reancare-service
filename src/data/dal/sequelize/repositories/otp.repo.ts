

import { OtpMapper } from '../mappers/otp.mapper';
import { Logger } from "../../../../common/logger";
import { ApiError } from "../../../../common/api.error";
import { RoleRepo } from "./role.repo";
import { IOtpRepo } from "../../../repository.interfaces/otp.repo.interface";
import { OtpDTO, OtpPersistenceEntity } from "../../../domain.types/otp.domain.types";
import { Otp } from "../models/otp.model";
import { Op, Sequelize } from 'sequelize/types';

///////////////////////////////////////////////////////////////////////

export class OtpRepo implements IOtpRepo {
    create = async (entity: OtpPersistenceEntity): Promise<OtpDTO> => {
        try {
            var otp = await Otp.create(entity);
            var dto = await OtpMapper.toDTO(otp);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getLatestByUserId = async (userId: string): Promise<OtpDTO> => {
        try {
            var otps = await Otp.findAll({
                where: {
                    UserId: userId,
                    ValidTo: { [Op.lte]: new Date() },
                    Utilized: false,
                },
                order: Sequelize.literal('max(ValidTo) DESC'),
            });
            if (otps.length > 0) {
                var otp = otps[0];
                var dto = await OtpMapper.toDTO(otp);
                return dto;
            }
            return null;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByOtpAndUserId = async (userId: string, otp: string): Promise<OtpDTO> => {
        try {
            return await Otp.findOne({
                where: {
                    UserId: userId,
                    Otp: otp,
                    Utilized: false,
                },
            });
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    markAsUtilized = async (id: string): Promise<OtpDTO> => {
        try {
            var otp = await Otp.findByPk(id);
            otp.Utilized = true;
            await otp.save();
            var dto = await OtpMapper.toDTO(otp);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };
}
