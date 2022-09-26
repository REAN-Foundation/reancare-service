import {
    Column,
    CreatedAt,
    DataType,
    IsUUID,
    Length,
    Model,
    PrimaryKey,
    Table } from 'sequelize-typescript';

import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'EHRRecordSet',
    tableName       : 'ehr_record_sets',
    paranoid        : true,
    freezeTableName : true,
})
export default class EHRRecordSet extends Model {

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
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PatientUserId: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    Type: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Name: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    PrimaryValueString: string;

    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    PrimaryValueInt: number;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    PrimaryValueFloat: number;

    @Column({
        type      : DataType.BOOLEAN,
        allowNull : true,
    })
    PrimaryValueBoolean: boolean;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    PrimaryValueDate: Date;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    PrimaryValueName: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    PrimaryValueDataType: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    PrimaryValueUnit: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    SecondaryValueString: string;

    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    SecondaryValueInt: number;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    SecondaryValueFloat: number;

    @Column({
        type      : DataType.BOOLEAN,
        allowNull : true,
    })
    SecondaryValueBoolean: boolean;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    SecondaryValueName: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    SecondaryValueDataType: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    SecondaryValueUnit: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    RecordDate: Date;

    @Column
    @CreatedAt
    TimeStamp: Date;

}
