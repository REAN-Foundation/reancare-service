import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { ITestRepo } from "../../../database/repository.interfaces/clinical/maternity/test.repo.interface";
import { TestDomainModel } from "../../../domain.types/clinical/maternity/test/test.domain.model";
import { TestDto } from "../../../domain.types/clinical/maternity/test/test.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class TestService {

    constructor(
        @inject('ITestRepo') private _testRepo: ITestRepo,
    ) { }

    create = async (testDomainModel: TestDomainModel): Promise<TestDto> => {
        return await this._testRepo.create(testDomainModel);
    };

    getById = async (testId: uuid): Promise<TestDto> => {
        return await this._testRepo.getById(testId);
    };

    update = async (testId: uuid, testDomainModel: TestDomainModel): Promise<TestDto> => {
        return await this._testRepo.update(testId, testDomainModel);
    };

    delete = async (testId: uuid): Promise<boolean> => {
        return await this._testRepo.delete(testId);
    };

}
