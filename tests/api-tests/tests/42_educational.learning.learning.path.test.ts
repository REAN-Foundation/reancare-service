import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('42 - Laerning path tests', function() {

    var agent = request.agent(infra._app);

    it('42:01 -> Create learning path', function(done) {
        loadLearningPathCreateModel();
        const createModel = getTestData("LearningPathCreateModel");
        agent
            .post(`/api/v1/educational/learning-paths/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.LearningPath.id, 'LearningPathId_1');
                expect(response.body.Data.LearningPath).to.have.property('id');
                expect(response.body.Data.LearningPath).to.have.property('Name');
                expect(response.body.Data.LearningPath).to.have.property('Description');
                expect(response.body.Data.LearningPath).to.have.property('ImageUrl');
                expect(response.body.Data.LearningPath).to.have.property('DurationInDays');
                expect(response.body.Data.LearningPath).to.have.property('PreferenceWeight');
                expect(response.body.Data.LearningPath).to.have.property('Enabled');

                setTestData(response.body.Data.LearningPath.id, 'LearningPathId_1');

                expect(response.body.Data.LearningPath.Name).to.equal(getTestData("LearningPathCreateModel").Name);
                expect(response.body.Data.LearningPath.Description).to.equal(getTestData("LearningPathCreateModel").Description);
                expect(response.body.Data.LearningPath.ImageUrl).to.equal(getTestData("LearningPathCreateModel").ImageUrl);
                expect(response.body.Data.LearningPath.DurationInDays).to.equal(getTestData("LearningPathCreateModel").DurationInDays);
                expect(response.body.Data.LearningPath.PreferenceWeight).to.equal(getTestData("LearningPathCreateModel").PreferenceWeight);
                expect(response.body.Data.LearningPath.Enabled).to.equal(getTestData("LearningPathCreateModel").Enabled);

            })
            .expect(201, done);
    });

    it('42:02 -> Get learning path by id', function(done) {

        agent
            .get(`/api/v1/educational/learning-paths/${getTestData('LearningPathId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.LearningPath).to.have.property('id');
                expect(response.body.Data.LearningPath).to.have.property('Name');
                expect(response.body.Data.LearningPath).to.have.property('Description');
                expect(response.body.Data.LearningPath).to.have.property('ImageUrl');
                expect(response.body.Data.LearningPath).to.have.property('DurationInDays');
                expect(response.body.Data.LearningPath).to.have.property('PreferenceWeight');
                expect(response.body.Data.LearningPath).to.have.property('Enabled');

                expect(response.body.Data.LearningPath.Name).to.equal(getTestData("LearningPathCreateModel").Name);
                expect(response.body.Data.LearningPath.Description).to.equal(getTestData("LearningPathCreateModel").Description);
                expect(response.body.Data.LearningPath.ImageUrl).to.equal(getTestData("LearningPathCreateModel").ImageUrl);
                expect(response.body.Data.LearningPath.DurationInDays).to.equal(getTestData("LearningPathCreateModel").DurationInDays);
                expect(response.body.Data.LearningPath.PreferenceWeight).to.equal(getTestData("LearningPathCreateModel").PreferenceWeight);

            })
            .expect(200, done);
    });

    it('42:03 -> Search learning path records', function(done) {
        loadLearningPathQueryString();
        agent
            .get(`/api/v1/educational/learning-paths/search${loadLearningPathQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('42:04 -> Update learning path', function(done) {
        loadLearningPathUpdateModel();
        const updateModel = getTestData("LearningPathUpdateModel");
        agent
            .put(`/api/v1/educational/learning-paths/${getTestData('LearningPathId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.LearningPath).to.have.property('id');
                expect(response.body.Data.LearningPath).to.have.property('Name');
                expect(response.body.Data.LearningPath).to.have.property('Description');
                expect(response.body.Data.LearningPath).to.have.property('ImageUrl');
                expect(response.body.Data.LearningPath).to.have.property('DurationInDays');
                expect(response.body.Data.LearningPath).to.have.property('PreferenceWeight');
                expect(response.body.Data.LearningPath).to.have.property('Enabled');

                expect(response.body.Data.LearningPath.Name).to.equal(getTestData("LearningPathUpdateModel").Name);
                expect(response.body.Data.LearningPath.Description).to.equal(getTestData("LearningPathUpdateModel").Description);
                expect(response.body.Data.LearningPath.ImageUrl).to.equal(getTestData("LearningPathUpdateModel").ImageUrl);
                expect(response.body.Data.LearningPath.DurationInDays).to.equal(getTestData("LearningPathUpdateModel").DurationInDays);
                expect(response.body.Data.LearningPath.PreferenceWeight).to.equal(getTestData("LearningPathUpdateModel").PreferenceWeight);

            })
            .expect(200, done);
    });

    it('42:05 -> Delete learning path', function(done) {

        agent
            .delete(`/api/v1/educational/learning-paths/${getTestData('LearningPathId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create learning path again', function(done) {
        loadLearningPathCreateModel();
        const createModel = getTestData("LearningPathCreateModel");
        agent
            .post(`/api/v1/educational/learning-paths/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.LearningPath.id, 'LearningPathId');
                expect(response.body.Data.LearningPath).to.have.property('id');
                expect(response.body.Data.LearningPath).to.have.property('Name');
                expect(response.body.Data.LearningPath).to.have.property('Description');
                expect(response.body.Data.LearningPath).to.have.property('ImageUrl');
                expect(response.body.Data.LearningPath).to.have.property('DurationInDays');
                expect(response.body.Data.LearningPath).to.have.property('PreferenceWeight');
                expect(response.body.Data.LearningPath).to.have.property('Enabled');

                setTestData(response.body.Data.LearningPath.id, 'LearningPathId');

                expect(response.body.Data.LearningPath.Name).to.equal(getTestData("LearningPathCreateModel").Name);
                expect(response.body.Data.LearningPath.Description).to.equal(getTestData("LearningPathCreateModel").Description);
                expect(response.body.Data.LearningPath.ImageUrl).to.equal(getTestData("LearningPathCreateModel").ImageUrl);
                expect(response.body.Data.LearningPath.DurationInDays).to.equal(getTestData("LearningPathCreateModel").DurationInDays);
                expect(response.body.Data.LearningPath.PreferenceWeight).to.equal(getTestData("LearningPathCreateModel").PreferenceWeight);
                expect(response.body.Data.LearningPath.Enabled).to.equal(getTestData("LearningPathCreateModel").Enabled);

            })
            .expect(201, done);
    });

    it('42:06 -> Negative - Create learning path', function(done) {
        loadLearningPathCreateModel();
        const createModel = getTestData("LearningPathCreateModel");
        agent
            .post(`/api/v1/educational/learning-paths/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('42:07 -> Negative - Search learning path records', function(done) {
        loadLearningPathQueryString();
        agent
            .get(`/api/v1/educational/learning-paths/search${loadLearningPathQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('42:08 -> Negative - Delete learning path', function(done) {

        agent
            .delete(`/api/v1/educational/learning-paths/${getTestData('LearningPathId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(400, done);
    });
    
});

///////////////////////////////////////////////////////////////////////////

export const loadLearningPathCreateModel = async (
) => {
    const model = {
        Name             : faker.lorem.word(),
        Description      : faker.word.words(),
        ImageUrl         : faker.image.url(),
        DurationInDays   : faker.number.int(100),
        PreferenceWeight : faker.number.int(100),
        Enabled          : faker.datatype.boolean(),
  
    };
    setTestData(model, "LearningPathCreateModel");
};

export const loadLearningPathUpdateModel = async (
) => {
    const model = {
        Name             : faker.lorem.word(),
        Description      : faker.word.words(),
        ImageUrl         : faker.image.url(),
        DurationInDays   : faker.number.int(100),
        PreferenceWeight : faker.number.int(100),
        Enabled          : faker.datatype.boolean(),
    };
    setTestData(model, "LearningPathUpdateModel");
};

function loadLearningPathQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
