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
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import User from '../../users/user/user.model';
import { 
    NotificationTarget,
    NotificationTargetList,
    NotificationChannel,
    NotificationChannelList,
    NotificationType,
    NotificationTypeList,
} from '../../../../../../domain.types/general/notification/notification.types';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Notification',
    tableName       : 'notifications',
    paranoid        : true,
    freezeTableName : true,
})
export default class Notification extends Model {

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
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    TenantId: string;

    @Column({
        type         : DataType.ENUM,
        values       : NotificationTargetList,
        defaultValue : NotificationTarget.User,
        allowNull    : false,
    })
    Target: string;

    @Column({
        type         : DataType.ENUM,
        values       : NotificationTypeList,
        defaultValue : NotificationType.Info,
        allowNull    : false,
    })
    Type: string;

    @Column({
        type         : DataType.ENUM,
        values       : NotificationChannelList,
        defaultValue : NotificationChannel.MobilePush,
        allowNull    : false,
    })
    Channel: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    Title: string;

    @Column({
        type      : DataType.STRING(1024),
        allowNull : true,
    })
    Body: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    ImageUrl: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Payload: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    SentOn: Date;
    
    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    CreatedByUserId: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
