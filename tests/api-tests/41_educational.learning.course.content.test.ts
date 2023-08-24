import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Course content tests', function() {

    var agent = request.agent(infra._app);

    it('194 - Create course content', function(done) {
        loadCourseContentCreateModel();
        const createModel = getTestData("CourseContentCreateModel");
        agent
            .post(`/api/v1/educational/course-contents/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.CourseContent.id, 'CourseContentId');
                expect(response.body.Data.CourseContent).to.have.property('id');
                expect(response.body.Data.CourseContent).to.have.property('ModuleId');
                expect(response.body.Data.CourseContent).to.have.property('Title');
                expect(response.body.Data.CourseContent).to.have.property('Description');
                expect(response.body.Data.CourseContent).to.have.property('ImageUrl');
                expect(response.body.Data.CourseContent).to.have.property('DurationInMins');
                expect(response.body.Data.CourseContent).to.have.property('ContentType');
                expect(response.body.Data.CourseContent).to.have.property('ResourceLink');
                expect(response.body.Data.CourseContent).to.have.property('Sequence');

                setTestData(response.body.Data.CourseContent.id, 'CourseContentId');

                expect(response.body.Data.CourseContent.ModuleId).to.equal(getTestData("CourseContentCreateModel").ModuleId);
                expect(response.body.Data.CourseContent.Title).to.equal(getTestData("CourseContentCreateModel").Title);
                expect(response.body.Data.CourseContent.Description).to.equal(getTestData("CourseContentCreateModel").Description);
                expect(response.body.Data.CourseContent.ImageUrl).to.equal(getTestData("CourseContentCreateModel").ImageUrl);
                expect(response.body.Data.CourseContent.DurationInMins).to.equal(getTestData("CourseContentCreateModel").DurationInMins);
                expect(response.body.Data.CourseContent.ContentType).to.equal(getTestData("CourseContentCreateModel").ContentType);
                expect(response.body.Data.CourseContent.ResourceLink).to.equal(getTestData("CourseContentCreateModel").ResourceLink);
                expect(response.body.Data.CourseContent.Sequence).to.equal(getTestData("CourseContentCreateModel").Sequence);

            })
            .expect(201, done);
    });

    it('195 - Get course content by id', function(done) {

        agent
            .get(`/api/v1/educational/course-contents/${getTestData('CourseContentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.CourseContent).to.have.property('id');
                expect(response.body.Data.CourseContent).to.have.property('ModuleId');
                expect(response.body.Data.CourseContent).to.have.property('Title');
                expect(response.body.Data.CourseContent).to.have.property('Description');
                expect(response.body.Data.CourseContent).to.have.property('ImageUrl');
                expect(response.body.Data.CourseContent).to.have.property('DurationInMins');
                expect(response.body.Data.CourseContent).to.have.property('ContentType');
                expect(response.body.Data.CourseContent).to.have.property('ResourceLink');
                expect(response.body.Data.CourseContent).to.have.property('Sequence');

                expect(response.body.Data.CourseContent.ModuleId).to.equal(getTestData("CourseContentCreateModel").ModuleId);
                expect(response.body.Data.CourseContent.Title).to.equal(getTestData("CourseContentCreateModel").Title);
                expect(response.body.Data.CourseContent.Description).to.equal(getTestData("CourseContentCreateModel").Description);
                expect(response.body.Data.CourseContent.ImageUrl).to.equal(getTestData("CourseContentCreateModel").ImageUrl);
                expect(response.body.Data.CourseContent.DurationInMins).to.equal(getTestData("CourseContentCreateModel").DurationInMins);
                expect(response.body.Data.CourseContent.ContentType).to.equal(getTestData("CourseContentCreateModel").ContentType);
                expect(response.body.Data.CourseContent.ResourceLink).to.equal(getTestData("CourseContentCreateModel").ResourceLink);

            })
            .expect(200, done);
    });

    it('196 - Search course content records', function(done) {
        loadCourseContentQueryString();
        agent
            .get(`/api/v1/educational/course-contents/search${loadCourseContentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.CourseContents).to.have.property('TotalCount');
                expect(response.body.Data.CourseContents).to.have.property('RetrievedCount');
                expect(response.body.Data.CourseContents).to.have.property('PageIndex');
                expect(response.body.Data.CourseContents).to.have.property('ItemsPerPage');
                expect(response.body.Data.CourseContents).to.have.property('Order');
                expect(response.body.Data.CourseContents.TotalCount).to.greaterThan(0);
                expect(response.body.Data.CourseContents.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.CourseContents.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('197 - Update course content', function(done) {
        loadCourseContentUpdateModel();
        const updateModel = getTestData("CourseContentUpdateModel");
        agent
            .put(`/api/v1/educational/course-contents/${getTestData('CourseContentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.CourseContent).to.have.property('id');
                expect(response.body.Data.CourseContent).to.have.property('ModuleId');
                expect(response.body.Data.CourseContent).to.have.property('Title');
                expect(response.body.Data.CourseContent).to.have.property('Description');
                expect(response.body.Data.CourseContent).to.have.property('ImageUrl');
                expect(response.body.Data.CourseContent).to.have.property('DurationInMins');
                expect(response.body.Data.CourseContent).to.have.property('ContentType');
                expect(response.body.Data.CourseContent).to.have.property('ResourceLink');
                expect(response.body.Data.CourseContent).to.have.property('Sequence');

                expect(response.body.Data.CourseContent.Title).to.equal(getTestData("CourseContentUpdateModel").Title);
                expect(response.body.Data.CourseContent.Description).to.equal(getTestData("CourseContentUpdateModel").Description);
                expect(response.body.Data.CourseContent.ImageUrl).to.equal(getTestData("CourseContentUpdateModel").ImageUrl);
                expect(response.body.Data.CourseContent.DurationInMins).to.equal(getTestData("CourseContentUpdateModel").DurationInMins);
                expect(response.body.Data.CourseContent.ContentType).to.equal(getTestData("CourseContentUpdateModel").ContentType);
                expect(response.body.Data.CourseContent.Sequence).to.equal(getTestData("CourseContentUpdateModel").Sequence);

            })
            .expect(200, done);
    });

    it('198 - Delete course content', function(done) {

        agent
            .delete(`/api/v1/educational/course-contents/${getTestData('CourseContentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create course content again', function(done) {
        loadCourseContentCreateModel();
        const createModel = getTestData("CourseContentCreateModel");
        agent
            .post(`/api/v1/educational/course-contents/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.CourseContent.id, 'CourseContentId');
                expect(response.body.Data.CourseContent).to.have.property('id');
                expect(response.body.Data.CourseContent).to.have.property('ModuleId');
                expect(response.body.Data.CourseContent).to.have.property('Title');
                expect(response.body.Data.CourseContent).to.have.property('Description');
                expect(response.body.Data.CourseContent).to.have.property('ImageUrl');
                expect(response.body.Data.CourseContent).to.have.property('DurationInMins');
                expect(response.body.Data.CourseContent).to.have.property('ContentType');
                expect(response.body.Data.CourseContent).to.have.property('ResourceLink');
                expect(response.body.Data.CourseContent).to.have.property('Sequence');

                setTestData(response.body.Data.CourseContent.id, 'CourseContentId');

                expect(response.body.Data.CourseContent.ModuleId).to.equal(getTestData("CourseContentCreateModel").ModuleId);
                expect(response.body.Data.CourseContent.Title).to.equal(getTestData("CourseContentCreateModel").Title);
                expect(response.body.Data.CourseContent.Description).to.equal(getTestData("CourseContentCreateModel").Description);
                expect(response.body.Data.CourseContent.ImageUrl).to.equal(getTestData("CourseContentCreateModel").ImageUrl);
                expect(response.body.Data.CourseContent.DurationInMins).to.equal(getTestData("CourseContentCreateModel").DurationInMins);
                expect(response.body.Data.CourseContent.ContentType).to.equal(getTestData("CourseContentCreateModel").ContentType);
                expect(response.body.Data.CourseContent.ResourceLink).to.equal(getTestData("CourseContentCreateModel").ResourceLink);
                expect(response.body.Data.CourseContent.Sequence).to.equal(getTestData("CourseContentCreateModel").Sequence);

            })
            .expect(201, done);
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
