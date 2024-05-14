import request from 'supertest';
import { expect, assert } from 'chai';
import Application from '../../../src/app';
import { AssessmentType } from '../../../src/domain.types/clinical/assessment/assessment.types';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, getRandomEnumValue, pastDateString, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('103 - tests', function () {
    var agent = request.agent(infra._app);

    it('103:01 -> Create assessment template test', function (done) {
        loadCustomAssessmentCreateModel();
        const createModel = getTestData('customAssessmentCreateModel');
        agent
            .post(`/api/v1/clinical/assessment-templates`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('Create assessment template test', function (done) {
        loadCustomAssessmentCreateModel();
        const createModel = getTestData('customAssessmentCreateModel');
        agent
            .post(`/api/v1/clinical/assessment-templates`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.AssessmentTemplate.id, 'assessmentTemplateTestId');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('103:02 -> Create assessment', function (done) {
        loadAssessmentCreateModel();
        const createModel = getTestData('assessmentCreateModel');
        agent
            .post(`/api/v1/clinical/assessments/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('103:03 -> Create blood oxygen saturation test', function (done) {
        loadBloodOxygenSaturationCreateModel();
        const createModel = getTestData('bloodOxygenSaturationCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/blood-oxygen-saturations`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('103:04 -> Create body weight', function (done) {
        loadBodyWeightCreateModel();
        const createModel = getTestData('bodyWeightCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/body-weights`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('103:05 -> Create blood glucose', function (done) {
        loadBloodGlucoseCreateModel();
        const createModel = getTestData('bloodGlucoseCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/blood-glucose`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });
});

///////////////////////////////////////////////////////////////////////////

export const loadCustomAssessmentCreateModel = async () => {
    const model = {
        TenantId: getTestData('tenantId'),
        Title: faker.lorem.word(5),
        Description: faker.lorem.word(15),
        Type: getRandomEnumValue(AssessmentType),
        Provider: faker.lorem.word(),
        ProviderAssessmentCode: faker.lorem.word(),
    };
    setTestData(model, 'customAssessmentCreateModel');
};

export const loadAssessmentCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Title: faker.lorem.word(5),
        AssessmentTemplateId: getTestData('assessmentTemplateTestId'),
        ScheduledDate: faker.date.future(),
    };
    setTestData(model, 'assessmentCreateModel');
};

export const loadBloodOxygenSaturationCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        BloodOxygenSaturation: faker.number.int({ min: 75, max: 85 }),
        Unit: '%',
        RecordDate: '2021-09-01',
        RecordedByUserId: getTestData('patientUserId'),
    };
    setTestData(model, 'bloodOxygenSaturationCreateModel');
};

export const loadBodyWeightCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        BodyWeight: faker.number.int(200),
        Unit: faker.string.symbol(),
    };
    setTestData(model, 'bodyWeightCreateModel');
};

export const loadBloodGlucoseCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Unit: 'mg|dL',
        BloodGlucose: faker.number.int({ min: 103, max: 105 }),
        RecordDate: pastDateString,
        RecordedByUserId: getTestData('patientUserId'),
    };
    setTestData(model, 'bloodGlucoseCreateModel');
};
