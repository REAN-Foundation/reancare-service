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
    ReminderTypeList,
    FrequencyTypeList
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

    @Column({
        type      : DataType.ENUM,
        allowNull : true,
        values    : FrequencyTypeList,
    })
    FrequencyType: string;

    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
        defaultValue : 0,
    })
    FrequencyCount: number;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true
    })
    DateAndTime: Date;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : false,
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
        type      : DataType.INTEGER,
        allowNull : false,
        defaultValue : 10,
    })
    EndAfterNRepetitions: number;

    @Column({
        type      : DataType.STRING(1024),
        allowNull : false,
        defaultValue : '[]',
    })
    RepeatList: string;

    @Length({ max: 512 })
    @IsUrl
    @Column({
        type      : DataType.STRING(512),
        allowNull : true
    })
    HookUrl: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
