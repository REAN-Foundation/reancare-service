import {
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsDate, IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import {
    DailyAssessmentFeelings, DailyAssessmentFeelingList, DailyAssessmentMoods,
    DailyAssessmentMoodList, DailyAssessmentEnergyLevels, DailyAssessmentEnergyLevelList
} from '../../../../../../domain.types/clinical/daily.assessment/daily.assessment.types';
import User from '../../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'DailyAssessment',
    tableName       : 'daily_assessments',
    paranoid        : true,
    freezeTableName : true,
})
export default class HowDoYouFeel extends Model {

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
        type         : DataType.STRING(128),
        allowNull    : true,
        values       : DailyAssessmentFeelingList,
        defaultValue : DailyAssessmentFeelings.UnSpecified
    })
    Feeling: string;

    @Length({ max: 128 })
    @Column({
        type         : DataType.STRING(128),
        allowNull    : true,
        values       : DailyAssessmentMoodList,
        defaultValue : DailyAssessmentMoods.UnSpecified
    })
    Mood: string;

    @Length({ max: 128 })
    @Column({
        type         : DataType.STRING(128),
        allowNull    : true,
        values       : DailyAssessmentEnergyLevelList,
        defaultValue : `["${DailyAssessmentEnergyLevels.UnSpecified}"]`
    })
    EnergyLevels: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    RecordDate: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
