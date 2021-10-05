import {
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsDate, IsUUID,
    Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';

// eslint-disable-next-line max-len
// import { UserActionStatusTypes, UserActionStatusTypesList } from '../../../../../domain.types/user/user.task/user.action.types';
import User from './user.model';

// import UserTaskCategory from './user.task.category.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'UserTask',
    tableName       : 'user_tasks',
    paranoid        : true,
    freezeTableName : true,
})
export default class UserTask extends Model {

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
    DisplayId: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    UserId: string;

    @Length({ max: 128 })
    @ForeignKey(() => User)
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    TaskName: string;

    // @ForeignKey(() => UserTaskCategory)
    // @Column({
    //     type      : DataType.INTEGER,
    //     allowNull : false,
    // })
    // CategoryId: number;

    // @Length({ max: 128 })
    // @Column({
    //     type      : DataType.STRING(128),
    //     allowNull : false,
    // })
    // ActionType: string;

    // @IsUUID(4)
    // @Column({
    //     type      : DataType.UUID,
    //     allowNull : true,
    // })
    // ActionItemId: string;

    // @Length({ max: 128 })
    // @Column({
    //     type      : DataType.STRING(128),
    //     allowNull : false,
    // })
    // ActionDetails: string;

    // @Length({ max: 32 })
    // @Column({
    //     type         : DataType.ENUM,
    //     values       : UserActionStatusTypesList,
    //     defaultValue : UserActionStatusTypes.Unknown,
    //     allowNull    : false,

    // })
    // ActionState: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    ScheduledStartTime: Date

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    ScheduledEndTime: Date

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
    StartedAt: Date

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
    FinishedAt: Date

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    TaskIsSuccess: boolean;

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
    CancelledAt: Date

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
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
