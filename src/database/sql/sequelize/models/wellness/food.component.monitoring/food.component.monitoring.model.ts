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
    ForeignKey,
} from 'sequelize-typescript';
import {
    FoodComponentMonitoringTypes,
    FoodComponentMonitoringTypesList
} from '../../../../../../domain.types/wellness/food.component.monitoring/food.component.monitoring.types';

import { v4 } from 'uuid';
import User from '../../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'FoodComponentMonitoring',
    tableName       : 'food_components_monitoring',
    paranoid        : true,
    freezeTableName : true,
})
export default class FoodComponentMonitoring extends Model {

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

    @Column({
        type         : DataType.ENUM,
        allowNull    : false,
        values       : FoodComponentMonitoringTypesList,
        defaultValue : FoodComponentMonitoringTypes.Other,
    })
    MonitoredFoodComponent: string;

    @Column({
        type      : DataType.FLOAT,
        allowNull : false,
    })
    Amount: number;

    @Column({
        type      : DataType.STRING(256),
        allowNull : false,

    })
    Unit: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
