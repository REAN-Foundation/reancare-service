import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    PrimaryKey,
    Length,
    IsUUID,
    ForeignKey,
    IsDate
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import User from '../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'WearableDeviceDetails',
    tableName       : 'wearable_device_details',
    paranoid        : true,
    freezeTableName : true
})
export default class WearableDeviceDetails extends Model {

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
    PatientUserId: string;

    @Length({ min: 1, max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : false
    })
    Provider: string;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    TerraUserId: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Scopes: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true
    })
    AuthenticatedAt: Date;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true
    })
    DeauthenticatedAt: Date;
    
    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
