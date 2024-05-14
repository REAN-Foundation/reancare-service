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
    IsInt,
    ForeignKey,
    BelongsTo,
    Length,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import Role from './role.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'RolePermission',
    tableName       : 'role_permissions',
    paranoid        : true,
    freezeTableName : true
})
export default class RolePermission extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
    })
    id: string;

    @IsInt
    @ForeignKey(() => Role)
    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    RoleId: number;

    @BelongsTo(() => Role)
    Role: Role;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    RoleName: string;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(512),
        allowNull : false,
    })
    Privilege: string;

    @Length({ max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : false,
    })
    Scope: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    Enabled: boolean;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
