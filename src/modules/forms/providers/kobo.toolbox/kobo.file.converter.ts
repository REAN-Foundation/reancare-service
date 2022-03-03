import fs from 'fs';
import path from 'path';
import xlsx from 'node-xlsx';
import { CAssessmentQuestionNode, CAssessmentTemplate } from "../../../../domain.types/clinical/assessment/assessment.types";
import { uuid } from '../../../../domain.types/miscellaneous/system.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class KoboFileConverter {

    public static readKoboXlsAsTemplate = async (userId: uuid, downloadedFilepath: string)
        : Promise<CAssessmentTemplate> => {

        const workSheetsFromBuffer = xlsx.parse(downloadedFilepath);

        const surveyData = workSheetsFromBuffer.find(x => x.name === 'survey').data;
        const choicesData = workSheetsFromBuffer.find(x => x.name === 'choices').data;
        const settingsData = workSheetsFromBuffer.find(x => x.name === 'settings').data;

        const headers: string[] = surveyData[0] as string[];
        const formTitle = settingsData[1][0];
        const versDate = settingsData[1][1];
        const tokens = versDate.split(' ');
        const versionNumber = tokens[0];
        const dtStr = tokens[1];
        const dateUpdatedStr = dtStr.replace('(', '').replace(')', '');
        const updatedAt = new Date(dateUpdatedStr);

        const questionNodes = KoboFileConverter.getQuestions(headers, surveyData, choicesData);

        return null;
    };

    private static getQuestions = (headers: string[], survey: any[], choices: any[]): CAssessmentQuestionNode[] => {
        var questions = [];
        return questions;
    }

}
