import { TestDomainModel } from "../../../../domain.types/clinical/maternity/test/test.domain.model";
import { TestDto } from "../../../../domain.types/clinical/maternity/test/test.dto";

export interface ITestRepo {
    
    create(testDomainModel: TestDomainModel): Promise<TestDto>;

    getById(testId: string): Promise<TestDto>;

    update(testId: string, testDomainModel: TestDomainModel): Promise<TestDto>;

    delete(testId: string): Promise<boolean>;
}
