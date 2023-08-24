import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Physical activity tests', function() {

    var agent = request.agent(infra._app);

    it('79 - Negative - Create physical activity', function(done) {
        loadPhysicalActivityCreateModel();
        const createModel = getTestData("PhysicalActivity");
        agent
            .post(`/api/v1/wellness/exercise/physical-activities/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(404, done);
    });

    it('80 - Negative - Search physical activity records', function(done) {
        loadPhysicalActivityQueryString();
        agent
            .get(`/api/v1/wellness/exercise/physical-activities/search${loadPhysicalActivityQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('81 - Negative - Delete physical activity', function(done) {
       
        agent
            .delete(`/api/v1/wellness/exercise/physical-activities/${getTestData('PhysicalActivity')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
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
