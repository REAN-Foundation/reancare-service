import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('40 - Course module tests', function() {

    var agent = request.agent(infra._app);

    it('40:01 -> Create course module', function(done) {
        loadCourseModuleCreateModel();
        const createModel = getTestData("CourseModuleCreateModel");
        agent
            .post(`/api/v1/educational/course-modules/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.CourseModule.id, 'CourseModuleId_1');
                expect(response.body.Data.CourseModule).to.have.property('id');
                expect(response.body.Data.CourseModule).to.have.property('CourseId');
                expect(response.body.Data.CourseModule).to.have.property('Name');
                expect(response.body.Data.CourseModule).to.have.property('Description');
                expect(response.body.Data.CourseModule).to.have.property('ImageUrl');
                expect(response.body.Data.CourseModule).to.have.property('DurationInMins');

                setTestData(response.body.Data.CourseModule.id, 'CourseModuleId_1');

                expect(response.body.Data.CourseModule.CourseId).to.equal(getTestData("CourseModuleCreateModel").CourseId);
                expect(response.body.Data.CourseModule.Name).to.equal(getTestData("CourseModuleCreateModel").Name);
                expect(response.body.Data.CourseModule.Description).to.equal(getTestData("CourseModuleCreateModel").Description);
                expect(response.body.Data.CourseModule.ImageUrl).to.equal(getTestData("CourseModuleCreateModel").ImageUrl);
                expect(response.body.Data.CourseModule.DurationInMins).to.equal(getTestData("CourseModuleCreateModel").DurationInMins);

            })
            .expect(201, done);
    });

    it('40:02 -> Get course module by id', function(done) {
      
        agent
            .get(`/api/v1/educational/course-modules/${getTestData('CourseModuleId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.CourseModule).to.have.property('id');
                expect(response.body.Data.CourseModule).to.have.property('CourseId');
                expect(response.body.Data.CourseModule).to.have.property('Name');
                expect(response.body.Data.CourseModule).to.have.property('Description');
                expect(response.body.Data.CourseModule).to.have.property('ImageUrl');
                expect(response.body.Data.CourseModule).to.have.property('DurationInMins');

                expect(response.body.Data.CourseModule.CourseId).to.equal(getTestData("CourseModuleCreateModel").CourseId);
                expect(response.body.Data.CourseModule.Name).to.equal(getTestData("CourseModuleCreateModel").Name);
                expect(response.body.Data.CourseModule.Description).to.equal(getTestData("CourseModuleCreateModel").Description);
                expect(response.body.Data.CourseModule.ImageUrl).to.equal(getTestData("CourseModuleCreateModel").ImageUrl);
                expect(response.body.Data.CourseModule.DurationInMins).to.equal(getTestData("CourseModuleCreateModel").DurationInMins);

            })
            .expect(200, done);
    });

    it('40:03 -> Search course module records', function(done) {
        loadCourseModuleQueryString();
        agent
            .get(`/api/v1/educational/course-modules/search${loadCourseModuleQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.CourseModules).to.have.property('TotalCount');
                expect(response.body.Data.CourseModules).to.have.property('RetrievedCount');
                expect(response.body.Data.CourseModules).to.have.property('PageIndex');
                expect(response.body.Data.CourseModules).to.have.property('ItemsPerPage');
                expect(response.body.Data.CourseModules).to.have.property('Order');
                expect(response.body.Data.CourseModules.TotalCount).to.greaterThan(0);
                expect(response.body.Data.CourseModules.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.CourseModules.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('40:04 -> Update course module', function(done) {
        loadCourseModuleUpdateModel();
        const updateModel = getTestData("CourseModuleUpdateModel");
        agent
            .put(`/api/v1/educational/course-modules/${getTestData('CourseModuleId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.CourseModule).to.have.property('id');
                expect(response.body.Data.CourseModule).to.have.property('CourseId');
                expect(response.body.Data.CourseModule).to.have.property('Name');
                expect(response.body.Data.CourseModule).to.have.property('Description');
                expect(response.body.Data.CourseModule).to.have.property('ImageUrl');
                expect(response.body.Data.CourseModule).to.have.property('DurationInMins');

                expect(response.body.Data.CourseModule.Name).to.equal(getTestData("CourseModuleUpdateModel").Name);
                expect(response.body.Data.CourseModule.Description).to.equal(getTestData("CourseModuleUpdateModel").Description);
                expect(response.body.Data.CourseModule.ImageUrl).to.equal(getTestData("CourseModuleUpdateModel").ImageUrl);
                expect(response.body.Data.CourseModule.DurationInMins).to.equal(getTestData("CourseModuleUpdateModel").DurationInMins);

            })
            .expect(200, done);
    });

    it('40:05 -> Delete course module', function(done) {
        
        agent
            .delete(`/api/v1/educational/course-modules/${getTestData('CourseModuleId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create course module again', function(done) {
        loadCourseModuleCreateModel();
        const createModel = getTestData("CourseModuleCreateModel");
        agent
            .post(`/api/v1/educational/course-modules/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.CourseModule.id, 'CourseModuleId');
                expect(response.body.Data.CourseModule).to.have.property('id');
                expect(response.body.Data.CourseModule).to.have.property('CourseId');
                expect(response.body.Data.CourseModule).to.have.property('Name');
                expect(response.body.Data.CourseModule).to.have.property('Description');
                expect(response.body.Data.CourseModule).to.have.property('ImageUrl');
                expect(response.body.Data.CourseModule).to.have.property('DurationInMins');

                setTestData(response.body.Data.CourseModule.id, 'CourseModuleId');

                expect(response.body.Data.CourseModule.CourseId).to.equal(getTestData("CourseModuleCreateModel").CourseId);
                expect(response.body.Data.CourseModule.Name).to.equal(getTestData("CourseModuleCreateModel").Name);
                expect(response.body.Data.CourseModule.Description).to.equal(getTestData("CourseModuleCreateModel").Description);
                expect(response.body.Data.CourseModule.ImageUrl).to.equal(getTestData("CourseModuleCreateModel").ImageUrl);
                expect(response.body.Data.CourseModule.DurationInMins).to.equal(getTestData("CourseModuleCreateModel").DurationInMins);

            })
            .expect(201, done);
    });

    it('40:06 -> Negative - Create course module', function(done) {
        loadCourseModuleCreateModel();
        const createModel = getTestData("CourseModuleCreateModel");
        agent
            .post(`/api/v1/educational/course-modules/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('40:07 -> Negative - Get course module by id', function(done) {
      
        agent
            .get(`/api/v1/educational/course-modules/${getTestData('CourseModuleId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(400, done);
    });

    it('40:08 -> Negative - Update course module', function(done) {
        loadCourseModuleUpdateModel();
        const updateModel = getTestData("CourseModuleUpdateModel");
        agent
            .put(`/api/v1/educational/course-modules/${getTestData('CourseModuleId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });
  
});

///////////////////////////////////////////////////////////////////////////

export const loadCourseModuleCreateModel = async (
) => {
    const model = {
        CourseId       : getTestData("CourseId"),
        Name           : faker.lorem.word(),
        Description    : faker.word.words(),
        ImageUrl       : faker.image.url(),
        DurationInMins : faker.number.int(100)
  
    };
    setTestData(model, "CourseModuleCreateModel");
};

export const loadCourseModuleUpdateModel = async (
) => {
    const model = {
        Name           : faker.lorem.word(),
        Description    : faker.word.words(),
        ImageUrl       : faker.image.url(),
        DurationInMins : faker.number.int(100)
    };
    setTestData(model, "CourseModuleUpdateModel");
};

function loadCourseModuleQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
