import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('83 - Notice tests', function () {
    var agent = request.agent(infra._app);

    it('83:01 -> Create Notice', function (done) {
        loadNoticeCreateModel();
        const createModel = getTestData('noticeCreateModel');
        agent
            .post(`/api/v1/general/notices/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setNoticeId(response, 'noticeId_1');
                expectNoticeProperties(response);

                expectNoticePropertyValues(response);
            })
            .expect(201, done);
    });

    it('83:02 -> Get Notice by id', function (done) {
        agent
            .get(`/api/v1/general/notices/${getTestData('noticeId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectNoticeProperties(response);

                expectNoticePropertyValues(response);
            })
            .expect(200, done);
    });

    it('83:03 -> Search records', function (done) {
        loadNoticeQueryString();
        agent
            .get(`/api/v1/general/notices/search${loadNoticeQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.NoticeRecords).to.have.property('TotalCount');
                expect(response.body.Data.NoticeRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.NoticeRecords).to.have.property('PageIndex');
                expect(response.body.Data.NoticeRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.NoticeRecords).to.have.property('Order');
                expect(response.body.Data.NoticeRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.NoticeRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.NoticeRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('83:04 -> Update Notice', function (done) {
        loadNoticeUpdateModel();
        const updateModel = getTestData('noticeUpdateModel');
        agent
            .put(`/api/v1/general/notices/${getTestData('noticeId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectNoticeProperties(response);

                expect(response.body.Data.Notice.Title).to.equal(getTestData('noticeUpdateModel').Title);
                expect(response.body.Data.Notice.Description).to.equal(getTestData('noticeUpdateModel').Description);
                expect(response.body.Data.Notice.Link).to.equal(getTestData('noticeUpdateModel').Link);
                expect(response.body.Data.Notice.DaysActive).to.equal(getTestData('noticeUpdateModel').DaysActive);
                expect(response.body.Data.Notice.ImageUrl).to.equal(getTestData('noticeUpdateModel').ImageUrl);
            })
            .expect(200, done);
    });

    it('83:05 -> Delete Notice', function (done) {
        agent
            .delete(`/api/v1/general/notices/${getTestData('noticeId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create Notice again', function (done) {
        loadNoticeCreateModel();
        const createModel = getTestData('noticeCreateModel');
        agent
            .post(`/api/v1/general/notices/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setNoticeId(response, 'noticeId');
                expectNoticeProperties(response);

                expectNoticePropertyValues(response);
            })
            .expect(201, done);
    });

    it('83:06 -> Negative - Create Notice', function (done) {
        loadNegativeNoticeCreateModel();
        const createModel = getTestData('negativeNoticeCreateModel');
        agent
            .post(`/api/v1/general/notices/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('83:07 -> Negative - Get Notice by id', function (done) {
        agent
            .get(`/api/v1/general/notices/${getTestData('noticeId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('83:08 -> Negative - Update Notice', function (done) {
        loadNoticeUpdateModel();
        const updateModel = getTestData('noticeUpdateModel');
        agent
            .put(`/api/v1/general/notices/${getTestData('noticeId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setNoticeId(response, key) {
    setTestData(response.body.Data.Notice.id, key);
}

function expectNoticeProperties(response) {
    expect(response.body.Data.Notice).to.have.property('Title');
    expect(response.body.Data.Notice).to.have.property('Description');
    expect(response.body.Data.Notice).to.have.property('Link');
    expect(response.body.Data.Notice).to.have.property('PostDate');
    expect(response.body.Data.Notice).to.have.property('DaysActive');
    expect(response.body.Data.Notice).to.have.property('IsActive');
    expect(response.body.Data.Notice).to.have.property('ImageUrl');
    expect(response.body.Data.Notice).to.have.property('Action');
}

function expectNoticePropertyValues(response) {
    expect(response.body.Data.Notice.Title).to.equal(getTestData('noticeCreateModel').Title);
    expect(response.body.Data.Notice.Description).to.equal(getTestData('noticeCreateModel').Description);
    expect(response.body.Data.Notice.Link).to.equal(getTestData('noticeCreateModel').Link);
    expect(response.body.Data.Notice.DaysActive).to.equal(getTestData('noticeCreateModel').DaysActive);
    expect(response.body.Data.Notice.ImageUrl).to.equal(getTestData('noticeCreateModel').ImageUrl);
    expect(response.body.Data.Notice.Action).to.equal(getTestData('noticeCreateModel').Action);
}

export const loadNoticeCreateModel = async () => {
    const model = {
        Title: faker.lorem.word(3),
        Description: faker.lorem.word(15),
        Link: faker.internet.url(),
        PostDate: faker.date.anytime(),
        DaysActive: faker.number.int(100),
        Tags: [faker.lorem.words(), faker.lorem.words()],
        IsActive: faker.datatype.boolean(),
        ImageUrl: faker.image.url(),
        Action: faker.lorem.words(),
    };
    setTestData(model, 'noticeCreateModel');
};

export const loadNoticeUpdateModel = async () => {
    const model = {
        Title: faker.lorem.word(3),
        Description: faker.lorem.word(15),
        Link: faker.internet.url(),
        PostDate: faker.date.anytime(),
        DaysActive: faker.number.int(100),
        Tags: [faker.lorem.words()],
        IsActive: faker.datatype.boolean(),
        ImageUrl: faker.image.url(),
    };
    setTestData(model, 'noticeUpdateModel');
};

function loadNoticeQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeNoticeCreateModel = async () => {
    const model = {
        PostDate: faker.date.anytime(),
        DaysActive: faker.number.int(100),
        IsActive: faker.datatype.boolean(),
        ImageUrl: faker.image.url(),
    };
    setTestData(model, 'negativeNoticeCreateModel');
};
