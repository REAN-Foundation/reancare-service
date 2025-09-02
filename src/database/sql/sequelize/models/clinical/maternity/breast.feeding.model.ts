import {
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt, IsUUID, BelongsTo
} from 'sequelize-typescript';
import PostNatalVisit from './postnatal.visit.model';
import { v4 } from 'uuid';
import { BreastfeedingStatus,BreastfeedingStatusList } from '../../../../../../domain.types/clinical/maternity/breastfeeding/breastfeeding.status.type';
import Visit from '../visit.model';

@Table({
    timestamps      : true,
    modelName       : 'Breastfeeding',
    tableName       : 'maternity_breastfeedings',
    paranoid        : true,
    freezeTableName : true,
})
export default class Breastfeeding extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type      : DataType.UUID,
        allowNull : false,
        defaultValue : () => v4()
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => Visit)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    VisitId: string;

    @ForeignKey(() => PostNatalVisit)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PostNatalVisitId: string;

    @BelongsTo(() => PostNatalVisit)
    postNatalVisit: PostNatalVisit;

    @Column({
        type         : DataType.ENUM,
        defaultValue : BreastfeedingStatus.Initiated,
        values       : BreastfeedingStatusList,
    })
    BreastFeedingStatus: string; 

    @Column({
        type      : DataType.STRING,
        allowNull : false,
    })
    BreastfeedingFrequency: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    AdditionalNotes: string;

   
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;
}
