import {
    Column, CreatedAt, DataType, DeletedAt, IsInt, Length, Model,
    PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'UserTaskCategory',
    tableName       : 'user_task_categories',
    paranoid        : true,
    freezeTableName : true,
})
export default class UserTaskCategory extends Model {

    @IsInt
    @PrimaryKey
    @Column({
        type          : DataType.INTEGER,
        autoIncrement : true,
        allowNull     : false
    })
    id: number;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    Name: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
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
