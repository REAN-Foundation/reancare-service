import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { HealthPriorityType } from '../../../src/domain.types/users/patient/health.priority.type/health.priority.types';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('70 - Health priority tests', function () {
    var agent = request.agent(infra._app);

    it('70:01 -> Create health priority', function (done) {
        loadPriorityCreateModel();
        const createModel = getTestData('priorityCreateModel');
        agent
            .post(`/api/v1/patient-health-priorities/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setHealthPriorityId(response, 'healthPriorityId_1');
                expectHealthPriorityProperties(response);

                expectHealthPriorityPropertyValues(response);
            })
            .expect(201, done);
    });

    it('70:02 -> Get health priorities', function (done) {
        agent
            .get(`/api/v1/patient-health-priorities/for-patient/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('70:03 -> Search health priority records', function (done) {
        loadPriorityQueryString();
        agent
            .get(`/api/v1/patient-health-priorities/search${loadPriorityQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.HealthPriorityRecords).to.have.property('TotalCount');
                expect(response.body.Data.HealthPriorityRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.HealthPriorityRecords).to.have.property('PageIndex');
                expect(response.body.Data.HealthPriorityRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.HealthPriorityRecords).to.have.property('Order');
                expect(response.body.Data.HealthPriorityRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.HealthPriorityRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.HealthPriorityRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('70:04 -> Update health priority', function (done) {
        loadPriorityUpdateModel();
        const updateModel = getTestData('priorityUpdateModel');
        agent
            .put(`/api/v1/patient-health-priorities/${getTestData('healthPriorityId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectHealthPriorityProperties(response);

                expect(response.body.Data.HealthPriority.PatientUserId).to.equal(
                    getTestData('priorityUpdateModel').PatientUserId
                );
                expect(response.body.Data.HealthPriority.Provider).to.equal(getTestData('priorityUpdateModel').Provider);
                expect(response.body.Data.HealthPriority.Source).to.equal(getTestData('priorityUpdateModel').Source);
                expect(response.body.Data.HealthPriority.ProviderCareplanCode).to.equal(
                    getTestData('priorityUpdateModel').ProviderCareplanCode
                );
                expect(response.body.Data.HealthPriority.ProviderCareplanName).to.equal(
                    getTestData('priorityUpdateModel').ProviderCareplanName
                );
                expect(response.body.Data.HealthPriority.HealthPriorityType).to.equal(
                    getTestData('priorityUpdateModel').HealthPriorityType
                );
            })
            .expect(200, done);
    });

    it('70:05 -> Delete health priority', function (done) {
        agent
            .delete(`/api/v1/patient-health-priorities/${getTestData('healthPriorityId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create health priority again', function (done) {
        loadPriorityCreateModel();
        const createModel = getTestData('priorityCreateModel');
        agent
            .post(`/api/v1/patient-health-priorities/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setHealthPriorityId(response, 'healthPriorityId');
                expectHealthPriorityProperties(response);

                expectHealthPriorityPropertyValues(response);
            })
            .expect(201, done);
    });

    it('70:06 -> Negative - Create health priority', function (done) {
        loadNegativePriorityCreateModel();
        const createModel = getTestData('negativePriorityCreateModel');
        agent
            .post(`/api/v1/patient-health-priorities/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('70:07 -> Negative - Search health priority records', function (done) {
        loadPriorityQueryString();
        agent
            .get(`/api/v1/patient-health-priorities/search${loadPriorityQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('70:08 -> Negative - Delete health priority', function (done) {
        agent
            .delete(`/api/v1/patient-health-priorities/${getTestData('healthPriorityId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setHealthPriorityId(response, key) {
    setTestData(response.body.Data.HealthPriority.id, key);
}

function expectHealthPriorityProperties(response) {
    expect(response.body.Data.HealthPriority).to.have.property('PatientUserId');
    expect(response.body.Data.HealthPriority).to.have.property('Provider');
    expect(response.body.Data.HealthPriority).to.have.property('Source');
    expect(response.body.Data.HealthPriority).to.have.property('ProviderEnrollmentId');
    expect(response.body.Data.HealthPriority).to.have.property('ProviderCareplanCode');
    expect(response.body.Data.HealthPriority).to.have.property('ProviderCareplanName');
    expect(response.body.Data.HealthPriority).to.have.property('HealthPriorityType');
    expect(response.body.Data.HealthPriority).to.have.property('IsPrimary');
}

function expectHealthPriorityPropertyValues(response) {
    expect(response.body.Data.HealthPriority.PatientUserId).to.equal(getTestData('priorityCreateModel').PatientUserId);
    expect(response.body.Data.HealthPriority.Provider).to.equal(getTestData('priorityCreateModel').Provider);
    expect(response.body.Data.HealthPriority.Source).to.equal(getTestData('priorityCreateModel').Source);
    expect(response.body.Data.HealthPriority.ProviderCareplanCode).to.equal(
        getTestData('priorityCreateModel').ProviderCareplanCode
    );
    expect(response.body.Data.HealthPriority.ProviderCareplanName).to.equal(
        getTestData('priorityCreateModel').ProviderCareplanName
    );
    expect(response.body.Data.HealthPriority.HealthPriorityType).to.equal(
        getTestData('priorityCreateModel').HealthPriorityType
    );
}

export const loadPriorityCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Provider: faker.lorem.word(),
        Source: faker.lorem.word(),
        ProviderEnrollmentId: faker.number.int(500),
        ProviderCareplanCode: faker.lorem.word(),
        ProviderCareplanName: faker.lorem.word(),
        HealthPriorityType: getRandomEnumValue(HealthPriorityType),
        IsPrimary: faker.datatype.boolean(),
    };
    setTestData(model, 'priorityCreateModel');
};

export const loadPriorityUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Provider: faker.lorem.word(),
        Source: faker.lorem.word(),
        ProviderEnrollmentId: faker.number.int(500),
        ProviderCareplanCode: faker.lorem.word(),
        ProviderCareplanName: faker.lorem.word(),
        HealthPriorityType: getRandomEnumValue(HealthPriorityType),
        IsPrimary: faker.datatype.boolean(),
    };
    setTestData(model, 'priorityUpdateModel');
};

function loadPriorityQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativePriorityCreateModel = async () => {
    const model = {
        ProviderEnrollmentId: faker.number.int(500),
        ProviderCareplanCode: faker.lorem.word(),
        ProviderCareplanName: faker.lorem.word(),
        HealthPriorityType: getRandomEnumValue(HealthPriorityType),
        IsPrimary: faker.datatype.boolean(),
    };
    setTestData(model, 'negativePriorityCreateModel');
};
