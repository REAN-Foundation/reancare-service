import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('83 - Notice tests', function() {

    var agent = request.agent(infra._app);

    it('83:01 -> Create Notice', function(done) {
        loadNoticeCreateModel();
        const createModel = getTestData("NoticeCreateModel");
        agent
            .post(`/api/v1/general/notices/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Notice.id, 'NoticeId_1');
                expect(response.body.Data.Notice).to.have.property('Title');
                expect(response.body.Data.Notice).to.have.property('Description');
                expect(response.body.Data.Notice).to.have.property('Link');
                expect(response.body.Data.Notice).to.have.property('PostDate');
                expect(response.body.Data.Notice).to.have.property('DaysActive');
                expect(response.body.Data.Notice).to.have.property('IsActive');
                expect(response.body.Data.Notice).to.have.property('ImageUrl');
                expect(response.body.Data.Notice).to.have.property('Action');

                setTestData(response.body.Data.Notice.id, 'NoticeId_1');

                expect(response.body.Data.Notice.Title).to.equal(getTestData("NoticeCreateModel").Title);
                expect(response.body.Data.Notice.Description).to.equal(getTestData("NoticeCreateModel").Description);
                expect(response.body.Data.Notice.Link).to.equal(getTestData("NoticeCreateModel").Link);
                expect(response.body.Data.Notice.DaysActive).to.equal(getTestData("NoticeCreateModel").DaysActive);
                expect(response.body.Data.Notice.ImageUrl).to.equal(getTestData("NoticeCreateModel").ImageUrl);
                expect(response.body.Data.Notice.Action).to.equal(getTestData("NoticeCreateModel").Action);
            })
            .expect(201, done);
    });

    it('83:02 -> Get Notice by id', function(done) {

        agent
            .get(`/api/v1/general/notices/${getTestData('NoticeId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.Notice).to.have.property('Title');
                expect(response.body.Data.Notice).to.have.property('Description');
                expect(response.body.Data.Notice).to.have.property('Link');
                expect(response.body.Data.Notice).to.have.property('PostDate');
                expect(response.body.Data.Notice).to.have.property('DaysActive');
                expect(response.body.Data.Notice).to.have.property('IsActive');
                expect(response.body.Data.Notice).to.have.property('ImageUrl');
                expect(response.body.Data.Notice).to.have.property('Action');

                expect(response.body.Data.Notice.Title).to.equal(getTestData("NoticeCreateModel").Title);
                expect(response.body.Data.Notice.Description).to.equal(getTestData("NoticeCreateModel").Description);
                expect(response.body.Data.Notice.Link).to.equal(getTestData("NoticeCreateModel").Link);
                expect(response.body.Data.Notice.DaysActive).to.equal(getTestData("NoticeCreateModel").DaysActive);
                expect(response.body.Data.Notice.ImageUrl).to.equal(getTestData("NoticeCreateModel").ImageUrl);
                expect(response.body.Data.Notice.Action).to.equal(getTestData("NoticeCreateModel").Action);
                
            })
            .expect(200, done);
    });

    it('83:03 -> Search records', function(done) {
        loadNoticeQueryString();
        agent
            .get(`/api/v1/general/notices/search${loadNoticeQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
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

    it('83:04 -> Update Notice', function(done) {
        loadNoticeUpdateModel();
        const updateModel = getTestData("NoticeUpdateModel");
        agent
            .put(`/api/v1/general/notices/${getTestData('NoticeId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Notice).to.have.property('Title');
                expect(response.body.Data.Notice).to.have.property('Description');
                expect(response.body.Data.Notice).to.have.property('Link');
                expect(response.body.Data.Notice).to.have.property('PostDate');
                expect(response.body.Data.Notice).to.have.property('DaysActive');
                expect(response.body.Data.Notice).to.have.property('IsActive');
                expect(response.body.Data.Notice).to.have.property('ImageUrl');

                expect(response.body.Data.Notice.Title).to.equal(getTestData("NoticeUpdateModel").Title);
                expect(response.body.Data.Notice.Description).to.equal(getTestData("NoticeUpdateModel").Description);
                expect(response.body.Data.Notice.Link).to.equal(getTestData("NoticeUpdateModel").Link);
                expect(response.body.Data.Notice.DaysActive).to.equal(getTestData("NoticeUpdateModel").DaysActive);
                expect(response.body.Data.Notice.ImageUrl).to.equal(getTestData("NoticeUpdateModel").ImageUrl);

            })
            .expect(200, done);
    });

    it('83:05 -> Delete Notice', function(done) {
      
        agent
            .delete(`/api/v1/general/notices/${getTestData('NoticeId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create Notice again', function(done) {
        loadNoticeCreateModel();
        const createModel = getTestData("NoticeCreateModel");
        agent
            .post(`/api/v1/general/notices/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Notice.id, 'NoticeId');
                expect(response.body.Data.Notice).to.have.property('Title');
                expect(response.body.Data.Notice).to.have.property('Description');
                expect(response.body.Data.Notice).to.have.property('Link');
                expect(response.body.Data.Notice).to.have.property('PostDate');
                expect(response.body.Data.Notice).to.have.property('DaysActive');
                expect(response.body.Data.Notice).to.have.property('IsActive');
                expect(response.body.Data.Notice).to.have.property('ImageUrl');
                expect(response.body.Data.Notice).to.have.property('Action');

                setTestData(response.body.Data.Notice.id, 'NoticeId');

                expect(response.body.Data.Notice.Title).to.equal(getTestData("NoticeCreateModel").Title);
                expect(response.body.Data.Notice.Description).to.equal(getTestData("NoticeCreateModel").Description);
                expect(response.body.Data.Notice.Link).to.equal(getTestData("NoticeCreateModel").Link);
                expect(response.body.Data.Notice.DaysActive).to.equal(getTestData("NoticeCreateModel").DaysActive);
                expect(response.body.Data.Notice.ImageUrl).to.equal(getTestData("NoticeCreateModel").ImageUrl);
                expect(response.body.Data.Notice.Action).to.equal(getTestData("NoticeCreateModel").Action);
            })
            .expect(201, done);
    });

    it('83:06 -> Negative - Create Notice', function(done) {
        loadNegativeNoticeCreateModel();
        const createModel = getTestData("NegativeNoticeCreateModel");
        agent
            .post(`/api/v1/general/notices/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('83:07 -> Negative - Get Notice by id', function(done) {

        agent
            .get(`/api/v1/general/notices/${getTestData('NoticeId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(404, done);
    });

    it('83:08 -> Negative - Update Notice', function(done) {
        loadNoticeUpdateModel();
        const updateModel = getTestData("NoticeUpdateModel");
        agent
            .put(`/api/v1/general/notices/${getTestData('NoticeId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadNoticeCreateModel = async (
) => {
    const model = {
        Title       : faker.lorem.word(3),
        Description : faker.lorem.word(15),
        Link        : faker.internet.url(),
        PostDate    : faker.date.anytime(),
        DaysActive  : faker.number.int(100),
        Tags        : [
            faker.lorem.words(),
            faker.lorem.words()
        ],
        IsActive    : faker.datatype.boolean(),
        ImageUrl    : faker.image.url(),
        Action      : faker.lorem.words()
    };
    setTestData(model, "NoticeCreateModel");
};

export const loadNoticeUpdateModel = async (
) => {
    const model = {
        Title       : faker.lorem.word(3),
        Description : faker.lorem.word(15),
        Link        : faker.internet.url(),
        PostDate    : faker.date.anytime(),
        DaysActive  : faker.number.int(100),
        Tags        : [
            faker.lorem.words()
        ],
        IsActive    : faker.datatype.boolean(),
        ImageUrl    : faker.image.url(),
    };
    setTestData(model, "NoticeUpdateModel");
};

function loadNoticeQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeNoticeCreateModel = async (
) => {
    const model = {
        PostDate   : faker.date.anytime(),
        DaysActive : faker.number.int(100),
        IsActive   : faker.datatype.boolean(),
        ImageUrl   : faker.image.url(),
    };
    setTestData(model, "NegativeNoticeCreateModel");
};
