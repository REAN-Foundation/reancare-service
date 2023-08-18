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
    BelongsTo,
    HasMany,
    IsInt,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import CourseContent from './course.content.model';
import Course from './course.model';
import LearningPath from './learning.path.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'CourseModule',
    tableName       : 'educational_course_modules',
    paranoid        : true,
    freezeTableName : true,
})
export default class CourseModule extends Model {

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
    @ForeignKey(() => Course)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    CourseId: string;
    
    @BelongsTo(() =>  Course)
    Course:  Course;

    @IsUUID(4)
    @ForeignKey(() => LearningPath)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    LearningPathId: string;

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
    DurationInMins: number;

    @IsInt
    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    Sequence: number;

    @HasMany(() => CourseContent)
    CourseContents: CourseContent[];

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
