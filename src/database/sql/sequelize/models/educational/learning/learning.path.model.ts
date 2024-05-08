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
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import  LearningPathCourses from './learning.path.course.model';
import Tenant from '../../tenant/tenant.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'LearningPath',
    tableName       : 'educational_learning_paths',
    paranoid        : true,
    freezeTableName : true,
})
export default class LearningPath extends Model {

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
    @ForeignKey(() => Tenant)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    TenantId: string;

    @BelongsTo(() =>  Tenant)
    Tenant:  Tenant;
        
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
        type      : DataType.FLOAT,
        allowNull : true,
    })
    PreferenceWeight: number;

    @Column({
        type      : DataType.BOOLEAN,
        allowNull : true,
    })
    Enabled: boolean;

    @HasMany(() =>  LearningPathCourses)
    LearningPathCourses:   LearningPathCourses[];

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
