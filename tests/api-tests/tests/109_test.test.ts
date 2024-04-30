import request from 'supertest';
import { expect, assert } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, getRandomEnumValue, startDate } from '../utils';
import { OrganizationTypes } from '../../../src/domain.types/general/organization/organization.types';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('109 - tests', function () {
    var agent = request.agent(infra._app);

    it('109:01 -> Create consent', function (done) {
        loadConsentCreateModel();
        const createModel = getTestData('consentCreateModel');
        agent
            .post(`/api/v1/consents`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('109:02 -> Create Cohort', function (done) {
        loadCohortCreateModel();
        const createModel = getTestData('cohortCreateModel');
        agent
            .post(`/api/v1/cohorts/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('109:03 -> Create rssfeed', function (done) {
        loadRssfeedCreateModel();
        const createModel = getTestData('rssfeedCreateModel');
        agent
            .post(`/api/v1/rss-feeds/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('109:04 -> Create organization', function (done) {
        loadOrganizationCreateModel();
        const createModel = getTestData('organizationCreateModel');
        agent
            .post(`/api/v1/organizations/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('109:05 -> Create person-organization', function (done) {
        agent
            .post(`/api/v1/organizations/${getTestData('organizationId')}/add-person/${getTestData('doctorPersonId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });
});

///////////////////////////////////////////////////////////////////////////

export const loadConsentCreateModel = async () => {
    const model = {
        ResourceId: getTestData('patientUserId'),
        TenantId: getTestData('tenantId'),
        ResourceCategory: faker.lorem.word(),
        ResourceName: faker.lorem.word(),
        ConsentHolderUserId: faker.string.uuid(),
        AllResourcesInCategory: faker.datatype.boolean(),
        TenantOwnedResource: faker.datatype.boolean(),
        Perpetual: faker.datatype.boolean(),
        RevokedTimestamp: startDate,
        ConsentGivenOn: faker.date.anytime(),
        ConsentValidFrom: startDate,
        ConsentValidTill: endDate,
    };
    setTestData(model, 'consentCreateModel');
};

export const loadCohortCreateModel = async () => {
    const model = {
        Name: faker.person.fullName(),
        TenantId: getTestData('tenantId'),
        Description: faker.lorem.word(10),
        ImageUrl: faker.internet.url(),
    };
    setTestData(model, 'cohortCreateModel');
};

export const loadRssfeedCreateModel = async () => {
    const model = {
        Title: faker.lorem.word(3),
        Description: faker.lorem.word(15),
        Link: faker.internet.url(),
        Language: faker.lorem.word(),
        Copyright: faker.lorem.word(),
        Favicon: faker.image.url(),
        Category: faker.lorem.word(),
        Image: faker.image.url(),
        Tags: [faker.lorem.words(), faker.lorem.words(), faker.lorem.words()],
        ProviderName: faker.company.name(),
        ProviderEmail: faker.internet.email(),
        ProviderLink: faker.internet.url(),
    };
    setTestData(model, 'rssfeedCreateModel');
};

export const loadOrganizationCreateModel = async () => {
    const model = {
        Type: getRandomEnumValue(OrganizationTypes),
        Name: faker.person.fullName(),
        ContactUserId: getTestData('patientUserId'),
        TenantId: getTestData('tenantId'),
        // ContactPhone: faker.phone.number(),
        ContactPhone: '+91-1000000011',
        ContactEmail: faker.internet.exampleEmail(),
        About: faker.word.words(5),
        OperationalSince: faker.date.past(),
        ImageResourceId: faker.string.uuid(),
        IsHealthFacility: faker.datatype.boolean(),
    };
    setTestData(model, 'organizationCreateModel');
};
