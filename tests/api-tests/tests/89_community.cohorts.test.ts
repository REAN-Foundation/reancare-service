import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('89 - Cohort tests', function () {
    var agent = request.agent(infra._app);

    it('89:01 -> Create Cohort', function (done) {
        loadCohortCreateModel();
        const createModel = getTestData('CohortCreateModel');
        agent
            .post(`/api/v1/cohorts/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('DoctorJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.Cohort.id, 'CohortId_1');
                expect(response.body.Data.Cohort).to.have.property('Name');
                expect(response.body.Data.Cohort).to.have.property('TenantId');
                expect(response.body.Data.Cohort).to.have.property('Description');
                expect(response.body.Data.Cohort).to.have.property('ImageUrl');

                setTestData(response.body.Data.Cohort.id, 'CohortId_1');

                expect(response.body.Data.Cohort.Name).to.equal(getTestData('CohortCreateModel').Name);
                expect(response.body.Data.Cohort.TenantId).to.equal(getTestData('CohortCreateModel').TenantId);
                expect(response.body.Data.Cohort.Description).to.equal(getTestData('CohortCreateModel').Description);
                expect(response.body.Data.Cohort.ImageUrl).to.equal(getTestData('CohortCreateModel').ImageUrl);
            })
            .expect(201, done);
    });

    it('89:02 -> Get Cohort by id', function (done) {
        agent
            .get(`/api/v1/cohorts/${getTestData('CohortId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.Cohort).to.have.property('Name');
                expect(response.body.Data.Cohort).to.have.property('TenantId');
                expect(response.body.Data.Cohort).to.have.property('Description');
                expect(response.body.Data.Cohort).to.have.property('ImageUrl');

                expect(response.body.Data.Cohort.Name).to.equal(getTestData('CohortCreateModel').Name);
                expect(response.body.Data.Cohort.TenantId).to.equal(getTestData('CohortCreateModel').TenantId);
                expect(response.body.Data.Cohort.Description).to.equal(getTestData('CohortCreateModel').Description);
                expect(response.body.Data.Cohort.ImageUrl).to.equal(getTestData('CohortCreateModel').ImageUrl);
            })
            .expect(200, done);
    });

    it('89:03 -> Get cohort stats', function (done) {
        agent
            .get(`/api/v1/cohorts/${getTestData('CohortId_1')}/stats`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('DoctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('89:04 -> Get cohort users', function (done) {
        agent
            .get(`/api/v1/cohorts/${getTestData('CohortId_1')}/users`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('DoctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('89:05 -> Get cohort for tenant', function (done) {
        agent
            .get(`/api/v1/cohorts/tenants/${getTestData('TenantId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('DoctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    // it('89:06 -> Add user to cohort', function (done) {
    //     agent
    //         .post(`/api/v1/cohorts/${getTestData('CohortId_1')}/users/${getTestData('PatientUserId_11')}/add`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData('DoctorJwt')}`)
    //         .expect((response) => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    // it('89:07 -> Remove user from cohort', function (done) {
    //     agent
    //         .post(`/api/v1/cohorts/${getTestData('CohortId_1')}/users/${getTestData('PatientUserId')}/remove`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData('DoctorJwt')}`)
    //         .expect((response) => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    it('89:08 -> Search records', function (done) {
        loadCohortQueryString();
        agent
            .get(`/api/v1/cohorts/search${loadCohortQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('DoctorJwt')}`)
            .expect((response) => {
                expect(response.body.Data.Cohorts).to.have.property('TotalCount');
                expect(response.body.Data.Cohorts).to.have.property('RetrievedCount');
                expect(response.body.Data.Cohorts).to.have.property('PageIndex');
                expect(response.body.Data.Cohorts).to.have.property('ItemsPerPage');
                expect(response.body.Data.Cohorts).to.have.property('Order');
                expect(response.body.Data.Cohorts.TotalCount).to.be.at.least(0);
                expect(response.body.Data.Cohorts.RetrievedCount).to.be.at.least(0);
                expect(response.body.Data.Cohorts.Items.length).to.be.at.least(0);
            })
            .expect(200, done);
    });

    it('89:09 -> Update Cohort', function (done) {
        loadCohortUpdateModel();
        const updateModel = getTestData('CohortUpdateModel');
        agent
            .put(`/api/v1/cohorts/${getTestData('CohortId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body.Data.Cohort).to.have.property('Name');
                expect(response.body.Data.Cohort).to.have.property('TenantId');
                expect(response.body.Data.Cohort).to.have.property('Description');
                expect(response.body.Data.Cohort).to.have.property('ImageUrl');

                expect(response.body.Data.Cohort.Name).to.equal(getTestData('CohortUpdateModel').Name);
                expect(response.body.Data.Cohort.TenantId).to.equal(getTestData('CohortUpdateModel').TenantId);
                expect(response.body.Data.Cohort.Description).to.equal(getTestData('CohortUpdateModel').Description);
                expect(response.body.Data.Cohort.ImageUrl).to.equal(getTestData('CohortUpdateModel').ImageUrl);
            })
            .expect(200, done);
    });

    it('89:10 -> Delete Cohort', function (done) {
        agent
            .delete(`/api/v1/cohorts/${getTestData('CohortId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create Cohort again', function (done) {
        loadCohortCreateModel();
        const createModel = getTestData('CohortCreateModel');
        agent
            .post(`/api/v1/cohorts/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.Cohort.id, 'CohortId');
                expect(response.body.Data.Cohort).to.have.property('Name');
                expect(response.body.Data.Cohort).to.have.property('TenantId');
                expect(response.body.Data.Cohort).to.have.property('Description');
                expect(response.body.Data.Cohort).to.have.property('ImageUrl');

                setTestData(response.body.Data.Cohort.id, 'CohortId');

                expect(response.body.Data.Cohort.Name).to.equal(getTestData('CohortCreateModel').Name);
                expect(response.body.Data.Cohort.TenantId).to.equal(getTestData('CohortCreateModel').TenantId);
                expect(response.body.Data.Cohort.Description).to.equal(getTestData('CohortCreateModel').Description);
                expect(response.body.Data.Cohort.ImageUrl).to.equal(getTestData('CohortCreateModel').ImageUrl);
            })
            .expect(201, done);
    });

    it('89:11 -> Negative - Create Cohort', function (done) {
        loadNegativeCohortCreateModel();
        const createModel = getTestData('NegativeNoticeCreateModel');
        agent
            .post(`/api/v1/cohorts/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('89:12 -> Negative - Get Cohort by id', function (done) {
        agent
            .get(`/api/v1/cohorts/${getTestData('CohortId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('DoctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('89:13 -> Negative - Update Cohort', function (done) {
        loadCohortUpdateModel();
        const updateModel = getTestData('CohortUpdateModel');
        agent
            .put(`/api/v1/cohorts/${getTestData('NoticeId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

export const loadCohortCreateModel = async () => {
    const model = {
        Name: faker.person.fullName(),
        TenantId: getTestData('TenantId'),
        Description: faker.lorem.word(10),
        ImageUrl: faker.internet.url(),
    };
    setTestData(model, 'CohortCreateModel');
};

export const loadCohortUpdateModel = async () => {
    const model = {
        Name: faker.person.fullName(),
        TenantId: getTestData('TenantId'),
        Description: faker.lorem.word(10),
        ImageUrl: faker.internet.url(),
    };
    setTestData(model, 'CohortUpdateModel');
};

function loadCohortQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?';
    return queryString;
}

export const loadNegativeCohortCreateModel = async () => {
    const model = {
        PostDate: faker.date.anytime(),
        DaysActive: faker.number.int(100),
        IsActive: faker.datatype.boolean(),
        ImageUrl: faker.image.url(),
    };
    setTestData(model, 'NegativeCohortCreateModel');
};
