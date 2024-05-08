import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('90 - Tenant tests', function () {
    var agent = request.agent(infra._app);

    it('90:01 -> Create Tenant', function (done) {
        loadTenantCreateModel();
        const createModel = getTestData('tenantCreateModel');
        agent
            .post(`/api/v1/tenants/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTenantId(response, 'tenantId_1');
                expectTenantProperties(response);

                expectTenantPropertyValues(response);
            })
            .expect(201, done);
    });

    it('90:02 -> Get Tenant by id', function (done) {
        agent
            .get(`/api/v1/tenants/${getTestData('tenantId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expectTenantProperties(response);

                expectTenantPropertyValues(response);
            })
            .expect(200, done);
    });

    //     it('90:03 -> Promote tenant user as admin', function (done) {
    //       agent
    //           .post(`/api/v1/tenants/${getTestData('tenantId_1')}/promote-as-admin`)
    //           .set('Content-Type', 'application/json')
    //           .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //           .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
    //           .expect((response) => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');

    //           })
    //           .expect(201, done);
    //   });

    //   it('90:04 -> Demote admin', function (done) {
    //     agent
    //         .post(`/api/v1/tenants/${getTestData('tenantId_1')}/demote-as-admin`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
    //         .expect((response) => {
    //           expect(response.body).to.have.property('Status');
    //           expect(response.body.Status).to.equal('success');

    //         })
    //         .expect(201, done);
    // });

    it('90:05 -> Get Tenant stats', function (done) {
        agent
            .get(`/api/v1/tenants/${getTestData('tenantId_1')}/stats`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('90:06 -> Get Tenant admins', function (done) {
        agent
            .get(`/api/v1/tenants/${getTestData('tenantId_1')}/admins`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('90:07 -> Get Tenant regular users', function (done) {
        agent
            .get(`/api/v1/tenants/${getTestData('tenantId_1')}/regular-users`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('90:08 -> Search records', function (done) {
        loadTenantQueryString();
        agent
            .get(`/api/v1/tenants/search${loadTenantQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body.Data.TenantRecords).to.have.property('TotalCount');
                expect(response.body.Data.TenantRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.TenantRecords).to.have.property('PageIndex');
                expect(response.body.Data.TenantRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.TenantRecords).to.have.property('Order');
                expect(response.body.Data.TenantRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.TenantRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.TenantRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('90:09 -> Update Tenant', function (done) {
        loadTenantUpdateModel();
        const updateModel = getTestData('tenantUpdateModel');
        agent
            .put(`/api/v1/tenants/${getTestData('tenantId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectTenantProperties(response);

                expect(response.body.Data.Tenant.Name).to.equal(getTestData('tenantUpdateModel').Name);
                expect(response.body.Data.Tenant.Description).to.equal(getTestData('tenantUpdateModel').Description);
                expect(response.body.Data.Tenant.Code).to.equal(getTestData('tenantUpdateModel').Code);
                expect(response.body.Data.Tenant.Phone).to.equal(getTestData('tenantUpdateModel').Phone);
                expect(response.body.Data.Tenant.Email).to.equal(getTestData('tenantUpdateModel').Email);
            })
            .expect(200, done);
    });

    it('90:10 -> Delete Tenant', function (done) {
        agent
            .delete(`/api/v1/tenants/${getTestData('tenantId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create Tenant again', function (done) {
        loadTenantCreateModel();
        const createModel = getTestData('tenantCreateModel');
        agent
            .post(`/api/v1/tenants/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTenantId(response, 'tenantId');
                expectTenantProperties(response);

                expectTenantPropertyValues(response);
            })
            .expect(201, done);
    });

    it('90:11 -> Negative - Create Tenant', function (done) {
        loadNegativeTenantCreateModel();
        const createModel = getTestData('negativeTenantCreateModel');
        agent
            .post(`/api/v1/tenants/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('90:12 -> Negative - Get Tenant by id', function (done) {
        agent
            .get(`/api/v1/tenants/${getTestData('tenantId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('90:13 -> Negative - Update Tenant', function (done) {
        loadTenantUpdateModel();
        const updateModel = getTestData('tenantUpdateModel');
        agent
            .put(`/api/v1/tenants/${getTestData('tenantId')}`)
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

function setTenantId(response, key) {
    setTestData(response.body.Data.Tenant.id, key);
}

function expectTenantProperties(response) {
    expect(response.body.Data.Tenant).to.have.property('Name');
    expect(response.body.Data.Tenant).to.have.property('Description');
    expect(response.body.Data.Tenant).to.have.property('Code');
    expect(response.body.Data.Tenant).to.have.property('Phone');
    expect(response.body.Data.Tenant).to.have.property('Email');
}

function expectTenantPropertyValues(response) {
    expect(response.body.Data.Tenant.Name).to.equal(getTestData('tenantCreateModel').Name);
    expect(response.body.Data.Tenant.Description).to.equal(getTestData('tenantCreateModel').Description);
    expect(response.body.Data.Tenant.Code).to.equal(getTestData('tenantCreateModel').Code);
    expect(response.body.Data.Tenant.Phone).to.equal(getTestData('tenantCreateModel').Phone);
    expect(response.body.Data.Tenant.Email).to.equal(getTestData('tenantCreateModel').Email);
}

export const loadTenantCreateModel = async () => {
    const model = {
        Name: faker.person.fullName(),
        Description: faker.lorem.word(10),
        Code: faker.lorem.words(1),
        // Phone: faker.phone.number(),
        Phone: '+91-1100000001',
        Email: faker.internet.exampleEmail(),
    };
    setTestData(model, 'tenantCreateModel');
};

export const loadTenantUpdateModel = async () => {
    const model = {
        Name: faker.person.fullName(),
        Description: faker.lorem.word(10),
        Code: faker.lorem.words(1),
        // Phone: faker.phone.number(),
        Phone: '+91-1200000001',
        Email: faker.internet.exampleEmail(),
    };
    setTestData(model, 'tenantUpdateModel');
};

function loadTenantQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeTenantCreateModel = async () => {
    const model = {
        PostDate: faker.date.anytime(),
        DaysActive: faker.number.int(100),
        IsActive: faker.datatype.boolean(),
        ImageUrl: faker.image.url(),
    };
    setTestData(model, 'negativeTenantCreateModel');
};
