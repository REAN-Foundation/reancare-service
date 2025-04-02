import {
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import PostNatalVisit from './postnatal.visit.model';
import Delivery from './delivery.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'PostnatalMedication',
    tableName       : 'maternity_postnatal_medications',
    paranoid        : true,
    freezeTableName : true,
})
export default class PostnatalMedication extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        allowNull    : false,
        defaultValue : () => v4()
    })
    id:string;

    @IsUUID(4)
    @ForeignKey(() => PostNatalVisit)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PostNatalVisitId: string;

    @IsUUID(4)
    @ForeignKey(() => Delivery)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    DeliveryId: string;

    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    VisitId: string;

    @Column({
        type      : DataType.STRING,
        allowNull : false,
    })
    Name: string;

    @Column({
        type      : DataType.STRING,
        allowNull : false,
    })
    Given: string;

    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    MedicationId: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;
}
