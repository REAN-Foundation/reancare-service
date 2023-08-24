import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Rssfeed Item tests', function() {

    var agent = request.agent(infra._app);

    it('455 - Create rssfeed item', function(done) {
        loadRssfeedItemCreateModel();
        const createModel = getTestData("RssfeedItemCreateModel");
        agent
            .post(`/api/v1/rss-feeds/feed-items/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    it('456 - Get rssfeed item by id', function(done) {

        agent
            .get(`/api/v1/rss-feeds/feed-items/${getTestData('RssfeedItemId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    it('457 - Update rssfeed item', function(done) {
        loadRssfeedItemUpdateModel();
        const updateModel = getTestData("RssfeedItemUpdateModel");
        agent
            .put(`/api/v1/rss-feeds/feed-items/${getTestData('RssfeedItemId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    it('458 - Delete rssfeed item', function(done) {
      
        agent
            .delete(`/api/v1/rss-feeds/feed-items/${getTestData('RssfeedItemId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    // it('459 - Get atom feed', function(done) {
    //     agent
    //         .get(`/api/v1/rss-feeds/${getTestData('RssfeedId')}/atom`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
            
    //         })
    //         .expect(200, done);
    // });

    // it('460 - Get rss feed', function(done) {
    //     agent
    //         .get(`/api/v1/rss-feeds/${getTestData('RssfeedId')}/rss`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
          
    //         })
    //         .expect(200, done);
    // });

    // it('461 - Get json feed', function(done) {
    //     agent
    //         .get(`/api/v1/rss-feeds/${getTestData('RssfeedId')}/json`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
        
    //         })
    //         .expect(200, done);
    // });

});

///////////////////////////////////////////////////////////////////////////

export const loadRssfeedItemCreateModel = async (
) => {
    const model = {
        FeedId      : getTestData("RssfeedId"),
        Title       : "Sneha Raahi 1.0 Beta released to dev",
        Description : "Release of Sneha Raahi web application version 1.0 Beta released to dev.",
        Content     : "First version of Sneha Raahi web application released to dev.",
        Link        : "https://www.snehamumbai.org/media/",
        Image       : "https://www.jbcnschool.edu.in/wp-content/uploads/2019/12/field-trip-nehru-science-dec-19-006.jpg",
        AuthorName  : "Sneha Foundation",
        AuthorEmail : "crisis@snehamumbai.org",
        AuthorLink  : "https://www.snehamumbai.org/"
    };
    setTestData(model, "RssfeedItemCreateModel");
};

export const loadRssfeedItemUpdateModel = async (
) => {
    const model = {
        FeedId      : getTestData("RssfeedId"),
        Title       : "Sneha Raahi",
        Description : "Release of Sneha Raahi web application",
        Content     : "First version of Sneha Raahi web application released",
        Link        : "https://www.snehamumbai.org/media/",
        Image       : "https://www.jbcnschool.edu.in/wp-content/uploads/2019/12/field-trip-nehru-science-dec-19-006.jpg",
        AuthorName  : "Rean Foundation",
        AuthorEmail : "crisis@snehamumbai.org",
        AuthorLink  : "https://www.snehamumbai.org/"
    };
    setTestData(model, "RssfeedItemUpdateModel");
};

