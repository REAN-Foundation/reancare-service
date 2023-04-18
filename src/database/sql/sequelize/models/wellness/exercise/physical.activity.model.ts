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
    IsDate,
    IsInt,
    ForeignKey,
    IsDecimal,
} from 'sequelize-typescript';

import {
    PhysicalActivityCategoriesList,
    PhysicalActivityCategories,
    Intensity,
    IntensityList
} from '../../../../../../domain.types/wellness/exercise/physical.activity/physical.activity.types';

import { v4 } from 'uuid';
import FileResource from '../../general/file.resource/file.resource.model';
import User from '../../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'PhysicalActivity',
    tableName       : 'exercise_physical_activities',
    paranoid        : true,
    freezeTableName : true,
})
export default class PhysicalActivity extends Model {

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

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    EhrId: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PatientUserId: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Exercise: string;

    @Length({ max: 1024 })
    @Column({
        type      : DataType.STRING(1024),
        allowNull : true,
    })
    Description: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    TerraSummaryId: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Provider: string;

    @Length({ max: 128 })
    @Column({
        type         : DataType.STRING(128),
        allowNull    : false,
        values       : PhysicalActivityCategoriesList,
        defaultValue : PhysicalActivityCategories.Other
    })
    Category: string;

    @IsDecimal
    @Column({
        type         : DataType.FLOAT,
        allowNull    : true,
        defaultValue : 0
    })
    CaloriesBurned: number;

    @Length({ max: 128 })
    @Column({
        type         : DataType.STRING(128),
        allowNull    : true,
        values       : IntensityList,
        defaultValue : Intensity.Low
    })
    Intensity: string;

    @IsUUID(4)
    @ForeignKey(() => FileResource)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ImageResourceId: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    StartTime: Date;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    EndTime: Date;

    @IsInt
    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    DurationInMin: number;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    PhysicalActivityQuestion: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : true,
        defaultValue : false,
    })
    PhysicalActivityQuestionAns: boolean;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
