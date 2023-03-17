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
import User from '../users/user/user.model';

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
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    UserId: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    BroadcastToAll: boolean;

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
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Type: string;

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
