import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Add course - What is the Difference between sex & gender tests', function() {

    var agent = request.agent(infra._app);

    it('upload image', function(done) {
        agent
            .post(`/api/v1/file-resources/upload/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .field('name', 'image')
            .field('IsPublicResource', 'true')
            .attach('image', 'E:/Code/Reancare-Service/storage/local/assets/images/symptom.images/cough.png')
            .expect(response => {
                setTestData(response.body.Data.FileResources.id, 'ImageId');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });

    it('Add course', function(done) {
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
                expect(response.body.Data.Course).to.have.property('ImageUrl');

                setTestData(response.body.Data.Course.id, 'CourseId');

                expect(response.body.Data.Course.Name).to.equal(getTestData("CourseCreateModel").Name);
                expect(response.body.Data.Course.ImageUrl).to.equal(getTestData("CourseCreateModel").ImageUrl);

            })
            .expect(201, done);
    });

    it('Add module', function(done) {
        loadModuleCreateModel();
        const createModel = getTestData("ModuleCreateModel");
        agent
            .post(`/api/v1/educational/course-modules/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.CourseModule.id, 'ModuleId');
                expect(response.body.Data.CourseModule).to.have.property('id');
                expect(response.body.Data.CourseModule).to.have.property('CourseId');
                expect(response.body.Data.CourseModule).to.have.property('Name');
                expect(response.body.Data.CourseModule).to.have.property('DurationInMins');

                setTestData(response.body.Data.CourseModule.id, 'ModuleId');

                expect(response.body.Data.CourseModule.CourseId).to.equal(getTestData("ModuleCreateModel").CourseId);
                expect(response.body.Data.CourseModule.Name).to.equal(getTestData("ModuleCreateModel").Name);
                expect(response.body.Data.CourseModule.DurationInMins).to.equal(getTestData("ModuleCreateModel").DurationInMins);

            })
            .expect(201, done);
    });

    it('Add content', function(done) {
        loadContentCreateModel();
        const createModel = getTestData("ContentCreateModel");
        agent
            .post(`/api/v1/educational/course-contents/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.CourseContent.id, 'ContentId');
                expect(response.body.Data.CourseContent).to.have.property('id');
                expect(response.body.Data.CourseContent).to.have.property('CourseId');
                expect(response.body.Data.CourseContent).to.have.property('ModuleId');
                expect(response.body.Data.CourseContent).to.have.property('Title');
                expect(response.body.Data.CourseContent).to.have.property('Description');
                expect(response.body.Data.CourseContent).to.have.property('DurationInMins');
                expect(response.body.Data.CourseContent).to.have.property('ContentType');
                expect(response.body.Data.CourseContent).to.have.property('ResourceLink');
                expect(response.body.Data.CourseContent).to.have.property('ImageUrl');
                expect(response.body.Data.CourseContent).to.have.property('Sequence');

                setTestData(response.body.Data.CourseContent.id, 'ContentId');

                expect(response.body.Data.CourseContent.CourseId).to.equal(getTestData("ContentCreateModel").CourseId);
                expect(response.body.Data.CourseContent.ModuleId).to.equal(getTestData("ContentCreateModel").ModuleId);
                expect(response.body.Data.CourseContent.Title).to.equal(getTestData("ContentCreateModel").Title);
                expect(response.body.Data.CourseContent.Description).to.equal(getTestData("ContentCreateModel").Description);
                expect(response.body.Data.CourseContent.DurationInMins).to.equal(getTestData("ContentCreateModel").DurationInMins);
                expect(response.body.Data.CourseContent.ContentType).to.equal(getTestData("ContentCreateModel").ContentType);
                expect(response.body.Data.CourseContent.ResourceLink).to.equal(getTestData("ContentCreateModel").ResourceLink);
                expect(response.body.Data.CourseContent.ImageUrl).to.equal(getTestData("ContentCreateModel").ImageUrl);
                expect(response.body.Data.CourseContent.Sequence).to.equal(getTestData("ContentCreateModel").Sequence);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadCourseCreateModel = async (
) => {
    const model = {
        LearningPathId : getTestData("LearningPathId"),
        Name           : "What is the Difference between sex & gender",
        ImageUrl       : "https://docs.google.com/spreadsheets/d/1FcQMxJJAIVZtyuAKJHjSgI0qr86GVttGzm65Azzm8XM/edit#gid=0",
  
    };
    setTestData(model, "CourseCreateModel");
};

export const loadModuleCreateModel = async (
) => {
    const model = {
        CourseId       : getTestData("CourseId"),
        LearningPathId : getTestData("LearningPathId"),
        Name           : "What is the Difference between sex & gender",
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
        Title          : "What is the Difference between sex & gender",
        Description    : "Did you think sex and gender means the same thing? Well it isn't. This module will help you understand the difference between sex and gender.",
        DurationInMins : 5.19,
        ContentType    : "Video",
        ResourceLink   : "https://www.youtube.com/watch?v=Y19kYh6k7ls",
        ImageUrl       : "https://docs.google.com/spreadsheets/d/1FcQMxJJAIVZtyuAKJHjSgI0qr86GVttGzm65Azzm8XM/edit#gid=0",
        Sequence       : '1'
      
    };
    setTestData(model, "ContentCreateModel");
};
