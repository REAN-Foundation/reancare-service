import {
    BelongsTo,
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsDate, IsUUID,
    Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import { UserTaskCategory, UserTaskCategoryList } from '../../../../../../domain.types/users/user.task/user.task.types';
import { UserActionTypeList, UserActionType } from '../../../../../../domain.types/users/user.task/user.task.types';
import User from './user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'CustomTask',
    tableName       : 'custom_tasks',
    paranoid        : true,
    freezeTableName : true,
})
export default class CustomTask extends Model {

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
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    UserId: string;

    @BelongsTo(() => User)
    User: User;

    @Length({ max: 128 })
    @ForeignKey(() => User)
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Task: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Description: string;

    @Length({ max: 128 })
    @Column({
        type         : DataType.STRING(128),
        allowNull    : true,
        values       : UserTaskCategoryList,
        defaultValue : UserTaskCategory.Custom
    })
    Category: string;

    @Length({ max: 64 })
    @Column({
        type         : DataType.STRING(64),
        allowNull    : false,
        defaultValue : UserActionType.Custom,
        values       : UserActionTypeList
    })
    ActionType: string;

    @Column({
        type         : DataType.TEXT,
        allowNull    : false,
        defaultValue : "{}"
    })
    Details: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    ScheduledStartTime: Date;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    ScheduledEndTime: Date;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    Started: boolean;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    StartedAt: Date;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    Finished: boolean;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    FinishedAt: Date;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    Cancelled: boolean;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    CancelledAt: Date;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    CancellationReason: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    IsRecurrent: boolean;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    RecurrenceScheduleId: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
