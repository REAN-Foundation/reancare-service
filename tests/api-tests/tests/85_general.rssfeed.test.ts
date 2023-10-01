import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('85 - Rssfeed tests', function() {

    var agent = request.agent(infra._app);

    it('85:01 -> Create rssfeed', function(done) {
        loadRssfeedCreateModel();
        const createModel = getTestData("RssfeedCreateModel");
        agent
            .post(`/api/v1/rss-feeds/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Rssfeed.id, 'RssfeedId_1');
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

                setTestData(response.body.Data.Rssfeed.id, 'RssfeedId_1');

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

    it('85:02 -> Get rssfeed by id', function(done) {

        agent
            .get(`/api/v1/rss-feeds/${getTestData('RssfeedId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('85:03 -> Search rssfeed records', function(done) {
        loadRssfeedQueryString();
        agent
            .get(`/api/v1/rss-feeds/search${loadRssfeedQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('85:04 -> Update rssfeed', function(done) {
        loadRssfeedUpdateModel();
        const updateModel = getTestData("RssfeedUpdateModel");
        agent
            .put(`/api/v1/rss-feeds/${getTestData('RssfeedId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('85:05 -> Delete rssfeed', function(done) {
      
        agent
            .delete(`/api/v1/rss-feeds/${getTestData('RssfeedId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('85:06 -> Negative - Create rssfeed', function(done) {
        loadNegativeRssfeedCreateModel();
        const createModel = getTestData("NegativeRssfeedCreateModel");
        agent
            .post(`/api/v1/rss-feeds/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('85:07 -> Negative - Search rssfeed records', function(done) {
        loadRssfeedQueryString();
        agent
            .get(`/api/v1/rss-feeds/search${loadRssfeedQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('85:08 -> Negative - Delete rssfeed', function(done) {
      
        agent
            .delete(`/api/v1/rss-feeds/${getTestData('RssfeedId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadRssfeedCreateModel = async (
) => {
    const model = {
        Title       : faker.lorem.word(3),
        Description : faker.lorem.word(15),
        Link        : faker.internet.url(),
        Language    : faker.lorem.word(),
        Copyright   : faker.lorem.word(),
        Favicon     : faker.image.url(),
        Category    : faker.lorem.word(),
        Image       : faker.image.url(),
        Tags        : [
            faker.lorem.words(),
            faker.lorem.words(),
            faker.lorem.words()
        ],
        ProviderName  : faker.company.name(),
        ProviderEmail : faker.internet.email(),
        ProviderLink  : faker.internet.url()
    };
    setTestData(model, "RssfeedCreateModel");
};

export const loadRssfeedUpdateModel = async (
) => {
    const model = {
        Title       : faker.lorem.word(3),
        Description : faker.lorem.word(15),
        Link        : faker.internet.url(),
        Language    : faker.lorem.word(),
        Copyright   : faker.lorem.word(),
        Favicon     : faker.image.url(),
        Category    : faker.lorem.word(),
        Image       : faker.image.url(),
        Tags        : [
            faker.lorem.words(),
            faker.lorem.words(),
            faker.lorem.words()
        ],
        ProviderName  : faker.company.name(),
        ProviderEmail : faker.internet.email(),
        ProviderLink  : faker.internet.url()
    };
    setTestData(model, "RssfeedUpdateModel");
};

function loadRssfeedQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeRssfeedCreateModel = async (
) => {
    const model = {
        Category : faker.lorem.word(),
    };
    setTestData(model, "NegativeRssfeedCreateModel");
};
