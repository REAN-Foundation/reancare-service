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
import Tenant from './tenant.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'TenantSettings',
    tableName       : 'tenant_settings',
    paranoid        : true,
    freezeTableName : true,
})
export default class TenantSettings extends Model {

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
        allowNull : false,
    })
    Common: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : false,
    })
    Followup: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : false,
    })
    ChatBot: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : false,
    })
    Forms: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Consent: string;
    
    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
