import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Organization tests', function() {

    var agent = request.agent(infra._app);

    it('7 - Negative - Create organization', function(done) {
        loadOrganizationCreateModel();
        const createModel = getTestData("OrganizationCreateModel");
        agent
            .post(`/api/v1/organizations/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('8 - Negative - Search organization records', function(done) {
        loadOrganizationQueryString();
        agent
            .get(`/api/v1/organizations/search${loadOrganizationQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('9 - Negative - Delete organization', function(done) {
        
        agent
            .delete(`/api/v1/organizations/${getTestData('OrganizationId1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadOrganizationCreateModel = async (
) => {
    const model = {
        Type             : "Clinic",
        Name             : "Shree Clinic",
        ContactPhone     : "+91-1234567890",
        ContactEmail     : "xyz@gmail.com",
        About            : "Shree Gastroenterology and Endoscopy Clinic",
        OperationalSince : "2017-05-08T00:00:00.000Z",
        ImageResourceId  : "80eb4c8b-f302-4612-9fe9-f832c6eb401f",
        IsHealthFacility : true
    };
    setTestData(model, "OrganizationCreateModel");
};

export const loadOrganizationUpdateModel = async (
) => {
    const model = {
        Type             : "Hospital",
        Name             : "Shree Hospital",
        ContactPhone     : "+91-1234567890",
        ContactEmail     : "xyz@gmail.com",
        About            : "Shree Hospital is a speciality hospital located on western part of the Pune city specializing in post-trauma care",
        OperationalSince : "2017-05-08T00:00:00.000Z",
        ImageResourceId  : "80eb4c8b-f302-4612-9fe9-f832c6eb401f",
    };
    setTestData(model, "OrganizationUpdateModel");
};

function loadOrganizationQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

///////////////////////////////////////////////////////////////////////////
