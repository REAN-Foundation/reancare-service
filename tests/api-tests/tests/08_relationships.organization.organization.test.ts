import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('08 - Organization-organization tests', function () {
    var agent = request.agent(infra._app);

    it('08:01 -> Set parent organization', function (done) {
        loadOrganizationRelationUpdateModel();
        const updateModel = getTestData('oragnizationUpdateModel');
        agent
            .put(`/api/v1/organizations/${getTestData('organizationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body.Data.Organization).to.have.property('id');
                expect(response.body.Data.Organization).to.have.property('Type');
                expect(response.body.Data.Organization).to.have.property('Name');
                expect(response.body.Data.Organization).to.have.property('ContactUserId');
                expect(response.body.Data.Organization).to.have.property('ContactUser');
                expect(response.body.Data.Organization).to.have.property('ContactPhone');
                expect(response.body.Data.Organization).to.have.property('ContactEmail');
                expect(response.body.Data.Organization).to.have.property('ParentOrganizationId');

                expect(response.body.Data.Organization).to.have.property('ParentOrganizationId');
            })
            .expect(200, done);
    });

    it('08:02 -> Negative - Set parent organization', function (done) {
        loadOrganizationRelationUpdateModel();
        const updateModel = getTestData('oragnizationUpdateModel');
        agent
            .put(`/api/v1/organizations/${getTestData('organizationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});
///////////////////////////////////////////////////////////////////////////

export const loadOrganizationRelationUpdateModel = async () => {
    const model = {
        ParentOrganizationId: getTestData('organizationId'),
    };
    setTestData(model, 'oragnizationUpdateModel');
};
