import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Meditation tests', function() {

    var agent = request.agent(infra._app);

    it('143 - Create meditation', function(done) {
        loadMeditationCreateModel();
        const createModel = getTestData("MeditationCreateModel");
        agent
            .post(`/api/v1/wellness/exercise/meditations/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Meditation.id, 'MeditationId');
                expect(response.body.Data.Meditation).to.have.property('id');
                expect(response.body.Data.Meditation).to.have.property('PatientUserId');
                expect(response.body.Data.Meditation).to.have.property('Meditation');
                expect(response.body.Data.Meditation).to.have.property('Description');
                expect(response.body.Data.Meditation).to.have.property('Category');
                expect(response.body.Data.Meditation).to.have.property('StartTime');
                expect(response.body.Data.Meditation).to.have.property('EndTime');

                setTestData(response.body.Data.Meditation.id, 'MeditationId');

                expect(response.body.Data.Meditation.PatientUserId).to.equal(getTestData("MeditationCreateModel").PatientUserId);
                expect(response.body.Data.Meditation.Meditation).to.equal(getTestData("MeditationCreateModel").Meditation);
                expect(response.body.Data.Meditation.Description).to.equal(getTestData("MeditationCreateModel").Description);
                expect(response.body.Data.Meditation.Category).to.equal(getTestData("MeditationCreateModel").Category);
                expect(response.body.Data.Meditation.StartTime).to.equal(getTestData("MeditationCreateModel").StartTime);
                expect(response.body.Data.Meditation.EndTime).to.equal(getTestData("MeditationCreateModel").EndTime);

            })
            .expect(201, done);
    });

    it('144 - Get meditation by id', function(done) {

        agent
            .get(`/api/v1/wellness/exercise/meditations/${getTestData('MeditationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Meditation).to.have.property('id');
                expect(response.body.Data.Meditation).to.have.property('PatientUserId');
                expect(response.body.Data.Meditation).to.have.property('Meditation');
                expect(response.body.Data.Meditation).to.have.property('Description');
                expect(response.body.Data.Meditation).to.have.property('Category');
                expect(response.body.Data.Meditation).to.have.property('StartTime');
                expect(response.body.Data.Meditation).to.have.property('EndTime');

                expect(response.body.Data.Meditation.PatientUserId).to.equal(getTestData("MeditationCreateModel").PatientUserId);
                expect(response.body.Data.Meditation.Meditation).to.equal(getTestData("MeditationCreateModel").Meditation);
                expect(response.body.Data.Meditation.Description).to.equal(getTestData("MeditationCreateModel").Description);
                expect(response.body.Data.Meditation.Category).to.equal(getTestData("MeditationCreateModel").Category);
                expect(response.body.Data.Meditation.StartTime).to.equal(getTestData("MeditationCreateModel").StartTime);
                expect(response.body.Data.Meditation.EndTime).to.equal(getTestData("MeditationCreateModel").EndTime);
            })
            .expect(200, done);
    });

    it('145 - Search meditation records', function(done) {
        loadMeditationQueryString();
        agent
            .get(`/api/v1/wellness/exercise/meditations/search${loadMeditationQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.MeditationRecords).to.have.property('TotalCount');
                expect(response.body.Data.MeditationRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.MeditationRecords).to.have.property('PageIndex');
                expect(response.body.Data.MeditationRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.MeditationRecords).to.have.property('Order');
                expect(response.body.Data.MeditationRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.MeditationRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.MeditationRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('146 - Update meditation', function(done) {
        loadMeditationUpdateModel();
        const updateModel = getTestData("MeditationUpdateModel");
        agent
            .put(`/api/v1/wellness/exercise/meditations/${getTestData('MeditationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Meditation).to.have.property('id');
                expect(response.body.Data.Meditation).to.have.property('PatientUserId');
                expect(response.body.Data.Meditation).to.have.property('Meditation');
                expect(response.body.Data.Meditation).to.have.property('Description');
                expect(response.body.Data.Meditation).to.have.property('Category');
                expect(response.body.Data.Meditation).to.have.property('StartTime');
                expect(response.body.Data.Meditation).to.have.property('EndTime');

                expect(response.body.Data.Meditation.PatientUserId).to.equal(getTestData("MeditationUpdateModel").PatientUserId);
                expect(response.body.Data.Meditation.Meditation).to.equal(getTestData("MeditationUpdateModel").Meditation);
                expect(response.body.Data.Meditation.Description).to.equal(getTestData("MeditationUpdateModel").Description);
                expect(response.body.Data.Meditation.Category).to.equal(getTestData("MeditationUpdateModel").Category);
                expect(response.body.Data.Meditation.StartTime).to.equal(getTestData("MeditationUpdateModel").StartTime);
                expect(response.body.Data.Meditation.EndTime).to.equal(getTestData("MeditationUpdateModel").EndTime);

            })
            .expect(200, done);
    });

    it('147 - Delete meditation', function(done) {
   
        agent
            .delete(`/api/v1/wellness/exercise/meditations/${getTestData('MeditationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create meditation again', function(done) {
        loadMeditationCreateModel();
        const createModel = getTestData("MeditationCreateModel");
        agent
            .post(`/api/v1/wellness/exercise/meditations/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Meditation.id, 'MeditationId');
                expect(response.body.Data.Meditation).to.have.property('id');
                expect(response.body.Data.Meditation).to.have.property('PatientUserId');
                expect(response.body.Data.Meditation).to.have.property('Meditation');
                expect(response.body.Data.Meditation).to.have.property('Description');
                expect(response.body.Data.Meditation).to.have.property('Category');
                expect(response.body.Data.Meditation).to.have.property('StartTime');
                expect(response.body.Data.Meditation).to.have.property('EndTime');

                setTestData(response.body.Data.Meditation.id, 'MeditationId');

                expect(response.body.Data.Meditation.PatientUserId).to.equal(getTestData("MeditationCreateModel").PatientUserId);
                expect(response.body.Data.Meditation.Meditation).to.equal(getTestData("MeditationCreateModel").Meditation);
                expect(response.body.Data.Meditation.Description).to.equal(getTestData("MeditationCreateModel").Description);
                expect(response.body.Data.Meditation.Category).to.equal(getTestData("MeditationCreateModel").Category);
                expect(response.body.Data.Meditation.StartTime).to.equal(getTestData("MeditationCreateModel").StartTime);
                expect(response.body.Data.Meditation.EndTime).to.equal(getTestData("MeditationCreateModel").EndTime);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadMeditationCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Meditation    : "Breathing",
        Description   : "Everyday meditation",
        Category      : "Exercise",
        StartTime     : "2021-09-21T05:30:00.000Z",
        EndTime       : "2021-09-21T05:45:00.000Z"
  
    };
    setTestData(model, "MeditationCreateModel");
};

export const loadMeditationUpdateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Meditation    : "Breathing",
        Description   : "Exercise",
        Category      : "Mindfulness",
        StartTime     : "2021-09-22T06:30:00.000Z",
        EndTime       : "2021-09-22T06:45:00.000Z"
    
    };
    setTestData(model, "MeditationUpdateModel");
};

function loadMeditationQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?meditation=Breathing';
    return queryString;
}
