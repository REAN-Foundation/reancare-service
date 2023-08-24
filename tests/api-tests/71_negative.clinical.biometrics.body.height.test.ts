/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Body height tests', function() {

    var agent = request.agent(infra._app);

    it('184 - Negative - Create body height', function(done) {
        loadBodyHeightCreateModel();
        const createModel = getTestData("BodyHeightCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/body-heights`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
 		
            })
            .expect(422, done);
    });

    it('185 - Negative - Search body height records', function(done) {
        loadBodyHeightQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/body-heights/search${loadBodyHeightQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('186 - Negative - Delete body height', function(done) {
        
        agent
            .delete(`/api/v1/clinical/biometrics/body-heights/${getTestData('BodyHeight')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });
 
});

///////////////////////////////////////////////////////////////////////////

export const loadBodyHeightCreateModel = async (
) => {
    const model = {

    };
    setTestData(model, "BodyHeightCreateModel");
};

export const loadBodyHeightUpdateModel = async (
) => {
    const model = {
        PatientUserId	: getTestData('PatientId'),
        BodyHeight  		: 180,
        Unit       			: "cms"
    };
    setTestData(model, "BodyHeightUpdateModel");
};

function loadBodyHeightQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?orderBy=BodyHeight&order=ascending&pageIndex=0&itemsPerPage=25&PatientUserId={{PATIENT_USER_ID}}&MinValue=10&MaxValue=200';
    return queryString;
}
