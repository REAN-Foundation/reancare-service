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
    Length,
    BeforeCreate,
    IsEmail,
    IsDate,
    IsInt
    } from 'sequelize-typescript';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'Role',
    tableName: 'roles',
    paranoid: true,
    freezeTableName: true
})
export class Role extends Model {

    @IsInt
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        allowNull: false
    })
    id: Number;

    @Length({ min: 1, max: 16})
    @Column({
        type: DataType.STRING(16),
        allowNull: false
    })
    RoleName: string;

    @Length({ min: 15, max: 256})
    @Column({
        type: DataType.STRING(256),
        allowNull: true,
    })
    Description: string;
    
    @Column
    @CreatedAt
    CreateAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

};
