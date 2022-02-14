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
import FileResource from '../../file.resource/file.resource.model';
import User from '../../user/user.model';

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
        allowNull : false,
    })
    Exercise: string;

    @Length({ max: 1024 })
    @Column({
        type      : DataType.STRING(1024),
        allowNull : false,
    })
    Description: string;

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
        allowNull    : false,
        defaultValue : 0
    })
    CaloriesBurned: number;

    @Length({ max: 128 })
    @Column({
        type         : DataType.STRING(128),
        allowNull    : false,
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
        allowNull : false,
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
        allowNull : false,
    })
    DurationInMin: number;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
