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
} from 'sequelize-typescript';

import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Course',
    tableName       : 'educational_courses',
    paranoid        : true,
    freezeTableName : true,
})
export default class Course extends Model {

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
        type      : DataType.STRING(256),
        allowNull : false,
    })
    Name: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Description: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    ImageUrl: string;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    DurationInDays: number;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    StartDate: Date;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    EndDate: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
