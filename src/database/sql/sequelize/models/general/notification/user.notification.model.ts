/* eslint-disable @typescript-eslint/no-unused-vars */
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
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import User from '../../users/user/user.model';
import Notification from './notification.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'UserNotification',
    tableName       : 'user_notifications',
    paranoid        : true,
    freezeTableName : true,
})
export default class UserNotification extends Model {

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

    @IsUUID(4)
    @ForeignKey(() => Notification)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    NotificationId: string;

    @BelongsTo(() => Notification)
    Notification: Notification;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    ReadOn: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
