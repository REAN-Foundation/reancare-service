import {
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt, IsUUID,
    BelongsTo,
    HasMany
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import Pregnancy from './pregnancy.model';
import { DeliveryOutcome, DeliveryOutcomeList,  DeliveryMode, DeliveryModeList} from '../../../../../../domain.types/clinical/maternity/delivery/delivery.type';
import PostNatalVisit from './postnatal.visit.model';

@Table({
    timestamps      : true,
    modelName       : 'Delivery',
    tableName       : 'maternity_deliveries',
    paranoid        : true,
    freezeTableName : true,
})
export default class Delivery extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type      : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull : false,
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => Pregnancy)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PregnancyId: string;

    @BelongsTo(() => Pregnancy)
    pregnancy: Pregnancy;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PatientUserId: string;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    DeliveryDate: Date;

    @Column({
        type      : DataType.TIME,
        allowNull : false,
    })
    DeliveryTime: string;

    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    GestationAtBirth: number;

    @Column({
            type         : DataType.ENUM,
            defaultValue : DeliveryMode.Normal,
            values       : DeliveryModeList,
        })
        DeliveryMode: string;

    @Column({
        type      : DataType.STRING,
        allowNull : true,
    })
    DeliveryPlace: string;

    @Column({
        type         : DataType.ENUM,
        defaultValue : DeliveryOutcome.LiveBirth,
        values       : DeliveryOutcomeList,
    })
    DeliveryOutcome: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    DateOfDischarge: Date;

    @Column({
        type      : DataType.STRING,
        allowNull : false,
    })
    OverallDiagnosis: string;

    @HasMany(() => PostNatalVisit)
    PostNatalVisit: PostNatalVisit[];

    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;
}
