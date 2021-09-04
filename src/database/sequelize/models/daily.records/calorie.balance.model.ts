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
    BelongsTo,
    IsDate,
    IsDecimal } from 'sequelize-typescript';

import { v4 } from 'uuid';
import User from '../user.model';
import Person from '../person.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'CalorieBalance',
    tableName       : 'daily_records_calorie_balance',
    paranoid        : true,
    freezeTableName : true
})
export default class DailyRecordsCalorieBalance extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => Person)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    PersonId: string;

    @BelongsTo(() => Person)
    Person: Person;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    PatientUserId: string;

    @IsDecimal
    @Column({
        type         : DataType.FLOAT,
        allowNull    : false,
        defaultValue : 0,
        validate     : {
            min : 0
        }
    })
    CaloriesConsumed: number;

    @IsDecimal
    @Column({
        type         : DataType.FLOAT,
        allowNull    : false,
        defaultValue : 0,
        validate     : {
            min : 0
        }
    })
    CaloriesBurned: number;

    @Length({ max: 8 })
    @Column({
        type         : DataType.STRING(8),
        allowNull    : false,
        defaultValue : 'kcal'
    })
    Unit: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true
    })
    RecordDate: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
