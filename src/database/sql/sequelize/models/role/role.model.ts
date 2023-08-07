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

    @Length({ min: 1, max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Description: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
