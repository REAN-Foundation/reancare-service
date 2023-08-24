import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Course tests', function() {

    var agent = request.agent(infra._app);

    it('184 - Create course', function(done) {
        loadCourseCreateModel();
        const createModel = getTestData("CourseCreateModel");
        agent
            .post(`/api/v1/educational/courses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Course.id, 'CourseId');
                expect(response.body.Data.Course).to.have.property('id');
                expect(response.body.Data.Course).to.have.property('Name');
                expect(response.body.Data.Course).to.have.property('Description');
                expect(response.body.Data.Course).to.have.property('ImageUrl');
                expect(response.body.Data.Course).to.have.property('DurationInDays');

                setTestData(response.body.Data.Course.id, 'CourseId');

                expect(response.body.Data.Course.Name).to.equal(getTestData("CourseCreateModel").Name);
                expect(response.body.Data.Course.Description).to.equal(getTestData("CourseCreateModel").Description);
                expect(response.body.Data.Course.ImageUrl).to.equal(getTestData("CourseCreateModel").ImageUrl);
                expect(response.body.Data.Course.DurationInDays).to.equal(getTestData("CourseCreateModel").DurationInDays);

            })
            .expect(201, done);
    });

    it('185 - Get course by id', function(done) {
    
        agent
            .get(`/api/v1/educational/courses/${getTestData('CourseId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.Course).to.have.property('id');
                expect(response.body.Data.Course).to.have.property('Name');
                expect(response.body.Data.Course).to.have.property('Description');
                expect(response.body.Data.Course).to.have.property('ImageUrl');
                expect(response.body.Data.Course).to.have.property('DurationInDays');

                expect(response.body.Data.Course.Name).to.equal(getTestData("CourseCreateModel").Name);
                expect(response.body.Data.Course.Description).to.equal(getTestData("CourseCreateModel").Description);
                expect(response.body.Data.Course.ImageUrl).to.equal(getTestData("CourseCreateModel").ImageUrl);
                expect(response.body.Data.Course.DurationInDays).to.equal(getTestData("CourseCreateModel").DurationInDays);

            })
            .expect(200, done);
    });

    it('186 - Search course records', function(done) {
        loadCourseQueryString();
        agent
            .get(`/api/v1/educational/courses/search${loadCourseQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.Courses).to.have.property('TotalCount');
                expect(response.body.Data.Courses).to.have.property('RetrievedCount');
                expect(response.body.Data.Courses).to.have.property('PageIndex');
                expect(response.body.Data.Courses).to.have.property('ItemsPerPage');
                expect(response.body.Data.Courses).to.have.property('Order');
                expect(response.body.Data.Courses.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Courses.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Courses.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('187 - Update course', function(done) {
        loadCourseUpdateModel();
        const updateModel = getTestData("CourseUpdateModel");
        agent
            .put(`/api/v1/educational/courses/${getTestData('CourseId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Course).to.have.property('id');
                expect(response.body.Data.Course).to.have.property('Name');
                expect(response.body.Data.Course).to.have.property('Description');
                expect(response.body.Data.Course).to.have.property('ImageUrl');
                expect(response.body.Data.Course).to.have.property('DurationInDays');

                expect(response.body.Data.Course.Name).to.equal(getTestData("CourseUpdateModel").Name);
                expect(response.body.Data.Course.Description).to.equal(getTestData("CourseUpdateModel").Description);
                expect(response.body.Data.Course.ImageUrl).to.equal(getTestData("CourseUpdateModel").ImageUrl);
                expect(response.body.Data.Course.DurationInDays).to.equal(getTestData("CourseUpdateModel").DurationInDays);

            })
            .expect(200, done);
    });

    it('188 - Delete course', function(done) {
        
        agent
            .delete(`/api/v1/educational/courses/${getTestData('CourseId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create course again', function(done) {
        loadCourseCreateModel();
        const createModel = getTestData("CourseCreateModel");
        agent
            .post(`/api/v1/educational/courses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Course.id, 'CourseId');
                expect(response.body.Data.Course).to.have.property('id');
                expect(response.body.Data.Course).to.have.property('Name');
                expect(response.body.Data.Course).to.have.property('Description');
                expect(response.body.Data.Course).to.have.property('ImageUrl');
                expect(response.body.Data.Course).to.have.property('DurationInDays');

                setTestData(response.body.Data.Course.id, 'CourseId');

                expect(response.body.Data.Course.Name).to.equal(getTestData("CourseCreateModel").Name);
                expect(response.body.Data.Course.Description).to.equal(getTestData("CourseCreateModel").Description);
                expect(response.body.Data.Course.ImageUrl).to.equal(getTestData("CourseCreateModel").ImageUrl);
                expect(response.body.Data.Course.DurationInDays).to.equal(getTestData("CourseCreateModel").DurationInDays);

            })
            .expect(201, done);
    });
  
});

///////////////////////////////////////////////////////////////////////////

export const loadCourseCreateModel = async (
) => {
    const model = {
        Name           : "English",
        Description    : "Learning course",
        ImageUrl       : "https://docs.google.com/spreadsheets/d/1FcQMxJJAIVZtyuAKJHjSgI0qr86GVttGzm65Azzm8XM/edit#gid=0",
        DurationInDays : 30,
        StartDate      : "2022-08-11T00:00:00.000Z",
        EndDate        : "2022-09-11T00:00:00.000Z"
  
    };
    setTestData(model, "CourseCreateModel");
};

export const loadCourseUpdateModel = async (
) => {
    const model = {
        Name           : "Maths",
        Description    : "Learning course",
        ImageUrl       : "https://docs.google.com/spreadsheets/d/1FcQMxJJAIVZtyuAKJHjSgI0qr86GVttGzm65Azzm8XM/edit#gid=0",
        DurationInDays : 30,
        StartDate      : "2022-08-11T00:00:00.000Z",
        EndDate        : "2022-09-11T00:00:00.000Z"
    };
    setTestData(model, "CourseUpdateModel");
};

function loadCourseQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?name=English';
    return queryString;
}
