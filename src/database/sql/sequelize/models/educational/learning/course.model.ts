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
    HasMany,
    IsInt,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import CourseModule from './course.module.model';
import LearningPathCourses from './learning.course.model';

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

    @HasMany(() => LearningPathCourses)
    LearningPathCourses: LearningPathCourses[];

    @HasMany(() => CourseModule)
    CourseModules: CourseModule[];

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
