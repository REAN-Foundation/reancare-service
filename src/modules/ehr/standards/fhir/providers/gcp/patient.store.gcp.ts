/// <reference path = "../../../../types/patient.types.ts" />

import { google } from 'googleapis';
const healthcare = google.healthcare('v1');
import { IPatientStore } from '../../../../interfaces/patient.store.interface';

////////////////////////////////////////////////////////////////////////////////

export class PatientStore implements IPatientStore {

    create = async (body: any): Promise<any> => {

    }

    search = async (filter: any): Promise<any> => {

    }

    getById = async (id: string): Promise<any> => {

    }

    update = async (updates: any): Promise<any> => {

    }

    delete = async (id: string): Promise<any> => {

    }

}

