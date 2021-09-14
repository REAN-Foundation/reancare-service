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
} from 'sequelize-typescript';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Drug',
    tableName       : 'drugs',
    paranoid        : true,
    freezeTableName : true,
})
export default class Drug extends Model {

    @IsInt
    @PrimaryKey
    @Column({
        type          : DataType.INTEGER,
        autoIncrement : true,
        allowNull     : false,
    })
    id: number;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    EhrId: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    DrugName: string; //This is brand-name

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    GenericName: string;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(512),
        allowNull : true,
    })
    Ingredients: string;

    @Length({ max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : true,
    })
    Strength: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    OtherCommercialNames: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Manufacturer: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    OtherInformation: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
