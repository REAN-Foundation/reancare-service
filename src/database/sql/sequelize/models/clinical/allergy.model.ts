import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    IsUUID,
    PrimaryKey,
    Length,
    IsDate,
    ForeignKey,
} from 'sequelize-typescript';

import { Severity, SeverityList } from '../../../../../domain.types/miscellaneous/system.types';
import { AllergenExposureRoutes, AllergenExposureRoutesList } from '../../../../../domain.types/clinical/allergy/allergy.types';

import { v4 } from 'uuid';
import User from '../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Allergy',
    tableName       : 'patient_allergies',
    paranoid        : true,
    freezeTableName : true,
})
export default class Allergy extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => {
            return v4();
        },
        allowNull : false,
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PatientUserId: string;

    @Length({ min: 2, max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    Allergy: string;

    @Length({ min: 2, max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    AllergenCategory: string;

    @Length({ max: 64 })
    @Column({
        type         : DataType.STRING(64),
        allowNull    : true,
        values       : AllergenExposureRoutesList,
        defaultValue : AllergenExposureRoutes.Unknown
    })
    AllergenExposureRoute: string;

    @Length({ max: 16 })
    @Column({
        type         : DataType.STRING(16),
        allowNull    : false,
        values       : SeverityList,
        defaultValue : Severity.Low
    })
    Severity: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Reaction: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    OtherInformation: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    LastOccurrence: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
