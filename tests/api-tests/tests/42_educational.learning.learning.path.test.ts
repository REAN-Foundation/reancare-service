import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('42 - Learning path tests', function () {
    var agent = request.agent(infra._app);

    it('42:01 -> Create learning path', function (done) {
        loadLearningPathCreateModel();
        const createModel = getTestData('learningPathCreateModel');
        agent
            .post(`/api/v1/educational/learning-paths/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setLearningPathId(response, 'learningPathId_1');
                expectLearningPathProperties(response);

                expectLearningPathPropertyValues(response);
            })
            .expect(201, done);
    });

    it('42:02 -> Get learning path by id', function (done) {
        agent
            .get(`/api/v1/educational/learning-paths/${getTestData('learningPathId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectLearningPathProperties(response);

                expectLearningPathPropertyValues(response);
            })
            .expect(200, done);
    });

    it('42:03 -> Search learning path records', function (done) {
        loadLearningPathQueryString();
        agent
            .get(`/api/v1/educational/learning-paths/search${loadLearningPathQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('42:04 -> Update learning path', function (done) {
        loadLearningPathUpdateModel();
        const updateModel = getTestData('learningPathUpdateModel');
        agent
            .put(`/api/v1/educational/learning-paths/${getTestData('learningPathId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectLearningPathProperties(response);

                expect(response.body.Data.LearningPath.Name).to.equal(getTestData('learningPathUpdateModel').Name);
                expect(response.body.Data.LearningPath.Description).to.equal(
                    getTestData('learningPathUpdateModel').Description
                );
                expect(response.body.Data.LearningPath.ImageUrl).to.equal(getTestData('learningPathUpdateModel').ImageUrl);
                expect(response.body.Data.LearningPath.DurationInDays).to.equal(
                    getTestData('learningPathUpdateModel').DurationInDays
                );
                expect(response.body.Data.LearningPath.PreferenceWeight).to.equal(
                    getTestData('learningPathUpdateModel').PreferenceWeight
                );
            })
            .expect(200, done);
    });

    it('42:05 -> Delete learning path', function (done) {
        agent
            .delete(`/api/v1/educational/learning-paths/${getTestData('learningPathId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create learning path again', function (done) {
        loadLearningPathCreateModel();
        const createModel = getTestData('learningPathCreateModel');
        agent
            .post(`/api/v1/educational/learning-paths/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setLearningPathId(response, 'learningPathId');
                expectLearningPathProperties(response);

                expectLearningPathPropertyValues(response);
            })
            .expect(201, done);
    });

    it('42:06 -> Negative - Create learning path', function (done) {
        loadLearningPathCreateModel();
        const createModel = getTestData('learningPathCreateModel');
        agent
            .post(`/api/v1/educational/learning-paths/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('42:07 -> Negative - Search learning path records', function (done) {
        loadNegativeLearningPathQueryString();
        agent
            .get(`/api/v1/educational/learning-paths/search${loadNegativeLearningPathQueryString()}`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('42:08 -> Negative - Delete learning path', function (done) {
        agent
            .delete(`/api/v1/educational/learning-paths/${getTestData('learningPathId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(400, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setLearningPathId(response, key) {
    setTestData(response.body.Data.LearningPath.id, key);
}

function expectLearningPathProperties(response) {
    expect(response.body.Data.LearningPath).to.have.property('id');
    expect(response.body.Data.LearningPath).to.have.property('Name');
    expect(response.body.Data.LearningPath).to.have.property('Description');
    expect(response.body.Data.LearningPath).to.have.property('ImageUrl');
    expect(response.body.Data.LearningPath).to.have.property('DurationInDays');
    expect(response.body.Data.LearningPath).to.have.property('PreferenceWeight');
    expect(response.body.Data.LearningPath).to.have.property('Enabled');
}

function expectLearningPathPropertyValues(response) {
    expect(response.body.Data.LearningPath.Name).to.equal(getTestData('learningPathCreateModel').Name);
    expect(response.body.Data.LearningPath.Description).to.equal(getTestData('learningPathCreateModel').Description);
    expect(response.body.Data.LearningPath.ImageUrl).to.equal(getTestData('learningPathCreateModel').ImageUrl);
    expect(response.body.Data.LearningPath.DurationInDays).to.equal(getTestData('learningPathCreateModel').DurationInDays);
    expect(response.body.Data.LearningPath.PreferenceWeight).to.equal(
        getTestData('learningPathCreateModel').PreferenceWeight
    );
    expect(response.body.Data.LearningPath.Enabled).to.equal(getTestData('learningPathCreateModel').Enabled);
}

export const loadLearningPathCreateModel = async () => {
    const model = {
        TenantId: getTestData('tenantId'),
        Name: faker.lorem.word(),
        Description: faker.word.words(),
        ImageUrl: faker.image.url(),
        DurationInDays: faker.number.int(100),
        PreferenceWeight: faker.number.int(100),
        Enabled: faker.datatype.boolean(),
    };
    setTestData(model, 'learningPathCreateModel');
};

export const loadLearningPathUpdateModel = async () => {
    const model = {
        Name: faker.lorem.word(),
        Description: faker.word.words(),
        ImageUrl: faker.image.url(),
        DurationInDays: faker.number.int(100),
        PreferenceWeight: faker.number.int(100),
        Enabled: faker.datatype.boolean(),
    };
    setTestData(model, 'learningPathUpdateModel');
};

function loadLearningPathQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

function loadNegativeLearningPathQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?name=xyz';
    return queryString;
}
