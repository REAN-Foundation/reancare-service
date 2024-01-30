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
    modelName       : 'EHRNutritionData',
    tableName       : 'ehr_nutritions_data',
    paranoid        : true,
    freezeTableName : true,
})
export default class EHRNutritionData extends Model {

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

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    NutritionQuestion: string;

    @Column({
        type      : DataType.BOOLEAN,
        allowNull : true,
    })
    NutritionQuestionUserResponse: boolean;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    FruitCups: number;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    SugaryDrinkServings: number;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    VegetableCups: number;

    @Column({
        type      : DataType.BOOLEAN,
        allowNull : true,
    })
    TakenSalt: boolean;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    SeaFoodServings: number;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    GrainServings: number;

    @Column({
        type      : DataType.BOOLEAN,
        allowNull : true,
    })
    TakenProteins: boolean;

    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    ServingUnit: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    AdditionalInfo: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    RecordDate: Date;

    @Column
    @CreatedAt
    TimeStamp: Date;

}
