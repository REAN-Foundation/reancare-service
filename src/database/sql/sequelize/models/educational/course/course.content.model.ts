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
    ForeignKey,

} from 'sequelize-typescript';

import { v4 } from 'uuid';
import CourseModule from './course.module.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'CourseContent',
    tableName       : 'educational_course_contents',
    paranoid        : true,
    freezeTableName : true,
})
export default class CourseContent extends Model {

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
    @ForeignKey(() => CourseModule)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ModuleId: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    Title: string;

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
    DurationInMins: number;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    ContentType: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    ResourceLink: string;

    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    Sequence: number;

@Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
