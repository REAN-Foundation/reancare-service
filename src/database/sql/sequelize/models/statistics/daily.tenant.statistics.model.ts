import { Column, CreatedAt, DataType, DeletedAt, IsUUID, Model, PrimaryKey, ForeignKey, Table, UpdatedAt, BelongsTo } from 'sequelize-typescript';
import { v4 } from 'uuid';
import FileResource from '../general/file.resource/file.resource.model';
import Tenant from '../tenant/tenant.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'DailyTenantStatistics',
    tableName       : 'daily_tenant_statistics',
    paranoid        : true,
    freezeTableName : true,
})
export default class DailyTenantStatistics extends Model {

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
    })
    TenantId: string;

    @BelongsTo(() => Tenant)
    Tenant: Tenant;

    @IsUUID(4)
    @ForeignKey(() => FileResource)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ResourceId: string;

    @BelongsTo(() => FileResource)
    Resource: FileResource;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    ReportDate: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    ReportTimestamp: Date;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    DashboardStats: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    UserStats: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
