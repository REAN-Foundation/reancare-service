import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('86 - Rssfeed Item tests', function() {

    var agent = request.agent(infra._app);

    it('86:01 -> Create rssfeed item', function(done) {
        loadRssfeedItemCreateModel();
        const createModel = getTestData("RssfeedItemCreateModel");
        agent
            .post(`/api/v1/rss-feeds/feed-items/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.RssfeedItem.id, 'RssfeedItemId_1');
                expect(response.body.Data.RssfeedItem).to.have.property('FeedId');
                expect(response.body.Data.RssfeedItem).to.have.property('Title');
                expect(response.body.Data.RssfeedItem).to.have.property('Description');
                expect(response.body.Data.RssfeedItem).to.have.property('Link');
                expect(response.body.Data.RssfeedItem).to.have.property('Image');
                expect(response.body.Data.RssfeedItem).to.have.property('AuthorName');
                expect(response.body.Data.RssfeedItem).to.have.property('AuthorEmail');
                expect(response.body.Data.RssfeedItem).to.have.property('AuthorLink');

                setTestData(response.body.Data.RssfeedItem.id, 'RssfeedItemId_1');

                expect(response.body.Data.RssfeedItem.FeedId).to.equal(getTestData("RssfeedItemCreateModel").FeedId);
                expect(response.body.Data.RssfeedItem.Title).to.equal(getTestData("RssfeedItemCreateModel").Title);
                expect(response.body.Data.RssfeedItem.Description).to.equal(getTestData("RssfeedItemCreateModel").Description);
                expect(response.body.Data.RssfeedItem.Link).to.equal(getTestData("RssfeedItemCreateModel").Link);
                expect(response.body.Data.RssfeedItem.Image).to.equal(getTestData("RssfeedItemCreateModel").Image);
                expect(response.body.Data.RssfeedItem.AuthorName).to.equal(getTestData("RssfeedItemCreateModel").AuthorName);
                expect(response.body.Data.RssfeedItem.AuthorEmail).to.equal(getTestData("RssfeedItemCreateModel").AuthorEmail);
                expect(response.body.Data.RssfeedItem.AuthorLink).to.equal(getTestData("RssfeedItemCreateModel").AuthorLink);

            })
            .expect(201, done);
    });

    it('86:02 -> Get rssfeed item by id', function(done) {

        agent
            .get(`/api/v1/rss-feeds/feed-items/${getTestData('RssfeedItemId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.RssfeedItem).to.have.property('FeedId');
                expect(response.body.Data.RssfeedItem).to.have.property('Title');
                expect(response.body.Data.RssfeedItem).to.have.property('Description');
                expect(response.body.Data.RssfeedItem).to.have.property('Link');
                expect(response.body.Data.RssfeedItem).to.have.property('Image');
                expect(response.body.Data.RssfeedItem).to.have.property('AuthorName');
                expect(response.body.Data.RssfeedItem).to.have.property('AuthorEmail');
                expect(response.body.Data.RssfeedItem).to.have.property('AuthorLink');

                expect(response.body.Data.RssfeedItem.FeedId).to.equal(getTestData("RssfeedItemCreateModel").FeedId);
                expect(response.body.Data.RssfeedItem.Title).to.equal(getTestData("RssfeedItemCreateModel").Title);
                expect(response.body.Data.RssfeedItem.Description).to.equal(getTestData("RssfeedItemCreateModel").Description);
                expect(response.body.Data.RssfeedItem.Link).to.equal(getTestData("RssfeedItemCreateModel").Link);
                expect(response.body.Data.RssfeedItem.Image).to.equal(getTestData("RssfeedItemCreateModel").Image);
                expect(response.body.Data.RssfeedItem.AuthorName).to.equal(getTestData("RssfeedItemCreateModel").AuthorName);
                expect(response.body.Data.RssfeedItem.AuthorEmail).to.equal(getTestData("RssfeedItemCreateModel").AuthorEmail);
                expect(response.body.Data.RssfeedItem.AuthorLink).to.equal(getTestData("RssfeedItemCreateModel").AuthorLink);
                
            })
            .expect(200, done);
    });

    it('86:03 -> Update rssfeed item', function(done) {
        loadRssfeedItemUpdateModel();
        const updateModel = getTestData("RssfeedItemUpdateModel");
        agent
            .put(`/api/v1/rss-feeds/feed-items/${getTestData('RssfeedItemId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.RssfeedItem).to.have.property('FeedId');
                expect(response.body.Data.RssfeedItem).to.have.property('Title');
                expect(response.body.Data.RssfeedItem).to.have.property('Description');
                expect(response.body.Data.RssfeedItem).to.have.property('Link');
                expect(response.body.Data.RssfeedItem).to.have.property('Image');
                expect(response.body.Data.RssfeedItem).to.have.property('AuthorName');
                expect(response.body.Data.RssfeedItem).to.have.property('AuthorEmail');
                expect(response.body.Data.RssfeedItem).to.have.property('AuthorLink');

                expect(response.body.Data.RssfeedItem.FeedId).to.equal(getTestData("RssfeedItemUpdateModel").FeedId);
                expect(response.body.Data.RssfeedItem.Title).to.equal(getTestData("RssfeedItemUpdateModel").Title);
                expect(response.body.Data.RssfeedItem.Description).to.equal(getTestData("RssfeedItemUpdateModel").Description);
                expect(response.body.Data.RssfeedItem.Link).to.equal(getTestData("RssfeedItemUpdateModel").Link);
                expect(response.body.Data.RssfeedItem.Image).to.equal(getTestData("RssfeedItemUpdateModel").Image);
                expect(response.body.Data.RssfeedItem.AuthorName).to.equal(getTestData("RssfeedItemUpdateModel").AuthorName);
                expect(response.body.Data.RssfeedItem.AuthorEmail).to.equal(getTestData("RssfeedItemUpdateModel").AuthorEmail);
                expect(response.body.Data.RssfeedItem.AuthorLink).to.equal(getTestData("RssfeedItemUpdateModel").AuthorLink);

            })
            .expect(200, done);
    });

    it('86:04 -> Delete rssfeed item', function(done) {
      
        agent
            .delete(`/api/v1/rss-feeds/feed-items/${getTestData('RssfeedItemId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create rssfeed item again', function(done) {
        loadRssfeedItemCreateModel();
        const createModel = getTestData("RssfeedItemCreateModel");
        agent
            .post(`/api/v1/rss-feeds/feed-items/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.RssfeedItem.id, 'RssfeedItemId');
                expect(response.body.Data.RssfeedItem).to.have.property('FeedId');
                expect(response.body.Data.RssfeedItem).to.have.property('Title');
                expect(response.body.Data.RssfeedItem).to.have.property('Description');
                expect(response.body.Data.RssfeedItem).to.have.property('Link');
                expect(response.body.Data.RssfeedItem).to.have.property('Image');
                expect(response.body.Data.RssfeedItem).to.have.property('AuthorName');
                expect(response.body.Data.RssfeedItem).to.have.property('AuthorEmail');
                expect(response.body.Data.RssfeedItem).to.have.property('AuthorLink');

                setTestData(response.body.Data.RssfeedItem.id, 'RssfeedItemId');

                expect(response.body.Data.RssfeedItem.FeedId).to.equal(getTestData("RssfeedItemCreateModel").FeedId);
                expect(response.body.Data.RssfeedItem.Title).to.equal(getTestData("RssfeedItemCreateModel").Title);
                expect(response.body.Data.RssfeedItem.Description).to.equal(getTestData("RssfeedItemCreateModel").Description);
                expect(response.body.Data.RssfeedItem.Link).to.equal(getTestData("RssfeedItemCreateModel").Link);
                expect(response.body.Data.RssfeedItem.Image).to.equal(getTestData("RssfeedItemCreateModel").Image);
                expect(response.body.Data.RssfeedItem.AuthorName).to.equal(getTestData("RssfeedItemCreateModel").AuthorName);
                expect(response.body.Data.RssfeedItem.AuthorEmail).to.equal(getTestData("RssfeedItemCreateModel").AuthorEmail);
                expect(response.body.Data.RssfeedItem.AuthorLink).to.equal(getTestData("RssfeedItemCreateModel").AuthorLink);

            })
            .expect(201, done);
    });

    it('86:05 -> Negative - Create rssfeed item', function(done) {
        loadNegativeRssfeedItemCreateModel();
        const createModel = getTestData("NegativeRssfeedItemCreateModel");
        agent
            .post(`/api/v1/rss-feeds/feed-items/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(500, done);
    });

    it('86:06 -> Negative - Get rssfeed item by id', function(done) {

        agent
            .get(`/api/v1/rss-feeds/feed-items/${getTestData('RssfeedItemId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(404, done);
    });

    it('86:07 -> Negative - Update rssfeed item', function(done) {
        loadRssfeedItemUpdateModel();
        const updateModel = getTestData("RssfeedItemUpdateModel");
        agent
            .put(`/api/v1/rss-feeds/feed-items/${getTestData('RssfeedItemId')}`)
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

    it('86:08 -> Negative - Delete rssfeed item', function(done) {
      
        agent
            .delete(`/api/v1/rss-feeds/feed-items/${getTestData('RssfeedItemId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(400, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadRssfeedItemCreateModel = async (
) => {
    const model = {
        FeedId      : getTestData("RssfeedId"),
        Title       : faker.lorem.word(3),
        Description : faker.lorem.word(15),
        Content     : faker.lorem.word(10),
        Link        : faker.internet.url(),
        Image       : faker.image.url(),
        AuthorName  : faker.company.name(),
        AuthorEmail : faker.internet.email(),
        AuthorLink  : faker.internet.url()
    };
    setTestData(model, "RssfeedItemCreateModel");
};

export const loadRssfeedItemUpdateModel = async (
) => {
    const model = {
        FeedId      : getTestData("RssfeedId"),
        Title       : faker.lorem.word(3),
        Description : faker.lorem.word(15),
        Content     : faker.lorem.word(10),
        Link        : faker.internet.url(),
        Image       : faker.image.url(),
        AuthorName  : faker.company.name(),
        AuthorEmail : faker.internet.email(),
        AuthorLink  : faker.internet.url()
    };
    setTestData(model, "RssfeedItemUpdateModel");
};

export const loadNegativeRssfeedItemCreateModel = async (
) => {
    const model = {
        Content : faker.lorem.word(10),
    };
    setTestData(model, "NegativeRssfeedItemCreateModel");
};

