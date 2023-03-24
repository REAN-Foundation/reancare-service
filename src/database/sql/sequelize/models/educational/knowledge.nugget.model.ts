import {
    Column, CreatedAt, DataType, DeletedAt,
    IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'KnowledgeNugget',
    tableName       : 'knowledge_nuggets',
    paranoid        : true,
    freezeTableName : true,
})
export default class KnowledgeNugget extends Model {

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
    TopicName: string;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(512),
        allowNull : true,
    })
    BriefInformation: string;

    @Length({ max: 2048 })
    @Column({
        type      : DataType.STRING(2048),
        allowNull : true,
    })
    DetailedInformation: string;

    @Length({ max: 1024 })
    @Column({
        type      : DataType.STRING(1024),
        allowNull : true,
    })
    AdditionalResources: string;

    @Length({ max: 1024 })
    @Column({
        type      : DataType.STRING(1024),
        allowNull : true,
    })
    Tags: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
