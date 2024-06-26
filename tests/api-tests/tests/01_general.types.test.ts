import request from 'supertest';
import { assert, expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('01 - Type tests', function () {
    var agent = request.agent(infra._app);

    it('01:01 -> Get person roles', function (done) {
        agent
            .get(`/api/v1/types/person-roles/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                var roles = response.body.Data.PersonRoleTypes;
                const Admin = roles.find((x) => x.RoleName == 'System admin');
                const Patient = roles.find((x) => x.RoleName == 'Patient');
                const Doctor = roles.find((x) => x.RoleName == 'Doctor');
                const Tenant = roles.find((x) => x.RoleName == 'Tenant user');

                setTestData(Admin.id, 'adminRoleId');
                setTestData(Patient.id, 'patientRoleId');
                setTestData(Doctor.id, 'doctorRoleId');
                setTestData(Tenant.TenantId, 'tenantId');

                setTestData(Admin.RoleName, 'adminRoleName');
                setTestData(Patient.RoleName, 'patientRoleName');
                setTestData(Doctor.RoleName, 'doctorRoleName');
                setTestData(Tenant.RoleName, 'tenantName');
            })
            .expect(200, done);
    });

    it('01:02 -> Get organization types', function (done) {
        agent
            .get(`/api/v1/types/organization-types/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('01:03 -> Get gender types', function (done) {
        agent
            .get(`/api/v1/types/genders/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('01:04 -> Get severity list', function (done) {
        agent
            .get(`/api/v1/types/severities/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('01:05 -> Get blood groups', function (done) {
        agent
            .get(`/api/v1/types/blood-groups/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('01:06 -> Get marital status', function (done) {
        agent
            .get(`/api/v1/types/marital-statuses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('01:07 -> Negative - Get person role', function (done) {
        agent
            .get(`/api/v1/types/person-roles/`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('01:08 -> Negative - Get gender types', function (done) {
        agent
            .get(`/api/v1/types/genders/`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('01:09 -> Negative - Get severity list', function (done) {
        agent
            .get(`/api/v1/types/severities/`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('01:10 -> Negative - Get blood groups', function (done) {
        agent
            .get(`/api/v1/types/blood-groups/`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });
});

///////////////////////////////////////////////////////////////////////////
