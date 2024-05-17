import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import {
    Intensity,
    PhysicalActivityCategories,
} from '../../../src/domain.types/wellness/exercise/physical.activity/physical.activity.types';
import { endDate, getRandomEnumValue, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('32 - Physical activity tests', function () {
    var agent = request.agent(infra._app);

    it('32:01 -> Create physical activity', function (done) {
        loadPhysicalActivityCreateModel();
        const createModel = getTestData('physicalActivityCreateModel');
        agent
            .post(`/api/v1/wellness/exercise/physical-activities/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setPhysicalActivityId(response, 'physicalActivityId_1');
                expectPhysicalActivityProperties(response);

                expectPhysicalActivityPropertyValues(response);
            })
            .expect(201, done);
    });

    it('32:02 -> Get physical activity by id', function (done) {
        agent
            .get(`/api/v1/wellness/exercise/physical-activities/${getTestData('physicalActivityId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectPhysicalActivityProperties(response);

                expectPhysicalActivityPropertyValues(response);
            })
            .expect(200, done);
    });

    it('32:03 -> Search physical activity records', function (done) {
        loadPhysicalActivityQueryString();
        agent
            .get(`/api/v1/wellness/exercise/physical-activities/search${loadPhysicalActivityQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.PhysicalActivities).to.have.property('TotalCount');
                expect(response.body.Data.PhysicalActivities).to.have.property('RetrievedCount');
                expect(response.body.Data.PhysicalActivities).to.have.property('PageIndex');
                expect(response.body.Data.PhysicalActivities).to.have.property('ItemsPerPage');
                expect(response.body.Data.PhysicalActivities).to.have.property('Order');
                expect(response.body.Data.PhysicalActivities.TotalCount).to.greaterThan(0);
                expect(response.body.Data.PhysicalActivities.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.PhysicalActivities.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('32:04 -> Update physical activity', function (done) {
        loadPhysicalActivityUpdateModel();
        const updateModel = getTestData('physicalActivityUpdateModel');
        agent
            .put(`/api/v1/wellness/exercise/physical-activities/${getTestData('physicalActivityId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectPhysicalActivityProperties(response);

                expect(response.body.Data.PhysicalActivity.PatientUserId).to.equal(
                    getTestData('physicalActivityUpdateModel').PatientUserId
                );
                expect(response.body.Data.PhysicalActivity.Exercise).to.equal(
                    getTestData('physicalActivityUpdateModel').Exercise
                );
                expect(response.body.Data.PhysicalActivity.Description).to.equal(
                    getTestData('physicalActivityUpdateModel').Description
                );
                expect(response.body.Data.PhysicalActivity.Category).to.equal(
                    getTestData('physicalActivityUpdateModel').Category
                );
                expect(response.body.Data.PhysicalActivity.CaloriesBurned).to.equal(
                    getTestData('physicalActivityUpdateModel').CaloriesBurned
                );
                expect(response.body.Data.PhysicalActivity.Intensity).to.equal(
                    getTestData('physicalActivityUpdateModel').Intensity
                );
                expect(response.body.Data.PhysicalActivity.DurationInMin).to.equal(
                    getTestData('physicalActivityUpdateModel').DurationInMin
                );
            })
            .expect(200, done);
    });

    it('32:05 -> Delete physical activity', function (done) {
        agent
            .delete(`/api/v1/wellness/exercise/physical-activities/${getTestData('physicalActivityId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create physical activity again', function (done) {
        loadPhysicalActivityCreateModel();
        const createModel = getTestData('physicalActivityCreateModel');
        agent
            .post(`/api/v1/wellness/exercise/physical-activities/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setPhysicalActivityId(response, 'physicalActivityId');
                expectPhysicalActivityProperties(response);

                expectPhysicalActivityPropertyValues(response);
            })
            .expect(201, done);
    });

    it('32:06 -> Negative - Create physical activity', function (done) {
        loadPhysicalActivityCreateModel();
        const createModel = getTestData('PhysicalActivity');
        agent
            .post(`/api/v1/wellness/exercise/physical-activities/`)
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

    it('32:07 -> Negative - Search physical activity records', function (done) {
        loadPhysicalActivityQueryString();
        agent
            .get(`/api/v1/wellness/exercise/physical-activities/search${loadPhysicalActivityQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(400, done);
    });

    it('32:08 -> Negative - Delete physical activity', function (done) {
        agent
            .delete(`/api/v1/wellness/exercise/physical-activities/${getTestData('physicalActivityId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setPhysicalActivityId(response, key) {
    setTestData(response.body.Data.PhysicalActivity.id, key);
}

function expectPhysicalActivityProperties(response) {
    expect(response.body.Data.PhysicalActivity).to.have.property('id');
    expect(response.body.Data.PhysicalActivity).to.have.property('PatientUserId');
    expect(response.body.Data.PhysicalActivity).to.have.property('Exercise');
    expect(response.body.Data.PhysicalActivity).to.have.property('Description');
    expect(response.body.Data.PhysicalActivity).to.have.property('Category');
    expect(response.body.Data.PhysicalActivity).to.have.property('CaloriesBurned');
    expect(response.body.Data.PhysicalActivity).to.have.property('Intensity');
    expect(response.body.Data.PhysicalActivity).to.have.property('StartTime');
    expect(response.body.Data.PhysicalActivity).to.have.property('EndTime');
    expect(response.body.Data.PhysicalActivity).to.have.property('DurationInMin');
}

function expectPhysicalActivityPropertyValues(response) {
    expect(response.body.Data.PhysicalActivity.PatientUserId).to.equal(
        getTestData('physicalActivityCreateModel').PatientUserId
    );
    expect(response.body.Data.PhysicalActivity.Exercise).to.equal(getTestData('physicalActivityCreateModel').Exercise);
    expect(response.body.Data.PhysicalActivity.Description).to.equal(getTestData('physicalActivityCreateModel').Description);
    expect(response.body.Data.PhysicalActivity.Category).to.equal(getTestData('physicalActivityCreateModel').Category);
    expect(response.body.Data.PhysicalActivity.CaloriesBurned).to.equal(
        getTestData('physicalActivityCreateModel').CaloriesBurned
    );
    expect(response.body.Data.PhysicalActivity.Intensity).to.equal(getTestData('physicalActivityCreateModel').Intensity);
    expect(response.body.Data.PhysicalActivity.DurationInMin).to.equal(
        getTestData('physicalActivityCreateModel').DurationInMin
    );
}

export const loadPhysicalActivityCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Exercise: faker.lorem.word(),
        Description: faker.word.words(),
        Category: getRandomEnumValue(PhysicalActivityCategories),
        CaloriesBurned: faker.number.int(500),
        Intensity: getRandomEnumValue(Intensity),
        StartTime: startDate,
        EndTime: endDate,
        DurationInMin: faker.number.int(60),
    };
    setTestData(model, 'physicalActivityCreateModel');
};

export const loadPhysicalActivityUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Exercise: faker.lorem.word(),
        Description: faker.word.words(),
        Category: getRandomEnumValue(PhysicalActivityCategories),
        CaloriesBurned: faker.number.int(500),
        Intensity: getRandomEnumValue(Intensity),
        StartTime: startDate,
        EndTime: endDate,
        DurationInMin: faker.number.int(60),
    };
    setTestData(model, 'physicalActivityUpdateModel');
};

function loadPhysicalActivityQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
