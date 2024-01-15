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
    Length,
    BelongsTo,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import Tenant from './tenant.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'TenantFeatureSetting',
    tableName       : 'tenant_features_setting',
    paranoid        : true,
    freezeTableName : true,
})
export default class TenantFeatureSetting extends Model {

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
    @ForeignKey(() => Tenant)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
        unique    : true
    })
    TenantId: string;

    @Length({ min: 1, max: 2000 })
    @Column({
        type      : DataType.TEXT,
        allowNull : false,
    })
    Setting: string;

    @BelongsTo(() => Tenant)
    Tenant: Tenant;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
