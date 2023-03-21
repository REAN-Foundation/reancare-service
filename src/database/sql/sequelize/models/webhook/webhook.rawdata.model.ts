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
    IsInt
} from 'sequelize-typescript';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'WebhookRawData',
    tableName       : 'webhook_rawdata',
    paranoid        : true,
    freezeTableName : true
})
export default class WebhookRawData extends Model {

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
    Provider: string;

    @Column({
        type      : DataType.STRING(16),
        allowNull : true,
    })
    Type: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    RawData: string;
    
    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
