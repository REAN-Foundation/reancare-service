import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Course module tests', function() {

    var agent = request.agent(infra._app);

    it('104 - Negative - Create course module', function(done) {
        loadCourseModuleCreateModel();
        const createModel = getTestData("CourseModuleCreateModel");
        agent
            .post(`/api/v1/educational/course-modules/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdmiinJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('105 - Negative - Get course module by id', function(done) {
      
        agent
            .get(`/api/v1/educational/course-modules/${getTestData('CourseModule')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(404, done);
    });

    it('106 - Negative - Update course module', function(done) {
        loadCourseModuleUpdateModel();
        const updateModel = getTestData("CourseModuleUpdateModel");
        agent
            .put(`/api/v1/educational/course-modules/${getTestData('CourseModuleId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC3PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });
  
});

///////////////////////////////////////////////////////////////////////////

export const loadCourseModuleCreateModel = async (
) => {
    const model = {
        CourseId       : getTestData("CourseId"),
        Name           : "English",
        Description    : "Learning course",
        ImageUrl       : "https://docs.google.com/spreadsheets/d/1FcQMxJJAIVZtyuAKJHjSgI0qr86GVttGzm65Azzm8XM/edit#gid=0",
        DurationInMins : 90
  
    };
    setTestData(model, "CourseModuleCreateModel");
};

export const loadCourseModuleUpdateModel = async (
) => {
    const model = {
        Name           : "Maths",
        Description    : "Learning course",
        ImageUrl       : "https://docs.google.com/spreadsheets/d/1FcQMxJJAIVZtyuAKJHjSgI0qr86GVttGzm65Azzm8XM/edit#gid=0",
        DurationInMins : 45
    };
    setTestData(model, "CourseModuleUpdateModel");
};
