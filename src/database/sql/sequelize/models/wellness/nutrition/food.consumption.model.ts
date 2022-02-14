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
import FileResource from '../../file.resource/file.resource.model';
import User from '../../user/user.model';

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
        allowNull : false,
    })
    Food: string;

    @Length({ max: 1024 })
    @Column({
        type      : DataType.STRING(1024),
        allowNull : true,
    })
    Description: string;

    @Length({ max: 128 })
    @Column({
        type         : DataType.STRING(128),
        allowNull    : false,
        values       : FoodConsumptionEventList,
        defaultValue : FoodConsumptionEvents.Other
    })
    ConsumedAs: string;

    @IsDecimal
    @Column({
        type         : DataType.FLOAT,
        allowNull    : false,
        defaultValue : 0
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
        allowNull : false,
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
