import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('39 - Course tests', function () {
    var agent = request.agent(infra._app);

    it('39:01 -> Create course', function (done) {
        loadCourseCreateModel();
        const createModel = getTestData('courseCreateModel');
        agent
            .post(`/api/v1/educational/courses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setCourseId(response, 'courseId_1');
                expectCourseProperties(response);

                expectCoursePropertyValues(response);
            })
            .expect(201, done);
    });

    it('39:02 -> Get course by id', function (done) {
        agent
            .get(`/api/v1/educational/courses/${getTestData('courseId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectCourseProperties(response);

                expectCoursePropertyValues(response);
            })
            .expect(200, done);
    });

    it('39:03 -> Search course records', function (done) {
        loadCourseQueryString();
        agent
            .get(`/api/v1/educational/courses/search${loadCourseQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
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

    it('39:04 -> Update course', function (done) {
        loadCourseUpdateModel();
        const updateModel = getTestData('courseUpdateModel');
        agent
            .put(`/api/v1/educational/courses/${getTestData('courseId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectCourseProperties(response);

                expect(response.body.Data.Course.Name).to.equal(getTestData('courseUpdateModel').Name);
                expect(response.body.Data.Course.Description).to.equal(getTestData('courseUpdateModel').Description);
                expect(response.body.Data.Course.ImageUrl).to.equal(getTestData('courseUpdateModel').ImageUrl);
                expect(response.body.Data.Course.DurationInDays).to.equal(getTestData('courseUpdateModel').DurationInDays);
            })
            .expect(200, done);
    });

    it('39:05 -> Delete course', function (done) {
        agent
            .delete(`/api/v1/educational/courses/${getTestData('courseId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create course again', function (done) {
        loadCourseCreateModel();
        const createModel = getTestData('courseCreateModel');
        agent
            .post(`/api/v1/educational/courses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setCourseId(response, 'courseId');
                expectCourseProperties(response);

                expectCoursePropertyValues(response);
            })
            .expect(201, done);
    });

    it('39:06 -> Negative - Create course', function (done) {
        loadCourseCreateModel();
        const createModel = getTestData('createModel');
        agent
            .post(`/api/v1/educational/courses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(500, done);
    });

    it('39:07 -> Negative - Search course records', function (done) {
        loadNegativeCourseQueryString();
        agent
            .get(`/api/v1/educational/courses/search?${loadNegativeCourseQueryString()}`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('39:08 -> Negative - Delete course', function (done) {
        agent
            .delete(`/api/v1/educational/courses/${getTestData('courseId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(400, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setCourseId(response, key) {
    setTestData(response.body.Data.Course.id, key);
}

function expectCourseProperties(response) {
    expect(response.body.Data.Course).to.have.property('id');
    expect(response.body.Data.Course).to.have.property('Name');
    expect(response.body.Data.Course).to.have.property('Description');
    expect(response.body.Data.Course).to.have.property('ImageUrl');
    expect(response.body.Data.Course).to.have.property('DurationInDays');
}

function expectCoursePropertyValues(response) {
    expect(response.body.Data.Course.Name).to.equal(getTestData('courseCreateModel').Name);
    expect(response.body.Data.Course.Description).to.equal(getTestData('courseCreateModel').Description);
    expect(response.body.Data.Course.ImageUrl).to.equal(getTestData('courseCreateModel').ImageUrl);
    expect(response.body.Data.Course.DurationInDays).to.equal(getTestData('courseCreateModel').DurationInDays);
}

export const loadCourseCreateModel = async () => {
    const model = {
        TenantId: getTestData('tenantId'),
        Name: faker.lorem.word(),
        Description: faker.word.words(),
        ImageUrl: faker.image.url(),
        DurationInDays: faker.number.int(100),
        StartTime: startDate,
        EndTime: endDate,
    };
    setTestData(model, 'courseCreateModel');
};

export const loadCourseUpdateModel = async () => {
    const model = {
        Name: faker.lorem.word(),
        Description: faker.word.words(),
        ImageUrl: faker.image.url(),
        DurationInDays: faker.number.int(100),
        StartTime: startDate,
        EndTime: endDate,
    };
    setTestData(model, 'courseUpdateModel');
};

function loadCourseQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

function loadNegativeCourseQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = 'name=abc';
    return queryString;
}
