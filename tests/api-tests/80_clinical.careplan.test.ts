// import  request  from 'supertest';
// import { expect } from 'chai';
// import Application from '../src/app';
// import { describe, it } from 'mocha';
// import { getTestData } from './init';

// const infra = Application.instance();

// ///////////////////////////////////////////////////////////////////////////

// describe('Care plans tasks as user tasks tests', function() {

//     var agent = request.agent(infra._app);

//     it('372 - Fetch careplan tasks', function(done) {
//         agent
//             .get(`/api/v1/care-plans/${getTestData("EnrollmentId")}/fetch-tasks`)
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
