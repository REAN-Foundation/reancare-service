import {
    Column,
    CreatedAt,
    DataType,
    IsUUID,
    Length,
    Model,
    PrimaryKey,
    Table } from 'sequelize-typescript';
import {
    //MaritalStatusList,
    GenderList,
    Gender } from '../../../domain.types/miscellaneous/system.types';

import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'StaticEHRData',
    tableName       : 'static_ehr_data',
    paranoid        : true,
    freezeTableName : true,
})
export default class StaticEHRData extends Model {

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

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    AppName: string;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PatientUserId: string;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    DoctorPersonId_1: string;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    DoctorPersonId_2: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    ProviderCode: string;

    @Column({
        type         : DataType.ENUM,
        values       : GenderList,
        defaultValue : Gender.Unknown,
        allowNull    : true,
    })
    Gender: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    SelfIdentifiedGender: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    BirthDate: Date;

    @Column({
        type      : DataType.STRING(28),
        allowNull : true,
    })
    Age: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    HealthSystem: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    AssociatedHospital: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Ethnicity: string;

    @Column({
        type         : DataType.STRING(128),
        allowNull    : true,
    })
    Race: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    Nationality: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : true,
    })
    HasHeartAilment: boolean;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : true,
    })
    HasHighCholesterol: boolean;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : true,
    })
    HasHighBloodPressure: boolean;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : true,
    })
    IsDiabetic: boolean;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    MaritalStatus: string;

    @Column({
        type         : DataType.STRING(16),
        allowNull    : true,
    })
    BloodGroup: string;

    @Length({ max: 128 })
    @Column({
        type         : DataType.STRING(128),
        allowNull    : true,
    })
    MajorAilment: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : true,
    })
    IsSmoker: boolean;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Location: string;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    BodyHeight: number;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    OtherConditions: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Occupation: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    RecordDate: Date;

    @Column
    @CreatedAt
    TimeStamp: Date;

}
