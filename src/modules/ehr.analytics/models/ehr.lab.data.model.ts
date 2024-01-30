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
    modelName       : 'EHRLabData',
    tableName       : 'ehr_labs_data',
    paranoid        : true,
    freezeTableName : true,
})
export default class EHRLabData extends Model {

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

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    AppNames: string;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    RecordId: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Provider: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    Type: string;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    TotalCholesterol: number;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    HDL: number;

    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    LDL: number;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    Lipoprotein: number;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    A1CLevel: number;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    TriglycerideLevel: number;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    CholesterolRatio: number;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    Unit: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    AdditionalInfo: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    RecordDate: Date;

    @Column
    @CreatedAt
    TimeStamp: Date;

}
