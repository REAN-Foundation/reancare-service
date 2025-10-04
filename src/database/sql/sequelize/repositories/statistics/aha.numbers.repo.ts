import { AhaNumbersRepoInterface } from '../../../../repository.interfaces/statistics/aha.numbers.repo.interface';
import {
    CholesterolEnrollment,
    StrokeEnrollment,
    HealthSystemEnrollment
} from '../../../../../domain.types/statistics/aha/aha.type';
import { DatabaseClient } from '../../../../../common/database.utils/dialect.clients/database.client';
import { injectable } from 'tsyringe';
import {
    getCholesterolActiveQuery,
    getCholesterolDeletedQuery,
    getStrokeActiveQuery,
    getStrokeDeletedQuery,
    getWellstarCholesterolQuery,
    getUCSanDiegoCholesterolQuery,
    getMHealthFairviewCholesterolQuery,
    getAtriumHealthCholesterolQuery,
    getKaiserPermanenteCholesterolQuery,
    getNebraskaHealthSystemCholesterolQuery,
    getHCAHealthcareCholesterolQuery
} from './aha.numbers.queries';

////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AhaNumbersRepo implements AhaNumbersRepoInterface {

    public dbConnector: DatabaseClient = null;

    constructor() {
        this.dbConnector = new DatabaseClient();
        this.dbConnector._client.connect('Primary');
    }

    public async getCholesterolActive(): Promise<CholesterolEnrollment[]> {
        const sql = getCholesterolActiveQuery(process.env.DB_NAME);
        const [rows] = await this.dbConnector._client.executeQuery(sql);
        return rows as CholesterolEnrollment[];
    }

    public async getCholesterolDeleted(): Promise<CholesterolEnrollment[]> {
        const sql = getCholesterolDeletedQuery(process.env.DB_NAME);
        const [rows] = await this.dbConnector._client.executeQuery(sql);
        return rows as CholesterolEnrollment[];
    }

    public async getStrokeActive(): Promise<StrokeEnrollment[]> {
        const sql = getStrokeActiveQuery(process.env.DB_NAME);
        const [rows] = await this.dbConnector._client.executeQuery(sql);
        return rows as StrokeEnrollment[];
    }

    public async getStrokeDeleted(): Promise<StrokeEnrollment[]> {
        const sql = getStrokeDeletedQuery(process.env.DB_NAME);
        const [rows] = await this.dbConnector._client.executeQuery(sql);
        return rows as StrokeEnrollment[];
    }

    public async getWellstarCholesterol(): Promise<HealthSystemEnrollment[]> {
        const sql = getWellstarCholesterolQuery(process.env.DB_NAME);
        const [rows] = await this.dbConnector._client.executeQuery(sql);
        return rows as HealthSystemEnrollment[];
    }

    public async getUCSanDiegoCholesterol(): Promise<HealthSystemEnrollment[]> {
        const sql = getUCSanDiegoCholesterolQuery(process.env.DB_NAME);
        const [rows] = await this.dbConnector._client.executeQuery(sql);
        return rows as HealthSystemEnrollment[];
    }

    public async getMHealthFairviewCholesterol(): Promise<HealthSystemEnrollment[]> {
        const sql = getMHealthFairviewCholesterolQuery(process.env.DB_NAME);
        const [rows] = await this.dbConnector._client.executeQuery(sql);
        return rows as HealthSystemEnrollment[];
    }

    public async getAtriumHealthCholesterol(): Promise<HealthSystemEnrollment[]> {
        const sql = getAtriumHealthCholesterolQuery(process.env.DB_NAME);
        const [rows] = await this.dbConnector._client.executeQuery(sql);
        return rows as HealthSystemEnrollment[];
    }

    public async getKaiserPermanenteCholesterol(): Promise<HealthSystemEnrollment[]> {
        const sql = getKaiserPermanenteCholesterolQuery(process.env.DB_NAME);
        const [rows] = await this.dbConnector._client.executeQuery(sql);
        return rows as HealthSystemEnrollment[];
    }

    public async getNebraskaHealthSystemCholesterol(): Promise<HealthSystemEnrollment[]> {
        const sql = getNebraskaHealthSystemCholesterolQuery(process.env.DB_NAME);
        const [rows] = await this.dbConnector._client.executeQuery(sql);
        return rows as HealthSystemEnrollment[];
    }

    public async getHCAHealthcareCholesterol(): Promise<HealthSystemEnrollment[]> {
        const sql = getHCAHealthcareCholesterolQuery(process.env.DB_NAME);
        const [rows] = await this.dbConnector._client.executeQuery(sql);
        return rows as HealthSystemEnrollment[];
    }

}
