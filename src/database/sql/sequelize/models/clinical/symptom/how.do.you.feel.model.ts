import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    PrimaryKey,
    Length,
    ForeignKey,
    IsUUID,
    IsDate,
} from 'sequelize-typescript';

import {
    SymptomsProgressList,
    SymptomsProgress
} from '../../../../../../domain.types/clinical/symptom/how.do.you.feel/symptom.progress.types';
import { v4 } from 'uuid';
import User from '../../user.model';
import SymptomAssessment from './symptom.assessment.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'HowDoYouFeel',
    tableName       : 'symptom_how_do_you_feel',
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
        allowNull    : false,
        values       : SymptomsProgressList,
        defaultValue : SymptomsProgress.Same
    })
    Feeling: string;
    
    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    RecordDate: string;
    
    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    Comments: string;
    
    @IsUUID(4)
    @ForeignKey(() => SymptomAssessment)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    SymptomAssessmentId: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
