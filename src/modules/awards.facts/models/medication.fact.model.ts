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
    id : string;

    @Column({ type: 'uuid', nullable: false })
    ContextReferenceId : string;

    @Column({ type: 'uuid', nullable: true })
    RecordId : string;

    @Column({ type: 'uuid', nullable: true })
    MedicationId : string;

    @Column({ nullable: true, default: false })
    Taken: boolean;

    @Column({ nullable: true, default: false })
    Missed: boolean;

    @Column({ nullable: true })
    RecrodDate : Date;

    @Column({ nullable: true })
    RecrodDateStr : string;

}
