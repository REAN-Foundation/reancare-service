// import  request  from 'supertest';
// import { expect } from 'chai';
// import Application from '../src/app';
// import { describe, it } from 'mocha';
// import { getTestData } from './init';

// const infra = Application.instance();

// ///////////////////////////////////////////////////////////////////////////

// describe('Drug prescriptions: Active and past tests', function() {

//     var agent = request.agent(infra._app);

//     it('267 - Get active drug prescriptions for patient', function(done) {
//         agent
//             .get(`/api/v1/drug-order/active-for-patient/${getTestData("PatientUserId")}`)
//             .set('Content-Type', 'application/json')
//             .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
//             .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
//             .expect(response => {
//                 expect(response.body).to.have.property('Status');
//                 expect(response.body.Status).to.equal('success');
//             })
//             .expect(200, done);
//     });

//     it('268 - Get past drug prescriptions for patient', function(done) {
//         agent
//             .get(`/api/v1/drug-order/past-for-patient/${getTestData("PatientUserId")}`)
//             .set('Content-Type', 'application/json')
//             .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
//             .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
//             .expect(response => {
//                 expect(response.body).to.have.property('Status');
//                 expect(response.body.Status).to.equal('success');
//             })
//             .expect(200, done);
//     });

// });
