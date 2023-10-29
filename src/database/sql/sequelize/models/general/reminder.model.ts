import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    DeletedAt,
    ForeignKey,
    IsDate,
    IsUUID,
    IsUrl,
    Length,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import User from '../users/user/user.model';
import {
    NotificationTypeList,
    ReminderTypeList, RepeatAfterEveryUnitList,
} from '../../../../../domain.types/general/reminder/reminder.domain.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Reminder',
    tableName       : 'reminders',
    paranoid        : true,
    freezeTableName : true
})
export default class Reminder extends Model {

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

    @Length({ min: 2, max: 512 })
    @Column({
        type         : DataType.STRING(512),
        allowNull    : false,
        defaultValue : 'Reminder'
    })
    Name: string;

    @Column({
        type      : DataType.ENUM,
        allowNull : true,
        values    : ReminderTypeList,
    })
    ReminderType: string;

    @Length({ min: 1, max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : true,
    })
    WhenDate: string;

    @Length({ min: 1, max: 32 })
    @Column({
        type         : DataType.STRING(32),
        allowNull    : true,
        defaultValue : '00:00'
    })
    WhenTime: string;

    @IsDate
    @Column({
        type         : DataType.DATE,
        allowNull    : false,
        defaultValue : new Date(),
    })
    StartDate: Date;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true
    })
    EndDate: Date;

    @Column({
        type         : DataType.INTEGER,
        allowNull    : false,
        defaultValue : 10,
    })
    EndAfterNRepetitions: number;

    @Column({
        type         : DataType.STRING(2048),
        allowNull    : false,
        defaultValue : '[]',
    })
    RepeatList: string;

    @Column({
        type         : DataType.INTEGER,
        allowNull    : false,
        defaultValue : 1,
    })
    RepeatAfterEvery: number;

    @Column({
        type         : DataType.ENUM,
        allowNull    : false,
        values       : RepeatAfterEveryUnitList,
        defaultValue : 'Day',
    })
    RepeatAfterEveryNUnit: string;

    @Length({ max: 512 })
    @IsUrl
    @Column({
        type      : DataType.STRING(512),
        allowNull : true
    })
    HookUrl: string;

    @Column({
        type         : DataType.ENUM,
        allowNull    : false,
        values       : NotificationTypeList,
        defaultValue : 'SMS',
    })
    NotificationType: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    RawContent: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
