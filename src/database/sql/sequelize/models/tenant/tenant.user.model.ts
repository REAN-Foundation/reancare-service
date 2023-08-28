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
import User from '../users/user/user.model';
import Tenant from './tenant.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'TenantUser',
    tableName       : 'tenant_users',
    paranoid        : true,
    freezeTableName : true,
})
export default class TenantUser extends Model {

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

    @BelongsTo(() => User)
    User: User;

    @IsUUID(4)
    @ForeignKey(() => Tenant)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    TenantId: string;

    @BelongsTo(() => Tenant)
    Tenant: Tenant;

    @Column({
        type         : DataType.BOOLEAN,
        defaultValue : false,
        allowNull    : false,
    })
    Admin: boolean;

    @Column({
        type         : DataType.BOOLEAN,
        defaultValue : false,
        allowNull    : false,
    })
    Moderator: boolean;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
