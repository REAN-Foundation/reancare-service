import { TestDto } from '../../../../../../domain.types/clinical/maternity/test/test.dto';
import TestModel from '../../../models/clinical/maternity/test.model';

///////////////////////////////////////////////////////////////////////////////////

export class TestMapper {

    static toDto = (test: TestModel): TestDto => {
        if (test == null) {
            return null;
        }
        
        const dto: TestDto = {
            id        : test.id,
            PregnancyId: test.PregnancyId,
            TestName   : test.TestName,
            Type       : test.Type,
            Impression : test.Impression,
            Parameters : test.Parameters ? JSON.parse(test.Parameters) : [],
            DateOfTest : test.DateOfTest,
        };
        return dto;
    };

}
