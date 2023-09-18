import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'medication_facts' })
export class MedicationFact {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: false })
    ContextReferenceId: string;

    @Column({ type: 'uuid', nullable: true })
    RecordId: string;

    @Column({ type: 'varchar', length: 256, nullable: true })
    DrugName: string;

    @Column({ nullable: true, default: false })
    Taken: boolean;

    @Column({ nullable: true, default: false })
    Missed: boolean;

    @Column({ nullable: true })
    RecordDate: Date;

    @Column({ nullable: true })
    RecordDateStr: string;

    @Column({
        type     : 'varchar',
        length   : 16,
        nullable : false,
        default  : '+05:30',
    })
    RecordTimeZone: string;

}
