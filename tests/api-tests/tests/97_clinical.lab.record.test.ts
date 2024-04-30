import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { getRandomEnumValue } from '../utils';
import { LabRecordType } from '../../../src/domain.types/clinical/lab.record/lab.record/lab.record.types';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('97 - Lab record tests', function () {
    var agent = request.agent(infra._app);

    it('97:01 -> Create lab record', function (done) {
        loadLabRecordCreateModel();
        const createModel = getTestData('labRecordCreateModel');
        agent
            .post(`/api/v1/clinical/lab-records/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setLabRecordId(response, 'labRecordId_1');
                expectLabRecordProperties(response);

                expectLabRecordPropertyValues(response);
            })
            .expect(201, done);
    });

    it('97:02 -> Get lab record by id', function (done) {
        agent
            .get(`/api/v1/clinical/lab-records/${getTestData('labRecordId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectLabRecordProperties(response);

                expectLabRecordPropertyValues(response);
            })
            .expect(200, done);
    });

    it('97:03 -> Search records', function (done) {
        loadLabRecordQueryString();
        agent
            .get(`/api/v1/clinical/lab-records/search${loadLabRecordQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.LabRecordRecords).to.have.property('TotalCount');
                expect(response.body.Data.LabRecordRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.LabRecordRecords).to.have.property('PageIndex');
                expect(response.body.Data.LabRecordRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.LabRecordRecords).to.have.property('Order');
                expect(response.body.Data.LabRecordRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.LabRecordRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.LabRecordRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('97:04 -> Update lab record', function (done) {
        loadLabRecordUpdateModel();
        const updateModel = getTestData('labRecordUpdateModel');
        agent
            .put(`/api/v1/clinical/lab-records/${getTestData('labRecordId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectLabRecordProperties(response);

                expect(response.body.Data.LabRecord.PatientUserId).to.equal(
                    getTestData('labRecordUpdateModel').PatientUserId
                );
                expect(response.body.Data.LabRecord.PrimaryValue).to.equal(getTestData('labRecordUpdateModel').PrimaryValue);
                expect(response.body.Data.LabRecord.SecondaryValue).to.equal(
                    getTestData('labRecordUpdateModel').SecondaryValue
                );
                expect(response.body.Data.LabRecord.TypeName).to.equal(getTestData('labRecordUpdateModel').TypeName);
                expect(response.body.Data.LabRecord.DisplayName).to.equal(getTestData('labRecordUpdateModel').DisplayName);
                expect(response.body.Data.LabRecord.Unit).to.equal(getTestData('labRecordUpdateModel').Unit);
                expect(response.body.Data.LabRecord.ReportId).to.equal(getTestData('labRecordUpdateModel').ReportId);
                expect(response.body.Data.LabRecord.OrderId).to.equal(getTestData('labRecordUpdateModel').OrderId);
            })
            .expect(200, done);
    });

    it('97:05 -> Delete lab record', function (done) {
        agent
            .delete(`/api/v1/clinical/lab-records/${getTestData('labRecordId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create lab record again', function (done) {
        loadLabRecordCreateModel();
        const createModel = getTestData('labRecordCreateModel');
        agent
            .post(`/api/v1/clinical/lab-records/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setLabRecordId(response, 'labRecordId');
                expectLabRecordProperties(response);

                expectLabRecordPropertyValues(response);
            })
            .expect(201, done);
    });

    it('97:06 -> Negative - Create lab record', function (done) {
        loadNegativeLabRecordCreateModel();
        const createModel = getTestData('negativeLabRecordCreateModel');
        agent
            .post(`/api/v1/clinical/lab-records/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('97:07 -> Negative - Get lab record by id', function (done) {
        agent
            .get(`/api/v1/clinical/lab-records/${getTestData('labRecordId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('97:08 -> Negative - Update lab record', function (done) {
        loadLabRecordUpdateModel();
        const updateModel = getTestData('labRecordUpdateModel');
        agent
            .put(`/api/v1/clinical/lab-records/${getTestData('labRecordId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setLabRecordId(response, key) {
    setTestData(response.body.Data.LabRecord.id, key);
}

function expectLabRecordProperties(response) {
    expect(response.body.Data.LabRecord).to.have.property('PatientUserId');
    expect(response.body.Data.LabRecord).to.have.property('PrimaryValue');
    expect(response.body.Data.LabRecord).to.have.property('SecondaryValue');
    expect(response.body.Data.LabRecord).to.have.property('TypeName');
    expect(response.body.Data.LabRecord).to.have.property('DisplayName');
    expect(response.body.Data.LabRecord).to.have.property('Unit');
    expect(response.body.Data.LabRecord).to.have.property('ReportId');
    expect(response.body.Data.LabRecord).to.have.property('OrderId');
    expect(response.body.Data.LabRecord).to.have.property('RecordedAt');
}

function expectLabRecordPropertyValues(response) {
    expect(response.body.Data.LabRecord.PatientUserId).to.equal(getTestData('labRecordCreateModel').PatientUserId);
    expect(response.body.Data.LabRecord.PrimaryValue).to.equal(getTestData('labRecordCreateModel').PrimaryValue);
    expect(response.body.Data.LabRecord.SecondaryValue).to.equal(getTestData('labRecordCreateModel').SecondaryValue);
    expect(response.body.Data.LabRecord.TypeName).to.equal(getTestData('labRecordCreateModel').TypeName);
    expect(response.body.Data.LabRecord.DisplayName).to.equal(getTestData('labRecordCreateModel').DisplayName);
    expect(response.body.Data.LabRecord.Unit).to.equal(getTestData('labRecordCreateModel').Unit);
    expect(response.body.Data.LabRecord.ReportId).to.equal(getTestData('labRecordCreateModel').ReportId);
    expect(response.body.Data.LabRecord.OrderId).to.equal(getTestData('labRecordCreateModel').OrderId);
}

export const loadLabRecordCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        PrimaryValue: faker.number.float({ fractionDigits: 1 }),
        SecondaryValue: faker.number.float({ fractionDigits: 1 }),
        TypeName: faker.lorem.words(),
        DisplayName: getRandomEnumValue(LabRecordType),
        Unit: 'cms',
        ReportId: faker.string.uuid(),
        OrderId: faker.string.uuid(),
        RecordedAt: faker.date.past(),
    };
    setTestData(model, 'labRecordCreateModel');
};

export const loadLabRecordUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        PrimaryValue: faker.number.float({ fractionDigits: 1 }),
        SecondaryValue: faker.number.float({ fractionDigits: 1 }),
        TypeName: faker.lorem.words(),
        DisplayName: getRandomEnumValue(LabRecordType),
        Unit: 'cms',
        ReportId: faker.string.uuid(),
        OrderId: faker.string.uuid(),
        RecordedAt: faker.date.past(),
    };
    setTestData(model, 'labRecordUpdateModel');
};

function loadLabRecordQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeLabRecordCreateModel = async () => {
    const model = {
        PostDate: faker.date.anytime(),
        DaysActive: faker.number.int(100),
        IsActive: faker.datatype.boolean(),
        ImageUrl: faker.image.url(),
    };
    setTestData(model, 'negativeLabRecordCreateModel');
};
