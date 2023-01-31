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
    BelongsTo,
} from 'sequelize-typescript';
import { DonorAcceptance, DonorAcceptanceList } from '../../../../../../domain.types/miscellaneous/clinical.types';

import { v4 } from 'uuid';
import Person from '../../person/person.model';
import User from '../../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Patient',
    tableName       : 'patients',
    paranoid        : true,
    freezeTableName : true,
})
export default class Patient extends Model {

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
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    UserId: string;

    @IsUUID(4)
    @ForeignKey(() => Person)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PersonId: string;

    @Length({ min: 4, max: 24 })
    @Column({
        type      : DataType.STRING(24),
        allowNull : false,
    })
    DisplayId: string;

    // @Length({ min: 4, max: 16})
    @Column({
        type      : DataType.STRING(32),
        allowNull : true,
    })
    NationalHealthId: string;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    MedicalProfileId: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    EhrId: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    HealthSystem: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    AssociatedHospital: string;

    @Column({
        type         : DataType.ENUM,
        allowNull    : false,
        values       : DonorAcceptanceList,
        defaultValue : DonorAcceptance.NotSend
    })
    DonorAcceptance: string;

    @BelongsTo(() => User)
    User: User;

    @BelongsTo(() => Person)
    Person: Person;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
