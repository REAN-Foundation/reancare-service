import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Body temperature tests', function() {

    var agent = request.agent(infra._app);

    it('190 - Negative - Create body temperature', function(done) {
        loadBodyTemperatureCreateModel();
        const createModel = getTestData("BodyTemperatureCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/body-temperatures`)
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

    it('191 - Negative - Search body temperature records', function(done) {
        loadBodyTemperatureQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/body-temperatures/search${loadBodyTemperatureQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('192 - Negative - Delete body temperature', function(done) {
       
        agent
            .delete(`/api/v1/clinical/biometrics/body-temperatures/${getTestData('BodyTemperature')}`)
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

export const loadBodyTemperatureCreateModel = async (
) => {
    const model = {

    };
    setTestData(model, "BodyTemperatureCreateModel");
};

export const loadBodyTemperatureUpdateModel = async (
) => {
    const model = {
        BodyTemperature : 37,
        Unit            : "C",
        RecordDate      : "2021-09-12T00:00:00.000Z"
    };
    setTestData(model, "BodyTemperatureUpdateModel");
};

function loadBodyTemperatureQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?minValue=36&maxValue=48';
    return queryString;
}
