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
    IsUUID,
    BelongsToMany,
    HasMany,
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import SymptomAssessment from './symptom.assessment.model';
import SymptomType from './symptom.type.model';
import SymptomTypesInTemplate from './symptom.types.in.template.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'SymptomAssessmentTemplate',
    tableName       : 'symptom_assessment_templates',
    paranoid        : true,
    freezeTableName : true,
})
export default class SymptomAssessmentTemplate extends Model {

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
        allowNull : false,
    })
    Title: string;
    
    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    Description: string;
    
    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    Tags: string;

    @BelongsToMany(() => SymptomType, () => SymptomTypesInTemplate)
    SymptomTypes: SymptomType[];
    
    @HasMany(() => SymptomAssessment)
    Assessments: SymptomAssessment[];
    
    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
