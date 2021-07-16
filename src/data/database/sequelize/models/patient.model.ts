import {
    Table,
    Column,
    Model,
    DataType,
    HasOne,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    IsUUID,
    PrimaryKey,
    Length,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';

import { uuid } from 'uuidv4';
import Person from './person.model';
import User from './user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'Patient',
    tableName: 'patients',
    paranoid: true,
    freezeTableName: true,
})
export default class Patient extends Model {
    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: () => {
            return uuid();
        },
        allowNull: false,
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    UserId: string;

    @IsUUID(4)
    @ForeignKey(() => Person)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    PersonId: string;

    @Length({ min: 4, max: 16 })
    @Column({
        type: DataType.STRING(16),
        allowNull: false,
    })
    DisplayId: string;

    // @Length({ min: 4, max: 16})
    @Column({
        type: DataType.STRING(32),
        allowNull: true,
    })
    NationalHealthId: string;

    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    MedicalProfileId: string;

    @Column({
        type: DataType.STRING(256),
        allowNull: true,
    })
    EhrId: string;

    @BelongsTo(() => User)
    User: User;

    @BelongsTo(() => Person)
    Person: Person;

    @Column
    @CreatedAt
    CreateAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;
}
