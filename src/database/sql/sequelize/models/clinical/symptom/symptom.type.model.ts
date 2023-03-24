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
    ForeignKey,
    BelongsToMany } from 'sequelize-typescript';

import { v4 } from 'uuid';
import FileResource from '../../general/file.resource/file.resource.model';
import SymptomAssessmentTemplate from './symptom.assessment.template.model';
import SymptomTypesInTemplate from './symptom.types.in.template.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'SymptomType',
    tableName       : 'symptom_types',
    paranoid        : true,
    freezeTableName : true
})
export default class SymptomType extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
    })
    id: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    EhrId: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    Symptom: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Description: string;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(512),
        allowNull : true,
    })
    Tags: string;

    @Length({ max: 8 })
    @Column({
        type         : DataType.STRING(8),
        allowNull    : false,
        defaultValue : 'en-US'
    })
    Language: string;

    @IsUUID(4)
    @ForeignKey(() => FileResource)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ImageResourceId: string;

    @BelongsToMany(() => SymptomAssessmentTemplate, () => SymptomTypesInTemplate)
    Templates: SymptomAssessmentTemplate[];

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
