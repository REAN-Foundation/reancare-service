import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Add course - Manav Vikas Ki Avasthaein tests', function() {

    var agent = request.agent(infra._app);

    it('112 - Negative - upload image', function(done) {
        agent
            .post(`/api/v1/file-resources/upload/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(400, done);
    });

    it('113 - Negative - Add course', function(done) {
        loadCourseCreateModel();
        const createModel = getTestData("CourseCreateModel");
        agent
            .post(`/api/v1/educational/courses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminnJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('114 - Negative - Add module', function(done) {
        loadModuleCreateModel();
        const createModel = getTestData("ModuleCreateModel");
        agent
            .post(`/api/v1/educational/course-modules/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93Y0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('115 - Negative - Add content', function(done) {
        loadContentCreateModel();
        const createModel = getTestData("ContentCreateModel");
        agent
            .post(`/api/v1/educational/course-contents/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadCourseCreateModel = async (
) => {
    const model = {
        LearningPathId : getTestData("LearningPathId"),
        Name           : "Manav Vikas Ki Avasthaein",
        ImageUrl       : "https://docs.google.com/spreadsheets/d/1FcQMxJJAIVZtyuAKJHjSgI0qr86GVttGzm65Azzm8XM/edit#gid=0",
  
    };
    setTestData(model, "CourseCreateModel");
};

export const loadModuleCreateModel = async (
) => {
    const model = {
        CourseId       : getTestData("CourseId"),
        LearningPathId : getTestData("LearningPathId"),
        Name           : "Manav Vikas Ki Avasthaein",
        Sequence       : 1,
        DurationInMins : 5.19
    
    };
    setTestData(model, "ModuleCreateModel");
};

export const loadContentCreateModel = async (
) => {
    const model = {
        CourseId       : getTestData("CourseId"),
        LearningPathId : getTestData("LearningPathId"),
        ModuleId       : getTestData("ModuleId"),
        Title          : "Manav Vikas Ki Avasthaein",
        Description    : "Between the moment we are born we pass through diffrent stages of physical, emotional and mental maturity. This module will give you an overview of each of these stages of development.",
        DurationInMins : 5.19,
        ContentType    : "Video",
        ResourceLink   : "https://www.youtube.com/watch?v=aYCBdZLCDBQ&t=194s",
        ImageUrl       : "https://docs.google.com/spreadsheets/d/1FcQMxJJAIVZtyuAKJHjSgI0qr86GVttGzm65Azzm8XM/edit#gid=0",
        Sequence       : '1'
      
    };
    setTestData(model, "ContentCreateModel");
};
