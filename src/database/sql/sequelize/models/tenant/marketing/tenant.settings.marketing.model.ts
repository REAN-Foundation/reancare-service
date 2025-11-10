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
import Tenant from '../tenant.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'TenantSettingsMarketing',
    tableName       : 'tenant_settings_marketing',
    paranoid        : true,
    freezeTableName : true,
})
export default class TenantSettingsMarketing extends Model {

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

    @BelongsTo(() => Tenant)
    Tenant: Tenant;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Styling: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Content: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    QRcode: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Images: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Logos: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : true
    })
    PDFResourceId: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}

