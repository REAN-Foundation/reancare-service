import { injectable } from "tsyringe";
import { Logger } from "../../common/logger";
import { EHRAnalyticsHandler } from "./ehr.analytics.handler";
import { AssessmentTemplateService } from "../../services/clinical/assessment/assessment.template.service";
import { AssessmentService } from "../../services/clinical/assessment/assessment.service";
import { PatientService } from "../../services/users/patient/patient.service";
import { Loader } from "../../startup/loader";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRAssessmentService {

    _patientService: PatientService = null;

    _assessmentService: AssessmentService = null;

    _assessmentTemplateService: AssessmentTemplateService = null;

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    constructor(
    ) {
        this._patientService = Loader.container.resolve(PatientService);
        this._assessmentService = Loader.container.resolve(AssessmentService);
        this._assessmentTemplateService = Loader.container.resolve(AssessmentTemplateService);
    }

    public scheduleExistingAssessmentDataToEHR = async () => {
        try {

            var patientUserIds = await this._patientService.getAllPatientUserIds();
            for await (var p of patientUserIds) {
                var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(p);
                if (eligibleAppNames.length > 0) {
                    var searchResults = await this._assessmentService.search({"PatientUserId" : p});
                    for await (var a of searchResults.Items) {
                        var assessment = await this._assessmentService.getById(a.id);
                        Logger.instance().log(`AnswerResponse :${JSON.stringify(assessment)}`);
        
                        var options = await this._assessmentService.getQuestionById(a.id, a.CurrentNodeId);
                        Logger.instance().log(`Options :${JSON.stringify(options)}`);

                        for await (var appName of eligibleAppNames) {
                            this.mapAssessmentResponseToEHR(assessment, options, appName);  
                        }
                    }
                    
                } else {
                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${p}`);
                }      
            }
            
            Logger.instance().log(`Processed :${searchResults.Items.length} records for Assessment`);

        } catch (error) {
            Logger.instance().log(`Error population existing assessment data in ehr insights database :: ${JSON.stringify(error)}`);
        }
    };

    private mapAssessmentResponseToEHR = async (assessment: any, options?: any, appName?: string ) => {

        Logger.instance().log(`AnswerResponse: ${JSON.stringify(assessment)}`);

        var assessmentRecord = {
            AppName        : appName,
            PatientUserId  : assessment.PatientUserId,
            AssessmentId   : assessment.id,
            TemplateId     : assessment.AssessmentTemplateId,
            NodeId         : null,
            Title          : assessment.Title,
            Question       : null,
            SubQuestion    : null,
            QuestionType   : null,
            AnswerOptions  : options ? JSON.stringify(options.Options) : null,
            AnswerValue    : null,
            AnswerReceived : null,
            AnsweredOn     : assessment.CreatedAt,
            Status         : assessment.Status ?? null,
            Score          : JSON.stringify(assessment.ScoreDetails) ?? null,
            AdditionalInfo : null,
            StartedAt      : assessment.StartedAt ?? null,
            FinishedAt     : assessment.FinishedAt ?? null,
            RecordDate     : assessment.CreatedAt ? new Date((assessment.CreatedAt)).toISOString().split('T')[0] : null
        };

        Logger.instance().log(`AssessmentRecord: ${JSON.stringify(assessmentRecord, null, 2)}`);

        for await (var ur of assessment.UserResponses) {
            
            if (ur.Node && ur.Node.QueryResponseType === 'Single Choice Selection') {
                ur.Additional = JSON.parse(ur.Additional);
                assessmentRecord['AnswerValue'] = ur.Additional.Sequence;
                assessmentRecord['AnswerReceived'] = ur.Additional.Text;
                assessmentRecord['NodeId'] = ur.NodeId;
                assessmentRecord['Question'] = ur.Node.Title;
                assessmentRecord['QuestionType'] = ur.Node.QueryResponseType;
                assessmentRecord['SubQuestion']  = null;

                var listNode = await this._assessmentTemplateService.getNode(ur.Node.ParentNodeId);
                if (listNode && listNode.ServeListNodeChildrenAtOnce) {
                    assessmentRecord['SubQuestion']  = ur.Node.Title;
                    assessmentRecord['Question']  = listNode.Title;
                }

                EHRAnalyticsHandler.addAssessmentRecord(assessmentRecord);
            } else if (ur && ur.Node.QueryResponseType === 'Multi Choice Selection') {
                ur.Additional = JSON.parse(ur.Additional);
                for await (var i of ur.Additional) {
                    assessmentRecord['AnswerValue'] = i.Sequence;
                    assessmentRecord['AnswerReceived'] = i.Text;
                    assessmentRecord['NodeId'] = ur.NodeId;
                    assessmentRecord['Question'] = ur.Node.Title;
                    assessmentRecord['QuestionType'] = ur.Node.QueryResponseType;
                    var a = JSON.parse(JSON.stringify(assessmentRecord));
                    EHRAnalyticsHandler.addAssessmentRecord(a);
                }
            } else {
                EHRAnalyticsHandler.addAssessmentRecord(assessmentRecord);
    
            }

        }

    
        
    };


}
