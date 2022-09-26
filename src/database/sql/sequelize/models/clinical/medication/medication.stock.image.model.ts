import {
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsInt, IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import FileResource from '../../general/file.resource/file.resource.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'MedicationStockImage',
    tableName       : 'medication_stock_images',
    paranoid        : true,
    freezeTableName : true,
})
export default class MedicationStockImage extends Model {

    @IsInt
    @PrimaryKey
    @Column({
        type          : DataType.INTEGER,
        autoIncrement : true,
        allowNull     : false,
    })
    id: number;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    Code: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    FileName: string;

    @IsUUID(4)
    @ForeignKey(() => FileResource)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ResourceId: string;

    @Length({ max: 2048 })
    @Column({
        type      : DataType.STRING(2048),
        allowNull : true,
    })
    PublicUrl: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
