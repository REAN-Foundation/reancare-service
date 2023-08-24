import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Course tests', function() {

    var agent = request.agent(infra._app);

    it('101 - Negative - Create course', function(done) {
        loadCourseCreateModel();
        const createModel = getTestData("CreateModel ");
        agent
            .post(`/api/v1/educational/courses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('102 - Negative - Search course records', function(done) {
        loadCourseQueryString();
        agent
            .get(`/api/v1/educational/courses/search${loadCourseQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminnJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('103 - Negative - Delete course', function(done) {
        
        agent
            .delete(`/api/v1/educational/courses/${getTestData('Course')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
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
