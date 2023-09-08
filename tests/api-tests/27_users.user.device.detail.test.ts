import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('27 - User device detail tests', function() {

    var agent = request.agent(infra._app);

    it('27 - 01 - Create user device detail', function(done) {
        loadUserDeviceDetailCreateModel();
        const createModel = getTestData("UserDeviceDetailCreateModel");
        agent
            .post(`/api/v1/user-device-details/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.UserDeviceDetails.id, 'UserDeviceDetailId');
                expect(response.body.Data).to.have.property('UserDeviceDetails');
                expect(response.body.Data.UserDeviceDetails).to.equal(true);

            })
            .expect(201, done);
    });

    // it('27 - 02 - Get user device detail by id', function(done) {
    //     const id = `${getTestData('UserDeviceDetailId')}`;
    //     agent
    //         .get(`/api/v1/user-device-details/${getTestData('UserDeviceDetailId')}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body.Data.UserDeviceDetails).to.have.property('id');
    //             expect(response.body.Data.UserDeviceDetails).to.have.property('Token');
    //             expect(response.body.Data.UserDeviceDetails).to.have.property('UserId');
    //             expect(response.body.Data.UserDeviceDetails).to.have.property('DeviceName');
    //             expect(response.body.Data.UserDeviceDetails).to.have.property('OSType');
    //             expect(response.body.Data.UserDeviceDetails).to.have.property('OSVersion');
    //             expect(response.body.Data.UserDeviceDetails).to.have.property('AppName');
    //             expect(response.body.Data.UserDeviceDetails).to.have.property('AppVersion');

    //             expect(response.body.Data.UserDeviceDetails.Token).to.equal(getTestData("UserDeviceDetailCreateModel").Token);
    //             expect(response.body.Data.UserDeviceDetails.UserId).to.equal(getTestData("UserDeviceDetailCreateModel").UserId);
    //             expect(response.body.Data.UserDeviceDetails.DeviceName).to.equal(getTestData("UserDeviceDetailCreateModel").DeviceName);
    //             expect(response.body.Data.UserDeviceDetails.OSType).to.equal(getTestData("UserDeviceDetailCreateModel").OSType);
    //             expect(response.body.Data.UserDeviceDetails.OSVersion).to.equal(getTestData("UserDeviceDetailCreateModel").OSVersion);
    //             expect(response.body.Data.UserDeviceDetails.AppName).to.equal(getTestData("UserDeviceDetailCreateModel").AppName);
    //             expect(response.body.Data.UserDeviceDetails.AppVersion).to.equal(getTestData("UserDeviceDetailCreateModel").AppVersion);
    //         })
    //         .expect(200, done);
    // });

    // it('27 - 03 - Search user device detail records', function(done) {
    //     loadPatientGoalQueryString();
    //     agent
    //         .get(`/api/v1/patient-goals/search${loadPatientGoalQueryString()}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body.Data.GoalRecords).to.have.property('TotalCount');
    //             expect(response.body.Data.GoalRecords).to.have.property('RetrievedCount');
    //             expect(response.body.Data.GoalRecords).to.have.property('PageIndex');
    //             expect(response.body.Data.GoalRecords).to.have.property('ItemsPerPage');
    //             expect(response.body.Data.GoalRecords).to.have.property('Order');
    //             expect(response.body.Data.GoalRecords.TotalCount).to.greaterThan(0);
    //             expect(response.body.Data.GoalRecords.RetrievedCount).to.greaterThan(0);
    //             expect(response.body.Data.GoalRecords.Items.length).to.greaterThan(0);
    //         })
    //         .expect(200, done);
    // });

    // it('27 - 04 - Update user device detail', function(done) {
    //     loadPatientGoalUpdateModel();
    //     const updateModel = getTestData("PatientGoalUpdateModel");
    //     agent
    //         .put(`/api/v1/patient-goals/${getTestData('UserDeviceDetailId')}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .send(updateModel)
    //         .expect(response => {
    //             expect(response.body.Data.Goal).to.have.property('id');
    //             expect(response.body.Data.Goal).to.have.property('PatientUserId');
    //             expect(response.body.Data.Goal).to.have.property('Title');
    //             expect(response.body.Data.Goal).to.have.property('GoalAchieved');
    //             expect(response.body.Data.Goal).to.have.property('GoalAbandoned');

    //             expect(response.body.Data.Goal.Title).to.equal(getTestData("PatientGoalUpdateModel").Title);

    //         })
    //         .expect(200, done);
    // });

    // it('27 - 05 - Delete user device detail', function(done) {
    //     const id = `${getTestData('UserDeviceDetailId')}`;
    
    //     //Delete
    //     agent
    //         .delete(`/api/v1/patient-goals/${getTestData('UserDeviceDetailId')}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    // it('Create patient goal again', function(done) {
    //     loadPatientGoalCreateModel();
    //     const createModel = getTestData("PatientGoalCreateModel");
    //     agent
    //         .post(`/api/v1/patient-goals/`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .send(createModel)
    //         .expect(response => {
    //             setTestData(response.body.Data.Goal.id, 'PatientGoalId');
    //             expect(response.body.Data.Goal).to.have.property('id');
    //             expect(response.body.Data.Goal).to.have.property('PatientUserId');
    //             expect(response.body.Data.Goal).to.have.property('Title');
    //             expect(response.body.Data.Goal).to.have.property('GoalAchieved');
    //             expect(response.body.Data.Goal).to.have.property('GoalAbandoned');

    //             setTestData(response.body.Data.Goal.id, 'PatientGoalId');

    //             expect(response.body.Data.Goal.PatientUserId).to.equal(getTestData("PatientGoalCreateModel").PatientUserId);
    //             expect(response.body.Data.Goal.Title).to.equal(getTestData("PatientGoalCreateModel").Title);
    //             expect(response.body.Data.Goal.GoalAchieved).to.equal(getTestData("PatientGoalCreateModel").GoalAchieved);
    //             expect(response.body.Data.Goal.GoalAbandoned).to.equal(getTestData("PatientGoalCreateModel").GoalAbandoned);

    //         })
    //         .expect(201, done);
    // });

    it('27 - 01 - Negative - Create user device detail', function(done) {
        loadNegativeUserDeviceDetailCreateModel();
        const createModel = getTestData("NegativeUserDeviceDetailCreate");
        agent
            .post(`/api/v1/user-device-details/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadUserDeviceDetailCreateModel = async (
    Token = faker.lorem.word(),
    deviceName = faker.commerce.productName(),
    oSType = faker.lorem.word(),
    oSVersion = faker.number.float({ min: 10, max: 20, precision: 0.1 }),
    appName = faker.person.fullName(),
    appVersion = faker.number.float({ precision: 0.1 }),
) => {
    const model = {
        Token      : Token,
        UserId     : getTestData("PatientUserId"),
        DeviceName : deviceName,
        OSType     : oSType,
        OSVersion  : oSVersion,
        AppName    : appName,
        AppVersion : appVersion
  
    };
    setTestData(model, "UserDeviceDetailCreateModel");
};

export const loadNegativeUserDeviceDetailCreateModel = async (
    Token = faker.lorem.word(),
    deviceName = faker.commerce.productName(),
    oSType = faker.lorem.word(),
    oSVersion = faker.number.float({ min: 10, max: 20, precision: 0.1 }),
    appName = faker.person.fullName(),
    appVersion = faker.number.float({ precision: 0.1 }),
) => {
    const model = {
        Token      : Token,
        DeviceName : deviceName,
        OSType     : oSType,
        OSVersion  : oSVersion,
        AppName    : appName,
        AppVersion : appVersion
  
    };
    setTestData(model, "NegativeUserDeviceDetailCreate");
};
