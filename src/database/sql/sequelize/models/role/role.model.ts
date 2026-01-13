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
    IsInt,
    IsUUID,
    ForeignKey,
    BelongsTo,
    HasOne
} from 'sequelize-typescript';
import Tenant from '../tenant/tenant.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Role',
    tableName       : 'roles',
    paranoid        : true,
    freezeTableName : true
})
export default class Role extends Model {

    @IsInt
    @PrimaryKey
    @Column({
        type          : DataType.INTEGER,
        autoIncrement : true,
        allowNull     : false
    })
    id: number;

    @Length({ min: 1, max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : false
    })
    RoleName: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Description: string;

    @IsUUID(4)
    @ForeignKey(() => Tenant)
    @Column({
        type         : DataType.UUID,
        allowNull    : true,
        defaultValue : null
    })
    TenantId: string;

    @BelongsTo(() => Tenant)
    Tenant: Tenant;

    @IsInt
    @ForeignKey(() => Role)
    @Column({
        type         : DataType.INTEGER,
        allowNull    : true,
        defaultValue : null
    })
    ParentRoleId: number;

    @HasOne(() => Role)
    ParentRole: Role;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    IsSystemRole: boolean;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    IsUserRole: boolean;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    IsDefaultRole: boolean;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
