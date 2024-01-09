import { Column, CreatedAt, DataType, DeletedAt, IsUUID, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'DailyStatistics',
    tableName       : 'daily_statistics',
    paranoid        : true,
    freezeTableName : true,
})
export default class DailyStatistics extends Model {

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

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    ReportDate: Date;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    ReportTimestamp: Date;

    @Column({
        type      : DataType.STRING(5000),
        allowNull : true,
    })
    Statistics: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
