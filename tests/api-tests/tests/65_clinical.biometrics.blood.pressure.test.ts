import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('65 - Blood pressure tests', function () {
    var agent = request.agent(infra._app);

    it('65:01 -> Create blood pressure', function (done) {
        loadBloodPressureCreateModel();
        const createModel = getTestData('bloodPressureCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/blood-pressures/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setBloodPressureId(response, 'bloodPressureId_1');
                expectBloodPressureProperties(response);

                expectBloodPressurePropertyValues(response);
            })
            .expect(201, done);
    });

    it('65:02 -> Get blood pressure by id', function (done) {
        agent
            .get(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('bloodPressureId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectBloodPressureProperties(response);

                expectBloodPressurePropertyValues(response);
            })
            .expect(200, done);
    });

    it('65:03 -> Search blood pressure records', function (done) {
        loadBloodPressureQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/blood-pressures/search${loadBloodPressureQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.BloodPressureRecords).to.have.property('TotalCount');
                expect(response.body.Data.BloodPressureRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.BloodPressureRecords).to.have.property('PageIndex');
                expect(response.body.Data.BloodPressureRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.BloodPressureRecords).to.have.property('Order');
                expect(response.body.Data.BloodPressureRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.BloodPressureRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.BloodPressureRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('65:04 -> Update blood pressure', function (done) {
        loadBloodPressureUpdateModel();
        const updateModel = getTestData('bloodPressureUpdateModel');
        agent
            .put(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('bloodPressureId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectBloodPressureProperties(response);

                expect(response.body.Data.BloodPressure.Systolic).to.equal(getTestData('bloodPressureUpdateModel').Systolic);
                expect(response.body.Data.BloodPressure.Diastolic).to.equal(
                    getTestData('bloodPressureUpdateModel').Diastolic
                );
                expect(response.body.Data.BloodPressure.Unit).to.equal(getTestData('bloodPressureUpdateModel').Unit);
                expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(
                    getTestData('bloodPressureUpdateModel').RecordedByUserId
                );
            })
            .expect(200, done);
    });

    it('65:05 -> Delete blood pressure', function (done) {
        agent
            .delete(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('bloodPressureId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create blood pressure again', function (done) {
        loadBloodPressureCreateModel();
        const createModel = getTestData('bloodPressureCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/blood-pressures/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setBloodPressureId(response, 'bloodPressureId');
                expectBloodPressureProperties(response);

                expectBloodPressurePropertyValues(response);
            })
            .expect(201, done);
    });

    it('65:06 -> Negative - Create blood pressure', function (done) {
        loadNegativeBloodPressureCreateModel();
        const createModel = getTestData('negativeBloodPressureCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/blood-pressures/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

    it('65:07 -> Negative - Search blood pressure records', function (done) {
        loadBloodPressureQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/blood-pressures/search${loadBloodPressureQueryString()}`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('65:08 -> Negative - Delete blood pressure', function (done) {
        agent
            .delete(`/api/v1/clinical/biometrics/blood-pressures/${getTestData('bloodPressureId_1')}`)
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

function setBloodPressureId(response, key) {
    setTestData(response.body.Data.BloodPressure.id, key);
}

function expectBloodPressureProperties(response) {
    expect(response.body.Data.BloodPressure).to.have.property('PatientUserId');
    expect(response.body.Data.BloodPressure).to.have.property('Systolic');
    expect(response.body.Data.BloodPressure).to.have.property('Diastolic');
    expect(response.body.Data.BloodPressure).to.have.property('Unit');
    expect(response.body.Data.BloodPressure).to.have.property('RecordDate');
    expect(response.body.Data.BloodPressure).to.have.property('RecordedByUserId');
}

function expectBloodPressurePropertyValues(response) {
    expect(response.body.Data.BloodPressure.PatientUserId).to.equal(getTestData('bloodPressureCreateModel').PatientUserId);
    expect(response.body.Data.BloodPressure.Systolic).to.equal(getTestData('bloodPressureCreateModel').Systolic);
    expect(response.body.Data.BloodPressure.Diastolic).to.equal(getTestData('bloodPressureCreateModel').Diastolic);
    expect(response.body.Data.BloodPressure.Unit).to.equal(getTestData('bloodPressureCreateModel').Unit);
    expect(response.body.Data.BloodPressure.RecordedByUserId).to.equal(
        getTestData('bloodPressureCreateModel').RecordedByUserId
    );
}

export const loadBloodPressureCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Systolic: faker.number.int({ min: 100, max: 150 }),
        Diastolic: faker.number.int({ min: 100, max: 150 }),
        Unit: faker.string.symbol(),
        RecordDate: faker.date.anytime(),
        RecordedByUserId: getTestData('patientUserId'),
    };
    setTestData(model, 'bloodPressureCreateModel');
};

export const loadBloodPressureUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Systolic: faker.number.int({ min: 100, max: 150 }),
        Diastolic: faker.number.int({ min: 100, max: 150 }),
        Unit: faker.string.symbol(),
        RecordDate: faker.date.anytime(),
        RecordedByUserId: getTestData('patientUserId'),
    };
    setTestData(model, 'bloodPressureUpdateModel');
};

function loadBloodPressureQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeBloodPressureCreateModel = async () => {
    const model = {
        Unit: faker.string.symbol(),
        RecordDate: faker.date.anytime(),
    };
    setTestData(model, 'negativeBloodPressureCreateModel');
};
