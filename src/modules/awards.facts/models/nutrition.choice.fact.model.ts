import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'nutrition_choice_facts' })
export class NutritionChoiceFact {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'uuid', nullable: false })
    ContextReferenceId : string;

    @Column({ type: 'uuid', nullable: true })
    RecordId : string;

    @Column({ nullable: true, default: false })
    UserResponse: boolean;

    @Column({ nullable: true })
    RecordDate : Date;

    @Column({ nullable: true })
    RecordDateStr : string;

    @Column({
        type     : 'varchar',
        length   : 16,
        nullable : false,
        default  : '+05:30',
    })
    RecordTimeZone: string;

}
