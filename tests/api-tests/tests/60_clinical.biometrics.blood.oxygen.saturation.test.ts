import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('60 - Blood oxygen saturation tests', function () {
    var agent = request.agent(infra._app);

    it('60:01 -> Create blood oxygen saturation', function (done) {
        loadBloodOxygenSaturationCreateModel();
        const createModel = getTestData('bloodOxygenSaturationCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/blood-oxygen-saturations`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setBloodOxygenSaturationId(response, 'bloodOxygenSaturationId_1');
                expectBloodOxygenSaturationProperties(response);

                expectBloodOxygenSaturationPropertyValues(response);
            })
            .expect(201, done);
    });

    it('60:02 -> Get blood oxygen saturation by id', function (done) {
        agent
            .get(`/api/v1/clinical/biometrics/blood-oxygen-saturations/${getTestData('bloodOxygenSaturationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectBloodOxygenSaturationProperties(response);

                expectBloodOxygenSaturationPropertyValues(response);
            })
            .expect(200, done);
    });

    it('60:03 -> Search blood oxygen saturation records', function (done) {
        loadBloodOxygenSaturationQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/blood-oxygen-saturations/search${loadBloodOxygenSaturationQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.BloodOxygenSaturationRecords).to.have.property('TotalCount');
                expect(response.body.Data.BloodOxygenSaturationRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.BloodOxygenSaturationRecords).to.have.property('PageIndex');
                expect(response.body.Data.BloodOxygenSaturationRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.BloodOxygenSaturationRecords).to.have.property('Order');
                expect(response.body.Data.BloodOxygenSaturationRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.BloodOxygenSaturationRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.BloodOxygenSaturationRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('60:04 -> Update blood oxygen saturation', function (done) {
        loadBloodOxygenSaturationUpdateModel();
        const updateModel = getTestData('bloodOxygenSaturationUpdateModel');
        agent
            .put(`/api/v1/clinical/biometrics/blood-oxygen-saturations/${getTestData('bloodOxygenSaturationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectBloodOxygenSaturationProperties(response);

                expect(response.body.Data.BloodOxygenSaturation.BloodOxygenSaturation).to.equal(
                    getTestData('bloodOxygenSaturationUpdateModel').BloodOxygenSaturation
                );
            })
            .expect(200, done);
    });

    it('60:05 -> Delete blood oxygen saturation', function (done) {
        agent
            .delete(`/api/v1/clinical/biometrics/blood-oxygen-saturations/${getTestData('bloodOxygenSaturationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create blood oxygen saturation again', function (done) {
        loadBloodOxygenSaturationCreateModel();
        const createModel = getTestData('bloodOxygenSaturationCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/blood-oxygen-saturations`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setBloodOxygenSaturationId(response, 'bloodOxygenSaturationId');
                expectBloodOxygenSaturationProperties(response);

                expectBloodOxygenSaturationPropertyValues(response);
            })
            .expect(201, done);
    });

    it('60:06 -> Negative - Create blood oxygen saturation', function (done) {
        loadNegativeBloodOxygenSaturationCreateModel();
        const createModel = getTestData('negativeBloodOxygenSaturationCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/blood-oxygen-saturations`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('60:07 -> Negative - Get blood oxygen saturation by id', function (done) {
        agent
            .get(`/api/v1/clinical/biometrics/blood-oxygen-saturations/${getTestData('bloodOxygenSaturationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('60:08 -> Negative - Update blood oxygen saturation', function (done) {
        loadBloodOxygenSaturationUpdateModel();
        const updateModel = getTestData('bloodOxygenSaturationUpdateModel');
        agent
            .put(`/api/v1/clinical/biometrics/blood-oxygen-saturations/${getTestData('bloodOxygenSaturationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setBloodOxygenSaturationId(response, key) {
    setTestData(response.body.Data.BloodOxygenSaturation.id, key);
}

function expectBloodOxygenSaturationProperties(response) {
    expect(response.body.Data.BloodOxygenSaturation).to.have.property('id');
    expect(response.body.Data.BloodOxygenSaturation).to.have.property('PatientUserId');
    expect(response.body.Data.BloodOxygenSaturation).to.have.property('BloodOxygenSaturation');
    expect(response.body.Data.BloodOxygenSaturation).to.have.property('Unit');
    expect(response.body.Data.BloodOxygenSaturation).to.have.property('RecordDate');
    expect(response.body.Data.BloodOxygenSaturation).to.have.property('RecordedByUserId');
}

function expectBloodOxygenSaturationPropertyValues(response) {
    expect(response.body.Data.BloodOxygenSaturation.PatientUserId).to.equal(
        getTestData('bloodOxygenSaturationCreateModel').PatientUserId
    );
    expect(response.body.Data.BloodOxygenSaturation.BloodOxygenSaturation).to.equal(
        getTestData('bloodOxygenSaturationCreateModel').BloodOxygenSaturation
    );
    expect(response.body.Data.BloodOxygenSaturation.Unit).to.equal(getTestData('bloodOxygenSaturationCreateModel').Unit);
    expect(response.body.Data.BloodOxygenSaturation.RecordedByUserId).to.equal(
        getTestData('bloodOxygenSaturationCreateModel').RecordedByUserId
    );
}

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

export const loadBloodOxygenSaturationUpdateModel = async () => {
    const model = {
        BloodOxygenSaturation: faker.number.int({ min: 75, max: 85 }),
        RecordDate: '2021-09-01',
    };
    setTestData(model, 'bloodOxygenSaturationUpdateModel');
};

function loadBloodOxygenSaturationQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeBloodOxygenSaturationCreateModel = async () => {
    const model = {
        BloodOxygenSaturation: faker.number.int(100),
        Unit: faker.string.symbol(),
        RecordDate: faker.date.anytime(),
    };

    setTestData(model, 'negativeBloodOxygenSaturationCreateModel');
};
