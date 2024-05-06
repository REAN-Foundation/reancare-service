import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { CourseContentType } from '../../../src/domain.types/educational/learning/course.content/course.content.type';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('41 - Course content tests', function () {
    var agent = request.agent(infra._app);

    it('41:01 -> Create course content', function (done) {
        loadCourseContentCreateModel();
        const createModel = getTestData('courseContentCreateModel');
        agent
            .post(`/api/v1/educational/course-contents/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setCourseContentId(response, 'courseContentId_1');
                expectCourseContentProperties(response);

                expectCourseContentPropertyValues(response);
            })
            .expect(201, done);
    });

    it('41:02 -> Get course content by id', function (done) {
        agent
            .get(`/api/v1/educational/course-contents/${getTestData('courseContentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectCourseContentProperties(response);

                expectCourseContentPropertyValues(response);
            })
            .expect(200, done);
    });

    it('41:03 -> Search course content records', function (done) {
        loadCourseContentQueryString();
        agent
            .get(`/api/v1/educational/course-contents/search${loadCourseContentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
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

    it('41:04 -> Update course content', function (done) {
        loadCourseContentUpdateModel();
        const updateModel = getTestData('courseContentUpdateModel');
        agent
            .put(`/api/v1/educational/course-contents/${getTestData('courseContentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectCourseContentProperties(response);

                expect(response.body.Data.CourseContent.Title).to.equal(getTestData('courseContentUpdateModel').Title);
                expect(response.body.Data.CourseContent.Description).to.equal(
                    getTestData('courseContentUpdateModel').Description
                );
                expect(response.body.Data.CourseContent.ImageUrl).to.equal(getTestData('courseContentUpdateModel').ImageUrl);
                expect(response.body.Data.CourseContent.DurationInMins).to.equal(
                    getTestData('courseContentUpdateModel').DurationInMins
                );
                expect(response.body.Data.CourseContent.ContentType).to.equal(
                    getTestData('courseContentUpdateModel').ContentType
                );
            })
            .expect(200, done);
    });

    it('41:05 -> Delete course content', function (done) {
        agent
            .delete(`/api/v1/educational/course-contents/${getTestData('courseContentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create course content again', function (done) {
        loadCourseContentCreateModel();
        const createModel = getTestData('courseContentCreateModel');
        agent
            .post(`/api/v1/educational/course-contents/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setCourseContentId(response, 'courseContentId');
                expectCourseContentProperties(response);

                expectCourseContentPropertyValues(response);
            })
            .expect(201, done);
    });

    it('41:06 -> Negative - Create course content', function (done) {
        loadCourseContentCreateModel();
        const createModel = getTestData('courseContentCreateModel');
        agent
            .post(`/api/v1/educational/course-contents/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('41:07 -> Negative - Search course content records', function (done) {
        loadNegativeCourseContentQueryString();
        agent
            .get(`/api/v1/educational/course-contents/search${loadNegativeCourseContentQueryString()}`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('41:08 -> Negative - Delete course content', function (done) {
        agent
            .delete(`/api/v1/educational/course-contents/${getTestData('courseContentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setCourseContentId(response, key) {
    setTestData(response.body.Data.CourseContent.id, key);
}

function expectCourseContentProperties(response) {
    expect(response.body.Data.CourseContent).to.have.property('id');
    expect(response.body.Data.CourseContent).to.have.property('ModuleId');
    expect(response.body.Data.CourseContent).to.have.property('Title');
    expect(response.body.Data.CourseContent).to.have.property('Description');
    expect(response.body.Data.CourseContent).to.have.property('ImageUrl');
    expect(response.body.Data.CourseContent).to.have.property('DurationInMins');
    expect(response.body.Data.CourseContent).to.have.property('ContentType');
    expect(response.body.Data.CourseContent).to.have.property('ResourceLink');
    expect(response.body.Data.CourseContent).to.have.property('Sequence');
}

function expectCourseContentPropertyValues(response) {
    expect(response.body.Data.CourseContent.ModuleId).to.equal(getTestData('courseContentCreateModel').ModuleId);
    expect(response.body.Data.CourseContent.Title).to.equal(getTestData('courseContentCreateModel').Title);
    expect(response.body.Data.CourseContent.Description).to.equal(getTestData('courseContentCreateModel').Description);
    expect(response.body.Data.CourseContent.ImageUrl).to.equal(getTestData('courseContentCreateModel').ImageUrl);
    expect(response.body.Data.CourseContent.DurationInMins).to.equal(getTestData('courseContentCreateModel').DurationInMins);
    expect(response.body.Data.CourseContent.ContentType).to.equal(getTestData('courseContentCreateModel').ContentType);
    expect(response.body.Data.CourseContent.ResourceLink).to.equal(getTestData('courseContentCreateModel').ResourceLink);
}

export const loadCourseContentCreateModel = async () => {
    const model = {
        ModuleId: getTestData('courseModuleId'),
        Title: faker.lorem.word(),
        Description: faker.word.words(),
        ImageUrl: faker.image.url(),
        DurationInMins: faker.number.int(100),
        ContentType: getRandomEnumValue(CourseContentType),
        ResourceLink: faker.internet.url(),
        Sequence: faker.number.int(100),
    };
    setTestData(model, 'courseContentCreateModel');
};

export const loadCourseContentUpdateModel = async () => {
    const model = {
        Title: faker.lorem.word(),
        Description: faker.word.words(),
        ImageUrl: faker.image.url(),
        DurationInMins: faker.number.int(100),
        ContentType: getRandomEnumValue(CourseContentType),
        Sequence: faker.number.int(100),
    };
    setTestData(model, 'courseContentUpdateModel');
};

function loadCourseContentQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

function loadNegativeCourseContentQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?title=abcd';
    return queryString;
}
