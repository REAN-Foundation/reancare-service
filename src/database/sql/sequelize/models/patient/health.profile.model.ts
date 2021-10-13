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
import { v4 } from 'uuid';
import User from '../user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'HealthProfile',
    tableName       : 'patient_health_profiles',
    paranoid        : true,
    freezeTableName : true,
})
export default class HealthProfile extends Model {

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

    @Length({ min: 2, max: 16 })
    @Column({
        type      : DataType.STRING(16),
        allowNull : true,
    })
    BloodGroup: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    MajorAilment: string;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(512),
        allowNull : true,
    })
    OtherConditions: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    IsDiabetic: boolean;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    HasHeartAilment: boolean;

    @Column({
        type         : DataType.ENUM,
        values       : ['Single', 'Married', 'Widowed', 'Divorcee', 'Live-in', 'Other', 'Unknown'],
        defaultValue : 'Unknown',
        allowNull    : false,
    })
    MaritalStatus: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Ethnicity: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    Nationality: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    Occupation: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    SedentaryLifestyle: boolean;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    IsSmoker: boolean;

    @Column({
        type         : DataType.ENUM,
        allowNull    : false,
        values       : SeverityList,
        defaultValue : Severity.Low
    })
    SmokingSeverity: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    SmokingSince: Date;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    IsDrinker: boolean;

    @Column({
        type         : DataType.ENUM,
        allowNull    : false,
        values       : SeverityList,
        defaultValue : Severity.Low
    })
    DrinkingSeverity: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    DrinkingSince: Date;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    SubstanceAbuse: boolean;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(512),
        allowNull : true,
    })
    ProcedureHistory: string;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(512),
        allowNull : true,
    })
    ObstetricHistory: string;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(512),
        allowNull : true,
    })
    OtherInformation: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
