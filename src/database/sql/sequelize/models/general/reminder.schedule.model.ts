import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    DeletedAt,
    ForeignKey,
    IsDate,
    IsUUID,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import User from '../users/user/user.model';
import Reminder from './reminder.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'ReminderSchedule',
    tableName       : 'reminder_schedules',
    paranoid        : false,
    freezeTableName : true
})
export default class ReminderSchedule extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    UserId: string;

    @BelongsTo(() => User)
    User: User;

    @IsUUID(4)
    @ForeignKey(() => Reminder)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ReminderId: string;

    @BelongsTo(() => Reminder)
    Reminder: Reminder;

    @IsDate
    @Column({
        type         : DataType.DATE,
        allowNull    : false,
        defaultValue : new Date(),
    })
    Schedule: Date;

    @Column({
        type         : DataType.INTEGER,
        allowNull    : false,
        defaultValue : 0,
    })
    DeliveryAttemptCount: number;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    IsDelivered: boolean;

    @Column({
        type         : DataType.DATE,
        allowNull    : true,
        defaultValue : null,
    })
    DeliveredAt: Date;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    IsAcknowledged: boolean;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
