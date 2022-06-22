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

import { v4 } from 'uuid';
import User from '../../user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'FoodComponent',
    tableName       : 'food_components',
    paranoid        : true,
    freezeTableName : true,
})
export default class FoodComponent extends Model {

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
        type      : DataType.STRING(256),
        allowNull : false,
    })
    TypeOfFood: string;

    @Column({
        type      : DataType.FLOAT,
        allowNull : false,
    })
    Amount: number;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
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
