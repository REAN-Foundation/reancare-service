import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Physical activity tests', function() {

    var agent = request.agent(infra._app);

    it('148 - Create physical activity', function(done) {
        loadPhysicalActivityCreateModel();
        const createModel = getTestData("PhysicalActivityCreateModel");
        agent
            .post(`/api/v1/wellness/exercise/physical-activities/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.PhysicalActivity.id, 'PhysicalActivityId');
                expect(response.body.Data.PhysicalActivity).to.have.property('id');
                expect(response.body.Data.PhysicalActivity).to.have.property('PatientUserId');
                expect(response.body.Data.PhysicalActivity).to.have.property('Exercise');
                expect(response.body.Data.PhysicalActivity).to.have.property('Description');
                expect(response.body.Data.PhysicalActivity).to.have.property('Category');
                expect(response.body.Data.PhysicalActivity).to.have.property('CaloriesBurned');
                expect(response.body.Data.PhysicalActivity).to.have.property('Intensity');
                expect(response.body.Data.PhysicalActivity).to.have.property('StartTime');
                expect(response.body.Data.PhysicalActivity).to.have.property('EndTime');
                expect(response.body.Data.PhysicalActivity).to.have.property('DurationInMin');

                setTestData(response.body.Data.PhysicalActivity.id, 'PhysicalActivityId');

                expect(response.body.Data.PhysicalActivity.PatientUserId).to.equal(getTestData("PhysicalActivityCreateModel").PatientUserId);
                expect(response.body.Data.PhysicalActivity.Exercise).to.equal(getTestData("PhysicalActivityCreateModel").Exercise);
                expect(response.body.Data.PhysicalActivity.Description).to.equal(getTestData("PhysicalActivityCreateModel").Description);
                expect(response.body.Data.PhysicalActivity.Category).to.equal(getTestData("PhysicalActivityCreateModel").Category);
                expect(response.body.Data.PhysicalActivity.CaloriesBurned).to.equal(getTestData("PhysicalActivityCreateModel").CaloriesBurned);
                expect(response.body.Data.PhysicalActivity.Intensity).to.equal(getTestData("PhysicalActivityCreateModel").Intensity);
                expect(response.body.Data.PhysicalActivity.StartTime).to.equal(getTestData("PhysicalActivityCreateModel").StartTime);
                expect(response.body.Data.PhysicalActivity.EndTime).to.equal(getTestData("PhysicalActivityCreateModel").EndTime);
                expect(response.body.Data.PhysicalActivity.DurationInMin).to.equal(getTestData("PhysicalActivityCreateModel").DurationInMin);

            })
            .expect(201, done);
    });

    it('149 - Get physical activity by id', function(done) {

        agent
            .get(`/api/v1/wellness/exercise/physical-activities/${getTestData('PhysicalActivityId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.PhysicalActivity).to.have.property('id');
                expect(response.body.Data.PhysicalActivity).to.have.property('PatientUserId');
                expect(response.body.Data.PhysicalActivity).to.have.property('Exercise');
                expect(response.body.Data.PhysicalActivity).to.have.property('Description');
                expect(response.body.Data.PhysicalActivity).to.have.property('Category');
                expect(response.body.Data.PhysicalActivity).to.have.property('CaloriesBurned');
                expect(response.body.Data.PhysicalActivity).to.have.property('Intensity');
                expect(response.body.Data.PhysicalActivity).to.have.property('StartTime');
                expect(response.body.Data.PhysicalActivity).to.have.property('EndTime');
                expect(response.body.Data.PhysicalActivity).to.have.property('DurationInMin');

                expect(response.body.Data.PhysicalActivity.PatientUserId).to.equal(getTestData("PhysicalActivityCreateModel").PatientUserId);
                expect(response.body.Data.PhysicalActivity.Exercise).to.equal(getTestData("PhysicalActivityCreateModel").Exercise);
                expect(response.body.Data.PhysicalActivity.Description).to.equal(getTestData("PhysicalActivityCreateModel").Description);
                expect(response.body.Data.PhysicalActivity.Category).to.equal(getTestData("PhysicalActivityCreateModel").Category);
                expect(response.body.Data.PhysicalActivity.CaloriesBurned).to.equal(getTestData("PhysicalActivityCreateModel").CaloriesBurned);
                expect(response.body.Data.PhysicalActivity.Intensity).to.equal(getTestData("PhysicalActivityCreateModel").Intensity);
                expect(response.body.Data.PhysicalActivity.StartTime).to.equal(getTestData("PhysicalActivityCreateModel").StartTime);
                expect(response.body.Data.PhysicalActivity.EndTime).to.equal(getTestData("PhysicalActivityCreateModel").EndTime);
                expect(response.body.Data.PhysicalActivity.DurationInMin).to.equal(getTestData("PhysicalActivityCreateModel").DurationInMin);
            })
            .expect(200, done);
    });

    it('150 - Search physical activity records', function(done) {
        loadPhysicalActivityQueryString();
        agent
            .get(`/api/v1/wellness/exercise/physical-activities/search${loadPhysicalActivityQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.PhysicalActivities).to.have.property('TotalCount');
                expect(response.body.Data.PhysicalActivities).to.have.property('RetrievedCount');
                expect(response.body.Data.PhysicalActivities).to.have.property('PageIndex');
                expect(response.body.Data.PhysicalActivities).to.have.property('ItemsPerPage');
                expect(response.body.Data.PhysicalActivities).to.have.property('Order');
                expect(response.body.Data.PhysicalActivities.TotalCount).to.greaterThan(0);
                expect(response.body.Data.PhysicalActivities.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.PhysicalActivities.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('151 - Update physical activity', function(done) {
        loadPhysicalActivityUpdateModel();
        const updateModel = getTestData("PhysicalActivityUpdateModel");
        agent
            .put(`/api/v1/wellness/exercise/physical-activities/${getTestData('PhysicalActivityId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.PhysicalActivity).to.have.property('id');
                expect(response.body.Data.PhysicalActivity).to.have.property('PatientUserId');
                expect(response.body.Data.PhysicalActivity).to.have.property('Exercise');
                expect(response.body.Data.PhysicalActivity).to.have.property('Description');
                expect(response.body.Data.PhysicalActivity).to.have.property('Category');
                expect(response.body.Data.PhysicalActivity).to.have.property('CaloriesBurned');
                expect(response.body.Data.PhysicalActivity).to.have.property('Intensity');
                expect(response.body.Data.PhysicalActivity).to.have.property('StartTime');
                expect(response.body.Data.PhysicalActivity).to.have.property('EndTime');
                expect(response.body.Data.PhysicalActivity).to.have.property('DurationInMin');

                expect(response.body.Data.PhysicalActivity.PatientUserId).to.equal(getTestData("PhysicalActivityUpdateModel").PatientUserId);
                expect(response.body.Data.PhysicalActivity.Exercise).to.equal(getTestData("PhysicalActivityUpdateModel").Exercise);
                expect(response.body.Data.PhysicalActivity.Description).to.equal(getTestData("PhysicalActivityUpdateModel").Description);
                expect(response.body.Data.PhysicalActivity.Category).to.equal(getTestData("PhysicalActivityUpdateModel").Category);
                expect(response.body.Data.PhysicalActivity.CaloriesBurned).to.equal(getTestData("PhysicalActivityUpdateModel").CaloriesBurned);
                expect(response.body.Data.PhysicalActivity.Intensity).to.equal(getTestData("PhysicalActivityUpdateModel").Intensity);
                expect(response.body.Data.PhysicalActivity.StartTime).to.equal(getTestData("PhysicalActivityUpdateModel").StartTime);
                expect(response.body.Data.PhysicalActivity.EndTime).to.equal(getTestData("PhysicalActivityUpdateModel").EndTime);
                expect(response.body.Data.PhysicalActivity.DurationInMin).to.equal(getTestData("PhysicalActivityUpdateModel").DurationInMin);

            })
            .expect(200, done);
    });

    it('152 - Delete physical activity', function(done) {
       
        agent
            .delete(`/api/v1/wellness/exercise/physical-activities/${getTestData('PhysicalActivityId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create physical activity again', function(done) {
        loadPhysicalActivityCreateModel();
        const createModel = getTestData("PhysicalActivityCreateModel");
        agent
            .post(`/api/v1/wellness/exercise/physical-activities/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.PhysicalActivity.id, 'PhysicalActivityId');
                expect(response.body.Data.PhysicalActivity).to.have.property('id');
                expect(response.body.Data.PhysicalActivity).to.have.property('PatientUserId');
                expect(response.body.Data.PhysicalActivity).to.have.property('Exercise');
                expect(response.body.Data.PhysicalActivity).to.have.property('Description');
                expect(response.body.Data.PhysicalActivity).to.have.property('Category');
                expect(response.body.Data.PhysicalActivity).to.have.property('CaloriesBurned');
                expect(response.body.Data.PhysicalActivity).to.have.property('Intensity');
                expect(response.body.Data.PhysicalActivity).to.have.property('StartTime');
                expect(response.body.Data.PhysicalActivity).to.have.property('EndTime');
                expect(response.body.Data.PhysicalActivity).to.have.property('DurationInMin');

                setTestData(response.body.Data.PhysicalActivity.id, 'PhysicalActivityId');

                expect(response.body.Data.PhysicalActivity.PatientUserId).to.equal(getTestData("PhysicalActivityCreateModel").PatientUserId);
                expect(response.body.Data.PhysicalActivity.Exercise).to.equal(getTestData("PhysicalActivityCreateModel").Exercise);
                expect(response.body.Data.PhysicalActivity.Description).to.equal(getTestData("PhysicalActivityCreateModel").Description);
                expect(response.body.Data.PhysicalActivity.Category).to.equal(getTestData("PhysicalActivityCreateModel").Category);
                expect(response.body.Data.PhysicalActivity.CaloriesBurned).to.equal(getTestData("PhysicalActivityCreateModel").CaloriesBurned);
                expect(response.body.Data.PhysicalActivity.Intensity).to.equal(getTestData("PhysicalActivityCreateModel").Intensity);
                expect(response.body.Data.PhysicalActivity.StartTime).to.equal(getTestData("PhysicalActivityCreateModel").StartTime);
                expect(response.body.Data.PhysicalActivity.EndTime).to.equal(getTestData("PhysicalActivityCreateModel").EndTime);
                expect(response.body.Data.PhysicalActivity.DurationInMin).to.equal(getTestData("PhysicalActivityCreateModel").DurationInMin);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadPhysicalActivityCreateModel = async (
) => {
    const model = {
        PatientUserId  : getTestData("PatientUserId"),
        Exercise       : "Dead lift",
        Description    : "30 kg",
        Category       : "Strength training",
        CaloriesBurned : 120,
        Intensity      : "Moderate",
        StartTime      : "2021-09-20T00:00:00.000Z",
        EndTime        : "2021-09-20T00:15:00.000Z",
        DurationInMin  : 15
  
    };
    setTestData(model, "PhysicalActivityCreateModel");
};

export const loadPhysicalActivityUpdateModel = async (
) => {
    const model = {
        PatientUserId  : getTestData("PatientUserId"),
        Exercise       : "Push up",
        Description    : "Straight",
        Category       : "Strength training",
        CaloriesBurned : 40,
        Intensity      : "Vigorous",
        StartTime      : "2021-09-20T00:00:00.000Z",
        EndTime        : "2021-09-20T00:00:05.000Z",
        DurationInMin  : 5
    
    };
    setTestData(model, "PhysicalActivityUpdateModel");
};

function loadPhysicalActivityQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?exercise=Dead lift';
    return queryString;
}
