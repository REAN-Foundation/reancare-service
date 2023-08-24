import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Rssfeed tests', function() {

    var agent = request.agent(infra._app);

    it('450 - Create rssfeed', function(done) {
        loadRssfeedCreateModel();
        const createModel = getTestData("RssfeedCreateModel");
        agent
            .post(`/api/v1/rss-feeds/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Rssfeed.id, 'RssfeedId');
                expect(response.body.Data.Rssfeed).to.have.property('Title');
                expect(response.body.Data.Rssfeed).to.have.property('Description');
                expect(response.body.Data.Rssfeed).to.have.property('Link');
                expect(response.body.Data.Rssfeed).to.have.property('Language');
                expect(response.body.Data.Rssfeed).to.have.property('Copyright');
                expect(response.body.Data.Rssfeed).to.have.property('Favicon');
                expect(response.body.Data.Rssfeed).to.have.property('Category');
                expect(response.body.Data.Rssfeed).to.have.property('Image');
                expect(response.body.Data.Rssfeed).to.have.property('ProviderName');
                expect(response.body.Data.Rssfeed).to.have.property('ProviderEmail');
                expect(response.body.Data.Rssfeed).to.have.property('ProviderLink');

                setTestData(response.body.Data.Rssfeed.id, 'RssfeedId');

                expect(response.body.Data.Rssfeed.Title).to.equal(getTestData("RssfeedCreateModel").Title);
                expect(response.body.Data.Rssfeed.Description).to.equal(getTestData("RssfeedCreateModel").Description);
                expect(response.body.Data.Rssfeed.Link).to.equal(getTestData("RssfeedCreateModel").Link);
                expect(response.body.Data.Rssfeed.Language).to.equal(getTestData("RssfeedCreateModel").Language);
                expect(response.body.Data.Rssfeed.Copyright).to.equal(getTestData("RssfeedCreateModel").Copyright);
                expect(response.body.Data.Rssfeed.Favicon).to.equal(getTestData("RssfeedCreateModel").Favicon);
                expect(response.body.Data.Rssfeed.Category).to.equal(getTestData("RssfeedCreateModel").Category);
                expect(response.body.Data.Rssfeed.Image).to.equal(getTestData("RssfeedCreateModel").Image);
                expect(response.body.Data.Rssfeed.ProviderName).to.equal(getTestData("RssfeedCreateModel").ProviderName);
                expect(response.body.Data.Rssfeed.ProviderEmail).to.equal(getTestData("RssfeedCreateModel").ProviderEmail);
                expect(response.body.Data.Rssfeed.ProviderLink).to.equal(getTestData("RssfeedCreateModel").ProviderLink);

            })
            .expect(201, done);
    });

    it('451 - Get rssfeed by id', function(done) {

        agent
            .get(`/api/v1/rss-feeds/${getTestData('RssfeedId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.Rssfeed).to.have.property('Title');
                expect(response.body.Data.Rssfeed).to.have.property('Description');
                expect(response.body.Data.Rssfeed).to.have.property('Link');
                expect(response.body.Data.Rssfeed).to.have.property('Language');
                expect(response.body.Data.Rssfeed).to.have.property('Copyright');
                expect(response.body.Data.Rssfeed).to.have.property('Favicon');
                expect(response.body.Data.Rssfeed).to.have.property('Category');
                expect(response.body.Data.Rssfeed).to.have.property('Image');
                expect(response.body.Data.Rssfeed).to.have.property('ProviderName');
                expect(response.body.Data.Rssfeed).to.have.property('ProviderEmail');
                expect(response.body.Data.Rssfeed).to.have.property('ProviderLink');

                expect(response.body.Data.Rssfeed.Title).to.equal(getTestData("RssfeedCreateModel").Title);
                expect(response.body.Data.Rssfeed.Description).to.equal(getTestData("RssfeedCreateModel").Description);
                expect(response.body.Data.Rssfeed.Link).to.equal(getTestData("RssfeedCreateModel").Link);
                expect(response.body.Data.Rssfeed.Language).to.equal(getTestData("RssfeedCreateModel").Language);
                expect(response.body.Data.Rssfeed.Copyright).to.equal(getTestData("RssfeedCreateModel").Copyright);
                expect(response.body.Data.Rssfeed.Favicon).to.equal(getTestData("RssfeedCreateModel").Favicon);
                expect(response.body.Data.Rssfeed.Category).to.equal(getTestData("RssfeedCreateModel").Category);
                expect(response.body.Data.Rssfeed.Image).to.equal(getTestData("RssfeedCreateModel").Image);
                expect(response.body.Data.Rssfeed.ProviderName).to.equal(getTestData("RssfeedCreateModel").ProviderName);
                expect(response.body.Data.Rssfeed.ProviderEmail).to.equal(getTestData("RssfeedCreateModel").ProviderEmail);
                expect(response.body.Data.Rssfeed.ProviderLink).to.equal(getTestData("RssfeedCreateModel").ProviderLink);
                
            })
            .expect(200, done);
    });

    it('452 - Search rssfeed records', function(done) {
        loadRssfeedQueryString();
        agent
            .get(`/api/v1/rss-feeds/search${loadRssfeedQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.RssfeedRecords).to.have.property('TotalCount');
                expect(response.body.Data.RssfeedRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.RssfeedRecords).to.have.property('PageIndex');
                expect(response.body.Data.RssfeedRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.RssfeedRecords).to.have.property('Order');
                expect(response.body.Data.RssfeedRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.RssfeedRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.RssfeedRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('453 - Update rssfeed', function(done) {
        loadRssfeedUpdateModel();
        const updateModel = getTestData("RssfeedUpdateModel");
        agent
            .put(`/api/v1/rss-feeds/${getTestData('RssfeedId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Rssfeed).to.have.property('Title');
                expect(response.body.Data.Rssfeed).to.have.property('Description');
                expect(response.body.Data.Rssfeed).to.have.property('Link');
                expect(response.body.Data.Rssfeed).to.have.property('Language');
                expect(response.body.Data.Rssfeed).to.have.property('Copyright');
                expect(response.body.Data.Rssfeed).to.have.property('Favicon');
                expect(response.body.Data.Rssfeed).to.have.property('Category');
                expect(response.body.Data.Rssfeed).to.have.property('Image');
                expect(response.body.Data.Rssfeed).to.have.property('ProviderName');
                expect(response.body.Data.Rssfeed).to.have.property('ProviderEmail');
                expect(response.body.Data.Rssfeed).to.have.property('ProviderLink');

                expect(response.body.Data.Rssfeed.Title).to.equal(getTestData("RssfeedUpdateModel").Title);
                expect(response.body.Data.Rssfeed.Description).to.equal(getTestData("RssfeedUpdateModel").Description);
                expect(response.body.Data.Rssfeed.Link).to.equal(getTestData("RssfeedUpdateModel").Link);
                expect(response.body.Data.Rssfeed.Language).to.equal(getTestData("RssfeedUpdateModel").Language);
                expect(response.body.Data.Rssfeed.Copyright).to.equal(getTestData("RssfeedUpdateModel").Copyright);
                expect(response.body.Data.Rssfeed.Favicon).to.equal(getTestData("RssfeedUpdateModel").Favicon);
                expect(response.body.Data.Rssfeed.Category).to.equal(getTestData("RssfeedUpdateModel").Category);
                expect(response.body.Data.Rssfeed.Image).to.equal(getTestData("RssfeedUpdateModel").Image);
                expect(response.body.Data.Rssfeed.ProviderName).to.equal(getTestData("RssfeedUpdateModel").ProviderName);
                expect(response.body.Data.Rssfeed.ProviderEmail).to.equal(getTestData("RssfeedUpdateModel").ProviderEmail);
                expect(response.body.Data.Rssfeed.ProviderLink).to.equal(getTestData("RssfeedUpdateModel").ProviderLink);

            })
            .expect(200, done);
    });

    it('454 - Delete rssfeed', function(done) {
      
        agent
            .delete(`/api/v1/rss-feeds/${getTestData('RssfeedId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create rssfeed again', function(done) {
        loadRssfeedCreateModel();
        const createModel = getTestData("RssfeedCreateModel");
        agent
            .post(`/api/v1/rss-feeds/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Rssfeed.id, 'RssfeedId');
                expect(response.body.Data.Rssfeed).to.have.property('Title');
                expect(response.body.Data.Rssfeed).to.have.property('Description');
                expect(response.body.Data.Rssfeed).to.have.property('Link');
                expect(response.body.Data.Rssfeed).to.have.property('Language');
                expect(response.body.Data.Rssfeed).to.have.property('Copyright');
                expect(response.body.Data.Rssfeed).to.have.property('Favicon');
                expect(response.body.Data.Rssfeed).to.have.property('Category');
                expect(response.body.Data.Rssfeed).to.have.property('Image');
                expect(response.body.Data.Rssfeed).to.have.property('ProviderName');
                expect(response.body.Data.Rssfeed).to.have.property('ProviderEmail');
                expect(response.body.Data.Rssfeed).to.have.property('ProviderLink');

                setTestData(response.body.Data.Rssfeed.id, 'RssfeedId');

                expect(response.body.Data.Rssfeed.Title).to.equal(getTestData("RssfeedCreateModel").Title);
                expect(response.body.Data.Rssfeed.Description).to.equal(getTestData("RssfeedCreateModel").Description);
                expect(response.body.Data.Rssfeed.Link).to.equal(getTestData("RssfeedCreateModel").Link);
                expect(response.body.Data.Rssfeed.Language).to.equal(getTestData("RssfeedCreateModel").Language);
                expect(response.body.Data.Rssfeed.Copyright).to.equal(getTestData("RssfeedCreateModel").Copyright);
                expect(response.body.Data.Rssfeed.Favicon).to.equal(getTestData("RssfeedCreateModel").Favicon);
                expect(response.body.Data.Rssfeed.Category).to.equal(getTestData("RssfeedCreateModel").Category);
                expect(response.body.Data.Rssfeed.Image).to.equal(getTestData("RssfeedCreateModel").Image);
                expect(response.body.Data.Rssfeed.ProviderName).to.equal(getTestData("RssfeedCreateModel").ProviderName);
                expect(response.body.Data.Rssfeed.ProviderEmail).to.equal(getTestData("RssfeedCreateModel").ProviderEmail);
                expect(response.body.Data.Rssfeed.ProviderLink).to.equal(getTestData("RssfeedCreateModel").ProviderLink);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadRssfeedCreateModel = async (
) => {
    const model = {
        Title       : "Raahi News",
        Description : "All news related to Sneha Raahi application",
        Link        : "https://www.snehamumbai.org/",
        Language    : "en",
        Copyright   : "© 2022 SNEHA Foundation",
        Favicon     : "https://www.snehamumbai.org/wp-content/themes/sneha/img/logo.png",
        Category    : "News",
        Image       : "https://www.snehamumbai.org/wp-content/themes/sneha/img/logo.png",
        Tags        : [
            "Raahi",
            "Sneha",
            "Application"
        ],
        ProviderName  : "Sneha Foundation",
        ProviderEmail : "crisis@snehamumbai.org",
        ProviderLink  : "https://www.snehamumbai.org/"
    };
    setTestData(model, "RssfeedCreateModel");
};

export const loadRssfeedUpdateModel = async (
) => {
    const model = {
        Title       : "Sneha",
        Description : "Learning course",
        Link        : "https://www.snehamumbai.org/",
        Language    : "en",
        Copyright   : "© 2022 SNEHA Foundation",
        Favicon     : "https://www.snehamumbai.org/wp-content/themes/sneha/img/logo.png",
        Category    : "News",
        Image       : "https://docs.google.com/spreadsheets/d/1FcQMxJJAIVZtyuAKJHjSgI0qr86GVttGzm65Azzm8XM/edit#gid=0",
        Tags        : [
            "Raahi",
            "Sneha",
            "Application"
        ],
        ProviderName  : "Sneha Foundation",
        ProviderEmail : "crisis@snehamumbai.org",
        ProviderLink  : "https://www.snehamumbai.org/"
    };
    setTestData(model, "RssfeedUpdateModel");
};

function loadRssfeedQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?title=Raahi News';
    return queryString;
}
