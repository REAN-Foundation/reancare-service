import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Health priority tests', function() {

    var agent = request.agent(infra._app);

    it('373 - Create health priority', function(done) {
        loadPriorityCreateModel();
        const createModel = getTestData("PriorityCreateModel");
        agent
            .post(`/api/v1/patient-health-priorities/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.HealthPriority.id, 'HealthPriorityId');
                expect(response.body.Data.HealthPriority).to.have.property('PatientUserId');
                expect(response.body.Data.HealthPriority).to.have.property('Provider');
                expect(response.body.Data.HealthPriority).to.have.property('Source');
                expect(response.body.Data.HealthPriority).to.have.property('ProviderEnrollmentId');
                expect(response.body.Data.HealthPriority).to.have.property('ProviderCareplanCode');
                expect(response.body.Data.HealthPriority).to.have.property('ProviderCareplanName');
                expect(response.body.Data.HealthPriority).to.have.property('HealthPriorityType');
                expect(response.body.Data.HealthPriority).to.have.property('IsPrimary');
               
                setTestData(response.body.Data.HealthPriority.id, 'HealthPriorityId');

                expect(response.body.Data.HealthPriority.PatientUserId).to.equal(getTestData("PriorityCreateModel").PatientUserId);
                expect(response.body.Data.HealthPriority.Provider).to.equal(getTestData("PriorityCreateModel").Provider);
                expect(response.body.Data.HealthPriority.Source).to.equal(getTestData("PriorityCreateModel").Source);
                expect(response.body.Data.HealthPriority.ProviderEnrollmentId).to.equal(getTestData("PriorityCreateModel").ProviderEnrollmentId);
                expect(response.body.Data.HealthPriority.ProviderCareplanCode).to.equal(getTestData("PriorityCreateModel").ProviderCareplanCode);
                expect(response.body.Data.HealthPriority.ProviderCareplanName).to.equal(getTestData("PriorityCreateModel").ProviderCareplanName);
                expect(response.body.Data.HealthPriority.HealthPriorityType).to.equal(getTestData("PriorityCreateModel").HealthPriorityType);
                expect(response.body.Data.HealthPriority.IsPrimary).to.equal(getTestData("PriorityCreateModel").IsPrimary);

            })
            .expect(201, done);
    });

    it('374 - Get health priorities', function(done) {
     
        agent
            .get(`/api/v1/patient-health-priorities/for-patient/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
                
            })
            .expect(200, done);
    });

    it('375 - Search health priority records', function(done) {
        loadPriorityQueryString();
        agent
            .get(`/api/v1/patient-health-priorities/search${loadPriorityQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.HealthPriorityRecords).to.have.property('TotalCount');
                expect(response.body.Data.HealthPriorityRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.HealthPriorityRecords).to.have.property('PageIndex');
                expect(response.body.Data.HealthPriorityRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.HealthPriorityRecords).to.have.property('Order');
                expect(response.body.Data.HealthPriorityRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.HealthPriorityRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.HealthPriorityRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('376 - Update health priority', function(done) {
        loadPriorityUpdateModel();
        const updateModel = getTestData("PriorityUpdateModel");
        agent
            .put(`/api/v1/patient-health-priorities/${getTestData('HealthPriorityId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.HealthPriority).to.have.property('PatientUserId');
                expect(response.body.Data.HealthPriority).to.have.property('Provider');
                expect(response.body.Data.HealthPriority).to.have.property('Source');
                expect(response.body.Data.HealthPriority).to.have.property('ProviderEnrollmentId');
                expect(response.body.Data.HealthPriority).to.have.property('ProviderCareplanCode');
                expect(response.body.Data.HealthPriority).to.have.property('ProviderCareplanName');
                expect(response.body.Data.HealthPriority).to.have.property('HealthPriorityType');
                expect(response.body.Data.HealthPriority).to.have.property('IsPrimary');

                expect(response.body.Data.HealthPriority.PatientUserId).to.equal(getTestData("PriorityUpdateModel").PatientUserId);
                expect(response.body.Data.HealthPriority.Provider).to.equal(getTestData("PriorityUpdateModel").Provider);
                expect(response.body.Data.HealthPriority.Source).to.equal(getTestData("PriorityUpdateModel").Source);
                expect(response.body.Data.HealthPriority.ProviderEnrollmentId).to.equal(getTestData("PriorityUpdateModel").ProviderEnrollmentId);
                expect(response.body.Data.HealthPriority.ProviderCareplanCode).to.equal(getTestData("PriorityUpdateModel").ProviderCareplanCode);
                expect(response.body.Data.HealthPriority.ProviderCareplanName).to.equal(getTestData("PriorityUpdateModel").ProviderCareplanName);
                expect(response.body.Data.HealthPriority.HealthPriorityType).to.equal(getTestData("PriorityUpdateModel").HealthPriorityType);
                expect(response.body.Data.HealthPriority.IsPrimary).to.equal(getTestData("PriorityUpdateModel").IsPrimary);

            })
            .expect(200, done);
    });

    it('377 - Delete health priority', function(done) {
        
        agent
            .delete(`/api/v1/patient-health-priorities/${getTestData('HealthPriorityId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create health priority again', function(done) {
        loadPriorityCreateModel();
        const createModel = getTestData("PriorityCreateModel");
        agent
            .post(`/api/v1/patient-health-priorities/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.HealthPriority.id, 'HealthPriorityId');
                expect(response.body.Data.HealthPriority).to.have.property('PatientUserId');
                expect(response.body.Data.HealthPriority).to.have.property('Provider');
                expect(response.body.Data.HealthPriority).to.have.property('Source');
                expect(response.body.Data.HealthPriority).to.have.property('ProviderEnrollmentId');
                expect(response.body.Data.HealthPriority).to.have.property('ProviderCareplanCode');
                expect(response.body.Data.HealthPriority).to.have.property('ProviderCareplanName');
                expect(response.body.Data.HealthPriority).to.have.property('HealthPriorityType');
                expect(response.body.Data.HealthPriority).to.have.property('IsPrimary');
             
                setTestData(response.body.Data.HealthPriority.id, 'HealthPriorityId');

                expect(response.body.Data.HealthPriority.PatientUserId).to.equal(getTestData("PriorityCreateModel").PatientUserId);
                expect(response.body.Data.HealthPriority.Provider).to.equal(getTestData("PriorityCreateModel").Provider);
                expect(response.body.Data.HealthPriority.Source).to.equal(getTestData("PriorityCreateModel").Source);
                expect(response.body.Data.HealthPriority.ProviderEnrollmentId).to.equal(getTestData("PriorityCreateModel").ProviderEnrollmentId);
                expect(response.body.Data.HealthPriority.ProviderCareplanCode).to.equal(getTestData("PriorityCreateModel").ProviderCareplanCode);
                expect(response.body.Data.HealthPriority.ProviderCareplanName).to.equal(getTestData("PriorityCreateModel").ProviderCareplanName);
                expect(response.body.Data.HealthPriority.HealthPriorityType).to.equal(getTestData("PriorityCreateModel").HealthPriorityType);
                expect(response.body.Data.HealthPriority.IsPrimary).to.equal(getTestData("PriorityCreateModel").IsPrimary);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadPriorityCreateModel = async (
) => {
    const model = {
        PatientUserId        : getTestData("PatientUserId"),
        Provider             : "AHA",
        Source               : "Careplan",
        ProviderEnrollmentId : "34",
        ProviderCareplanCode : "code",
        ProviderCareplanName : "rean",
        HealthPriorityType   : "Support",
        IsPrimary            : true
    };
    setTestData(model, "PriorityCreateModel");
};

export const loadPriorityUpdateModel = async (
) => {
    const model = {
        PatientUserId        : getTestData("PatientUserId"),
        Provider             : "AHA",
        Source               : "Careplan",
        ProviderEnrollmentId : "34",
        ProviderCareplanCode : "careplancode",
        ProviderCareplanName : "reancare",
        HealthPriorityType   : "Tobacco",
        IsPrimary            : true
    };
    setTestData(model, "PriorityUpdateModel");
};

function loadPriorityQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?provider=AHA';
    return queryString;
}
