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
    IsInt } from 'sequelize-typescript';

import { v4 } from 'uuid';
import User from '../user.model';
import Person from '../person.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'StepCount',
    tableName       : 'daily_records_step_count',
    paranoid        : true,
    freezeTableName : true
})
export default class DailyRecordsStepCount extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
    })
    id: string;

    @BelongsTo(() => Person)
    Person: Person;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    PatientUserId: string;

    @IsInt
    @Column({
        type         : DataType.INTEGER,
        allowNull    : false,
        defaultValue : 0,
        validate     : {
            min : 0
        }
    })
    StepCount: number;

    @Length({ max: 8 })
    @Column({
        type         : DataType.STRING(8),
        allowNull    : false,
        defaultValue : 'steps'
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
