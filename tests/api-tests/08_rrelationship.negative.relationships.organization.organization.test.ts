import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';
const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative - Organization-organization tests', function() {

    var agent = request.agent(infra._app);

    it('13 - Negative - Set parent organization', function(done) {
        loadOrganizationRelationUpdateModel();
        const updateModel = getTestData("Organization_OragnizationUpdateModel");
        agent
            .put(`/api/v1/organizations/${getTestData('Organization')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });
    
});
///////////////////////////////////////////////////////////////////////////

export const loadOrganizationRelationUpdateModel = async (
) => {
    const model = {
        ParentOrganizationId : getTestData('OrganizationId'),
    };
    setTestData(model, "Organization_OragnizationUpdateModel");
};
