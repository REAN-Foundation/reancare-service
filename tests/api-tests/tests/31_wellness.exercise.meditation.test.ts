import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('31 - Meditation tests', function () {
    var agent = request.agent(infra._app);

    it('31:01 -> Create meditation', function (done) {
        loadMeditationCreateModel();
        const createModel = getTestData('meditationCreateModel');
        agent
            .post(`/api/v1/wellness/exercise/meditations/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setMeditationId(response, 'meditationId_1');
                expectMeditationProperties(response);

                expectMeditationPropertyValues(response);
            })
            .expect(201, done);
    });

    it('31:02 -> Get meditation by id', function (done) {
        agent
            .get(`/api/v1/wellness/exercise/meditations/${getTestData('meditationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectMeditationProperties(response);

                expectMeditationPropertyValues(response);
            })
            .expect(200, done);
    });

    it('31:03 -> Search meditation records', function (done) {
        loadMeditationQueryString();
        agent
            .get(`/api/v1/wellness/exercise/meditations/search${loadMeditationQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.MeditationRecords).to.have.property('TotalCount');
                expect(response.body.Data.MeditationRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.MeditationRecords).to.have.property('PageIndex');
                expect(response.body.Data.MeditationRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.MeditationRecords).to.have.property('Order');
                expect(response.body.Data.MeditationRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.MeditationRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.MeditationRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('31:04 -> Update meditation', function (done) {
        loadMeditationUpdateModel();
        const updateModel = getTestData('meditationUpdateModel');
        agent
            .put(`/api/v1/wellness/exercise/meditations/${getTestData('meditationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectMeditationProperties(response);

                expect(response.body.Data.Meditation.PatientUserId).to.equal(
                    getTestData('meditationUpdateModel').PatientUserId
                );
                expect(response.body.Data.Meditation.Meditation).to.equal(getTestData('meditationUpdateModel').Meditation);
                expect(response.body.Data.Meditation.Description).to.equal(getTestData('meditationUpdateModel').Description);
                expect(response.body.Data.Meditation.Category).to.equal(getTestData('meditationUpdateModel').Category);
            })
            .expect(200, done);
    });

    it('31:05 -> Delete meditation', function (done) {
        agent
            .delete(`/api/v1/wellness/exercise/meditations/${getTestData('meditationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create meditation again', function (done) {
        loadMeditationCreateModel();
        const createModel = getTestData('meditationCreateModel');
        agent
            .post(`/api/v1/wellness/exercise/meditations/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setMeditationId(response, 'meditationId');
                expectMeditationProperties(response);

                expectMeditationPropertyValues(response);
            })
            .expect(201, done);
    });

    it('31:06 -> Negative - Create meditation', function (done) {
        loadMeditationCreateModel();
        const createModel = getTestData('Meditationl');
        agent
            .post(`/api/v1/wellness/exercise/meditations/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(500, done);
    });

    it('31:07 -> Negative - Get meditation by id', function (done) {
        agent
            .get(`/api/v1/wellness/exercise/meditations/${getTestData('meditationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('31:08 -> Negative - Update meditation', function (done) {
        loadMeditationUpdateModel();
        const updateModel = getTestData('meditationUpdateModel');
        agent
            .put(`/api/v1/wellness/exercise/meditations/${getTestData('meditationId')}`)
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

function setMeditationId(response, key) {
    setTestData(response.body.Data.Meditation.id, key);
}

function expectMeditationProperties(response) {
    expect(response.body.Data.Meditation).to.have.property('id');
    expect(response.body.Data.Meditation).to.have.property('PatientUserId');
    expect(response.body.Data.Meditation).to.have.property('Meditation');
    expect(response.body.Data.Meditation).to.have.property('Description');
    expect(response.body.Data.Meditation).to.have.property('Category');
    expect(response.body.Data.Meditation).to.have.property('StartTime');
    expect(response.body.Data.Meditation).to.have.property('EndTime');
}

function expectMeditationPropertyValues(response) {
    expect(response.body.Data.Meditation.PatientUserId).to.equal(getTestData('meditationCreateModel').PatientUserId);
    expect(response.body.Data.Meditation.Meditation).to.equal(getTestData('meditationCreateModel').Meditation);
    expect(response.body.Data.Meditation.Description).to.equal(getTestData('meditationCreateModel').Description);
    expect(response.body.Data.Meditation.Category).to.equal(getTestData('meditationCreateModel').Category);
}

export const loadMeditationCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Meditation: faker.lorem.word(),
        Description: faker.word.words(),
        Category: faker.lorem.word(),
        StartTime: startDate,
        EndTime: endDate,
    };
    setTestData(model, 'meditationCreateModel');
};

export const loadMeditationUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Meditation: faker.lorem.word(),
        Description: faker.word.words(),
        Category: faker.lorem.word(),
        StartTime: startDate,
        EndTime: endDate,
    };
    setTestData(model, 'meditationUpdateModel');
};

function loadMeditationQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
