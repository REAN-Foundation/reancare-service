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

} from 'sequelize-typescript';
import {
    CourseContentType,
    CourseContentTypeList } from "../../../../../../domain.types/educational/learning/course.content/course.content.type";

import { v4 } from 'uuid';
import Course from './course.model';
import CourseModule from './course.module.model';
import LearningPath from './learning.path.model';

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

    @BelongsTo(() =>  CourseModule)
    CourseModule:  CourseModule;

    @IsUUID(4)
    @ForeignKey(() => Course)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    CourseId: string;

    @BelongsTo(() => Course)
    Course: Course;

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
        type         : DataType.ENUM,
        allowNull    : false,
        defaultValue : CourseContentType.Video,
        values       : CourseContentTypeList,
    })
    ContentType: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    ResourceLink: string;

    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ActionTemplateId: string;

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
