import path from "path";
import { Helper } from "../../../../common/helper";
import { ImagingStudyDomainModel } from "../../../../domain.types/clinical/imaging.study/imaging.study.domain.model";

///////////////////////////////////////////////////////////////////////////////////

export class ImagingStudyMapper {

    public static convertJsonObjectToDomainModel = () => {

        const cwd = process.cwd();
        const jsonPath = path.join(cwd, 'src/modules/ehr/tests/test.data/', 'Imaging.study.domain.model.json');
        var obj = Helper.jsonToObj(jsonPath);

        var model: ImagingStudyDomainModel = {
            PatientUserId                : obj.PatientUserId,
            EhrId                        : obj.EhrId,
            LabVisitId                   : obj.LabVisitId,
            LabVisitEhrId                : obj.LabVisitEhrId,
            PrescribedById               : obj.PrescribedById,
            PrescribedByEhrId            : obj.PrescribedByEhrId,
            Name                         : obj.Name,
            Type                         : obj.Type,
            BodySite                     : obj.BodySite,
            DicomResourceEhrId           : obj.DicomResourceEhrId,
            SeriesCount                  : obj.SeriesCount,
            InstanceCount                : obj.InstanceCount,
            StudyDate                    : obj.StudyDate,
            PerformedById                : obj.PerformedById,
            PerformedByEhrId             : obj.PerformedByEhrId,
            PerformedAtLocationEhrId     : obj.PerformedAtLocationEhrId,
            PerformedAtOrganizationId    : obj.PerformedAtOrganizationId,
            PerformedAtOrganizationEhrId : obj.PerformedAtOrganizationEhrId,
            Findings                     : obj.Findings,
        };

        return model;
    };

}
