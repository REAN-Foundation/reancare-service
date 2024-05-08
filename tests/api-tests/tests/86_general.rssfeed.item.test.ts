import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('86 - Rssfeed Item tests', function () {
    var agent = request.agent(infra._app);

    it('86:01 -> Create rssfeed item', function (done) {
        loadRssfeedItemCreateModel();
        const createModel = getTestData('rssfeedItemCreateModel');
        agent
            .post(`/api/v1/rss-feeds/feed-items/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setRssfeedItemId(response, 'rssfeedItemId_1');
                expectRssfeedItemProperties(response);

                expectRssfeedItemPropertyValues(response);
            })
            .expect(201, done);
    });

    it('86:02 -> Get rssfeed item by id', function (done) {
        agent
            .get(`/api/v1/rss-feeds/feed-items/${getTestData('rssfeedItemId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectRssfeedItemProperties(response);

                expectRssfeedItemPropertyValues(response);
            })
            .expect(200, done);
    });

    it('86:03 -> Update rssfeed item', function (done) {
        loadRssfeedItemUpdateModel();
        const updateModel = getTestData('rssfeedItemUpdateModel');
        agent
            .put(`/api/v1/rss-feeds/feed-items/${getTestData('rssfeedItemId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectRssfeedItemProperties(response);

                expect(response.body.Data.RssfeedItem.FeedId).to.equal(getTestData('rssfeedItemUpdateModel').FeedId);
                expect(response.body.Data.RssfeedItem.Title).to.equal(getTestData('rssfeedItemUpdateModel').Title);
                expect(response.body.Data.RssfeedItem.Description).to.equal(
                    getTestData('rssfeedItemUpdateModel').Description
                );
                expect(response.body.Data.RssfeedItem.Link).to.equal(getTestData('rssfeedItemUpdateModel').Link);
                expect(response.body.Data.RssfeedItem.Image).to.equal(getTestData('rssfeedItemUpdateModel').Image);
                expect(response.body.Data.RssfeedItem.AuthorName).to.equal(getTestData('rssfeedItemUpdateModel').AuthorName);
                expect(response.body.Data.RssfeedItem.AuthorEmail).to.equal(
                    getTestData('rssfeedItemUpdateModel').AuthorEmail
                );
                expect(response.body.Data.RssfeedItem.AuthorLink).to.equal(getTestData('rssfeedItemUpdateModel').AuthorLink);
            })
            .expect(200, done);
    });

    it('86:04 -> Delete rssfeed item', function (done) {
        agent
            .delete(`/api/v1/rss-feeds/feed-items/${getTestData('rssfeedItemId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create rssfeed item again', function (done) {
        loadRssfeedItemCreateModel();
        const createModel = getTestData('rssfeedItemCreateModel');
        agent
            .post(`/api/v1/rss-feeds/feed-items/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setRssfeedItemId(response, 'rssfeedItemId');
                expectRssfeedItemProperties(response);

                expectRssfeedItemPropertyValues(response);
            })
            .expect(201, done);
    });

    it('86:05 -> Negative - Create rssfeed item', function (done) {
        loadNegativeRssfeedItemCreateModel();
        const createModel = getTestData('negativeRssfeedItemCreateModel');
        agent
            .post(`/api/v1/rss-feeds/feed-items/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(500, done);
    });

    it('86:06 -> Negative - Get rssfeed item by id', function (done) {
        agent
            .get(`/api/v1/rss-feeds/feed-items/${getTestData('rssfeedItemId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('86:07 -> Negative - Update rssfeed item', function (done) {
        loadRssfeedItemUpdateModel();
        const updateModel = getTestData('rssfeedItemUpdateModel');
        agent
            .put(`/api/v1/rss-feeds/feed-items/${getTestData('rssfeedItemId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('86:08 -> Negative - Delete rssfeed item', function (done) {
        agent
            .delete(`/api/v1/rss-feeds/feed-items/${getTestData('rssfeedItemId_1')}`)
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

function setRssfeedItemId(response, key) {
    setTestData(response.body.Data.RssfeedItem.id, key);
}

function expectRssfeedItemProperties(response) {
    expect(response.body.Data.RssfeedItem).to.have.property('FeedId');
    expect(response.body.Data.RssfeedItem).to.have.property('Title');
    expect(response.body.Data.RssfeedItem).to.have.property('Description');
    expect(response.body.Data.RssfeedItem).to.have.property('Link');
    expect(response.body.Data.RssfeedItem).to.have.property('Image');
    expect(response.body.Data.RssfeedItem).to.have.property('AuthorName');
    expect(response.body.Data.RssfeedItem).to.have.property('AuthorEmail');
    expect(response.body.Data.RssfeedItem).to.have.property('AuthorLink');
}

function expectRssfeedItemPropertyValues(response) {
    expect(response.body.Data.RssfeedItem.FeedId).to.equal(getTestData('rssfeedItemCreateModel').FeedId);
    expect(response.body.Data.RssfeedItem.Title).to.equal(getTestData('rssfeedItemCreateModel').Title);
    expect(response.body.Data.RssfeedItem.Description).to.equal(getTestData('rssfeedItemCreateModel').Description);
    expect(response.body.Data.RssfeedItem.Link).to.equal(getTestData('rssfeedItemCreateModel').Link);
    expect(response.body.Data.RssfeedItem.Image).to.equal(getTestData('rssfeedItemCreateModel').Image);
    expect(response.body.Data.RssfeedItem.AuthorName).to.equal(getTestData('rssfeedItemCreateModel').AuthorName);
    expect(response.body.Data.RssfeedItem.AuthorEmail).to.equal(getTestData('rssfeedItemCreateModel').AuthorEmail);
    expect(response.body.Data.RssfeedItem.AuthorLink).to.equal(getTestData('rssfeedItemCreateModel').AuthorLink);
}

export const loadRssfeedItemCreateModel = async () => {
    const model = {
        FeedId: getTestData('rssfeedId'),
        Title: faker.lorem.word(3),
        Description: faker.lorem.word(15),
        Content: faker.lorem.word(10),
        Link: faker.internet.url(),
        Image: faker.image.url(),
        AuthorName: faker.company.name(),
        AuthorEmail: faker.internet.email(),
        AuthorLink: faker.internet.url(),
    };
    setTestData(model, 'rssfeedItemCreateModel');
};

export const loadRssfeedItemUpdateModel = async () => {
    const model = {
        FeedId: getTestData('rssfeedId'),
        Title: faker.lorem.word(3),
        Description: faker.lorem.word(15),
        Content: faker.lorem.word(10),
        Link: faker.internet.url(),
        Image: faker.image.url(),
        AuthorName: faker.company.name(),
        AuthorEmail: faker.internet.email(),
        AuthorLink: faker.internet.url(),
    };
    setTestData(model, 'rssfeedItemUpdateModel');
};

export const loadNegativeRssfeedItemCreateModel = async () => {
    const model = {
        Content: faker.lorem.word(10),
    };
    setTestData(model, 'negativeRssfeedItemCreateModel');
};
