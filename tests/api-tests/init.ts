/* eslint-disable no-console */
import  Application  from '../../src/app';
import  path  from 'path';
import  fs  from 'fs';
import { before, after } from 'mocha';
import { exit } from 'process';

const infra = Application.instance();

/////////////////////////////////////////////////////////////////////////////////

//Set-up
before(async () => {
    console.log('Set-up: Initializing test set-up!');
    await infra.start();
    await wait(1000);
    console.log('\nTest set-up: Done!\n');
});

//Tear-down
after(async (done) => {
    console.info('Tear-down: Server shut down successfully!');
    done();
    await wait(1000);
    exit(0);
});

/////////////////////////////////////////////////////////////////////////////////

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

global.TestCache = {};

export const setTestData = (value:any, key:string) => {
    global.TestCache[key] = value;
};

export const getTestData = (key:string): any => {
    return global.TestCache[key];
};

function loadTestData() {
    var filepath = path.join(process.cwd(), 'tests', 'api-tests', 'test.data', 'test.data.json');   
    var fileBuffer = fs.readFileSync(filepath, 'utf8');
    const obj = JSON.parse(fileBuffer);
    return obj;
}

function initializeCache() {
    const testData = loadTestData();
    global.TestCache = { ...testData };
}
