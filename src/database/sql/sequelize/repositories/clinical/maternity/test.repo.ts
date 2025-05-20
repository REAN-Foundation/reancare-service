import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { TestDomainModel } from '../../../../../../domain.types/clinical/maternity/test/test.domain.model';
import { TestDto } from '../../../../../../domain.types/clinical/maternity/test/test.dto';
import { ITestRepo } from '../../../../../repository.interfaces/clinical/maternity/test.repo.interface';
import { TestMapper } from '../../../mappers/clinical/maternity/test.mapper';
import TestModel from '../../../models/clinical/maternity/test.model';

///////////////////////////////////////////////////////////////////////

export class TestRepo implements ITestRepo {

    create = async (createModel: TestDomainModel): Promise<TestDto> => {
        try {
            const entity = {
                PregnancyId : createModel.PregnancyId,
                TestName    : createModel.TestName,
                Type        : createModel.Type,
                Impression  : createModel.Impression,
                Parameters  : createModel.Parameters ? JSON.stringify(createModel.Parameters) : null,
                DateOfTest  : createModel.DateOfTest,
            };

            const test = await TestModel.create(entity);
            return TestMapper.toDto(test);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<TestDto> => {
        try {
            const test = await TestModel.findByPk(id);
            return TestMapper.toDto(test);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, updateModel: TestDomainModel): Promise<TestDto> => {
        try {
            const test = await TestModel.findByPk(id);

            if (!test) {
                throw new ApiError(404, "Test record not found.");
            }

            if (updateModel.TestName != null) {
                test.TestName = updateModel.TestName;
            }
            if (updateModel.Type != null) {
                test.Type = updateModel.Type;
            }
            if (updateModel.Impression != null) {
                test.Impression = updateModel.Impression;
            }
            if (updateModel.Parameters != null) {
                test.Parameters = JSON.stringify(updateModel.Parameters);
            }
            if (updateModel.DateOfTest != null) {
                test.DateOfTest = updateModel.DateOfTest;
            }

            await test.save();

            return TestMapper.toDto(test);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await TestModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
