import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    PrimaryKey,
    IsUUID,
    ForeignKey,
    IsInt,
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import SymptomAssessmentTemplate from './symptom.assessment.template.model';
import SymptomType from './symptom.type.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'SymptomTypesInAssessmentTemplate',
    tableName       : 'symptom_types_in_assessment_templates',
    paranoid        : true,
    freezeTableName : true,
})
export default class SymptomTypesInAssessmentTemplate extends Model {

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
    @ForeignKey(() => SymptomAssessmentTemplate)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    TemplateId: string;
    
    @IsUUID(4)
    @ForeignKey(() => SymptomType)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    SymptomTypeId: string;
    
    @IsInt
    @Column({
        type         : DataType.INTEGER,
        allowNull    : false,
        defaultValue : 0,
    })
    Index: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
