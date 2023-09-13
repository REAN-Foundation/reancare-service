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
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import User from './user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'UserDeviceDetails',
    tableName       : 'user_device_details',
    paranoid        : true,
    freezeTableName : true,
})
export default class UserDeviceDetails extends Model {

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

    @Length({ max: 1024 })
    @Column({
        type      : DataType.STRING(1024),
        allowNull : false,
    })
    Token: string;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(512),
        allowNull : false,
    })
    DeviceName: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    OSType: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : false,
    })
    OSVersion: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    AppName: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : false,
    })
    AppVersion: string;

    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    ChangeCount: number;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
