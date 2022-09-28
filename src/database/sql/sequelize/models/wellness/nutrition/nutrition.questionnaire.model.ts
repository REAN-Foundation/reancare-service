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
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import FileResource from '../../general/file.resource/file.resource.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'NutritionQuestionnaire',
    tableName       : 'nutrition_questionnaire',
    paranoid        : true,
    freezeTableName : true,
})
export default class NutritionQuestionnaire extends Model {

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

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Question: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    QuestionType: string;

    @Length({ max: 1024 })
    @Column({
        type      : DataType.STRING(1024),
        allowNull : true,
    })
    AssociatedFoodTypes: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Tags: string;

    @Column({
        type      : DataType.STRING(1024),
        allowNull : true,
    })
    ServingUnit: string;

    @IsUUID(4)
    @ForeignKey(() => FileResource)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ImageResourceId: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    QuestionInfo: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
