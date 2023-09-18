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
    IsDecimal,
} from 'sequelize-typescript';

import { FoodConsumptionEventList, FoodConsumptionEvents } from '../../../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.types';
import { v4 } from 'uuid';
import FileResource from '../../general/file.resource/file.resource.model';
import User from '../../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'FoodConsumption',
    tableName       : 'nutrition_food_consumption',
    paranoid        : true,
    freezeTableName : true,
})
export default class FoodConsumption extends Model {

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

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    EhrId: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PatientUserId: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    TerraSummaryId: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Provider: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Food: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    FoodTypes: string;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    Servings: number;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    ServingUnit: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Tags: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : true,
    })
    UserResponse: boolean;

    @Length({ max: 1024 })
    @Column({
        type      : DataType.STRING(1024),
        allowNull : true,
    })
    Description: string;

    @Length({ max: 128 })
    @Column({
        type         : DataType.STRING(128),
        allowNull    : true,
        values       : FoodConsumptionEventList,
        defaultValue : FoodConsumptionEvents.Other
    })
    ConsumedAs: string;

    @IsDecimal
    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    Calories: number;

    @IsUUID(4)
    @ForeignKey(() => FileResource)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ImageResourceId: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    StartTime: Date;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    EndTime: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
