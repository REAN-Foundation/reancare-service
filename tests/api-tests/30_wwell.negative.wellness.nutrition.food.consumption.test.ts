import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Nutrition food consumption tests', function() {

    var agent = request.agent(infra._app);

    it('72 - Negative - Create food consumption', function(done) {
        loadFoodCreateModel();
        const createModel = getTestData("FoodCreateModel");
        agent
            .post(`/api/v1/wellness/nutrition/food-consumptions/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('73 - Negative - Get food consumption by event name', function(done) {

        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('Food')}/consumed-as/lunch`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93Y0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('74 - Negative - Search food consumption records', function(done) {
        loadFoodQueryString();
        agent
            .get(`/api/v1/wellness/nutrition/food-consumptions/search${loadFoodQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('75 - Negative - Delete food consumption', function(done) {
       
        agent
            .delete(`/api/v1/wellness/nutrition/food-consumptions/${getTestData('FoodId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadFoodCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Food          : "roti",
        Description   : "mins",
        ConsumedAs    : "Lunch",
        Calories      : 100,
        StartTime     : "2021-09-16T00:00:00.000Z",
        EndTime       : "2021-09-16T00:00:00.000Z"
  
    };
    setTestData(model, "FoodCreateModel");
};

export const loadFoodUpdateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Food          : "Rice",
        Description   : "mins",
        ConsumedAs    : "Dinner",
        Calories      : 200,
        StartTime     : "2021-09-16T09:45:00.000Z",
        EndTime       : "2021-09-16T09:50:00.000Z"
    
    };
    setTestData(model, "FoodUpdateModel");
};

function loadFoodQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?food=roti';
    return queryString;
}
