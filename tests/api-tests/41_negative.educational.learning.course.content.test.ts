import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Course content tests', function() {

    var agent = request.agent(infra._app);

    it('107 - Negative - Create course content', function(done) {
        loadCourseContentCreateModel();
        const createModel = getTestData("");
        agent
            .post(`/api/v1/educational/course-contents/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYEJB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('108 - Negative - Search course content records', function(done) {
        loadCourseContentQueryString();
        agent
            .get(`/api/v1/educational/course-contents/search${loadCourseContentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('109 - Negative - Delete course content', function(done) {

        agent
            .delete(`/api/v1/educational/course-contents/${getTestData('CourseContent')}`)
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

export const loadCourseContentCreateModel = async (
) => {
    const model = {
        ModuleId       : getTestData("CourseModuleId"),
        Title          : "English Grammer",
        Description    : "Learning course",
        ImageUrl       : "https://docs.google.com/spreadsheets/d/1FcQMxJJAIVZtyuAKJHjSgI0qr86GVttGzm65Azzm8XM/edit#gid=0",
        DurationInMins : 90,
        ContentType    : "Text",
        ResourceLink   : "https://docs.google.com/spreadsheets/d/1FcQMxJJAIVZtyuAKJHjSgI0qr86GVttGzm65Azzm8XM/edit#gid=0",
        Sequence       : "1"
  
    };
    setTestData(model, "CourseContentCreateModel");
};

export const loadCourseContentUpdateModel = async (
) => {
    const model = {
        Title          : "Maths Tutorials",
        Description    : "Learning course",
        ImageUrl       : "https://docs.google.com/spreadsheets/d/1FcQMxJJAIVZtyuAKJHjSgI0qr86GVttGzm65Azzm8XM/edit#gid=0",
        DurationInMins : 45,
        ContentType    : "Text",
        Sequence       : 2
    };
    setTestData(model, "CourseContentUpdateModel");
};

function loadCourseContentQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?name=English Grammer';
    return queryString;
}
