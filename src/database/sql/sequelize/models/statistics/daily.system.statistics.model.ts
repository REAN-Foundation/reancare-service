import { Column, CreatedAt, DataType, DeletedAt, IsUUID, Model, PrimaryKey, ForeignKey, Table, UpdatedAt, BelongsTo } from 'sequelize-typescript';
import { v4 } from 'uuid';
import FileResource from '../general/file.resource/file.resource.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'DailySystemStatistics',
    tableName       : 'daily_system_statistics',
    paranoid        : true,
    freezeTableName : true,
})
export default class DailySystemStatistics extends Model {

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

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    AHAStats: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
