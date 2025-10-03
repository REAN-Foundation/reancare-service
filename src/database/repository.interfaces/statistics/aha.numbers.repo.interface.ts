import {
    CholesterolEnrollment,
    StrokeEnrollment,
    HealthSystemEnrollment
} from '../../../domain.types/statistics/aha/aha.type';

/////////////////////////////////////////////////////////////////////////////////////////////

export interface AhaNumbersRepoInterface {

    getCholesterolActive(): Promise<CholesterolEnrollment[]>;

    getCholesterolDeleted(): Promise<CholesterolEnrollment[]>;

    getStrokeActive(): Promise<StrokeEnrollment[]>;

    getStrokeDeleted(): Promise<StrokeEnrollment[]>;

    getWellstarCholesterol(): Promise<HealthSystemEnrollment[]>;

    getUCSanDiegoCholesterol(): Promise<HealthSystemEnrollment[]>;

    getMHealthFairviewCholesterol(): Promise<HealthSystemEnrollment[]>;

    getAtriumHealthCholesterol(): Promise<HealthSystemEnrollment[]>;

    getKaiserPermanenteCholesterol(): Promise<HealthSystemEnrollment[]>;

    getNebraskaHealthSystemCholesterol(): Promise<HealthSystemEnrollment[]>;

    getHCAHealthcareCholesterol(): Promise<HealthSystemEnrollment[]>;
}
