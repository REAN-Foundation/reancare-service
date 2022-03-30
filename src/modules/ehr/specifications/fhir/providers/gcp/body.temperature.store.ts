import { Helper } from '../../../../../../common/helper';
import { Logger } from '../../../../../../common/logger';
import { BodyTemperatureDomainModel } from '../../../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.domain.model';
import { ITemperatureStore } from '../../../../interfaces/body.temperature.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';

////////////////////////////////////////////////////////////////////////////////

export class GcpTemperatureStore implements ITemperatureStore {

    add = async (model: BodyTemperatureDomainModel): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            var body = this.createTemperatureFhirResource(model);
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
            const request = { parent, type: 'Observation', requestBody: body };
            const resource = await g.projects.locations.datasets.fhirStores.fhir.create(
                request
            );
            var data: any = resource.data;

            //var resourceStr = JSON.stringify(data, null, 2);
            //console.log(`Created FHIR resource ${resourceStr}`);

            return data.id;
        } catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    getById = async (resourceId: string): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'Observation';
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            const resource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data: any = resource.data;
            //var resourceStr = JSON.stringify(data, null, 2);
            //console.log(`Created FHIR resource ${resourceStr}`);
            return data;
        } catch (error) {
            //var errorMessage = Helper.checkObj(error.message);
            if (error.Message != null) {
                // eslint-disable-next-line no-prototype-builtins
                if (error.message.hasOwnProperty('issue')) {
                    var issue = error.message.issue[0];
                    Logger.instance().log(issue.diagnostics);
                    return null;
                }
            }
            Logger.instance().log(error.message);
        }
    };
    
    update = async (resourceId:string, updates: BodyTemperatureDomainModel): Promise<any> => {

        var g = await GcpHelper.getGcpClient();
        const c = GcpHelper.getGcpFhirConfig();
        const resourceType = 'Observation';

        //Get the existing resource
        const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
        var existingResource = await g.projects.locations.datasets.fhirStores.fhir.read(
            { name: parent }
        );
        var data:any = existingResource.data;

        //Construct updated body
        const body: healthcare_v1.Schema$HttpBody = this.updateTemperatureFhirResource(updates, data);
        const updatedResource = await g.projects.locations.datasets.fhirStores.fhir.update({
            name        : parent,
            requestBody : body,
        });
        var data: any = updatedResource.data;
        Logger.instance().log(`Updated ${resourceType} resource:\n${updatedResource.data}`);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'Observation';

            //Get the existing resource
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            await g.projects.locations.datasets.fhirStores.fhir.delete(
                { name: parent }
            );
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    //#region Private methods

    private createTemperatureFhirResource(model: BodyTemperatureDomainModel): any {

        var resource = {
            resourceType : "Observation",
            id           : "temperature",
            status       : "final",
            code         : {
                coding : [
                    {
                        "system"  : "http://acme.lab",
                        "code"    : "BT",
                        "display" : "Body temperature"
                    },
                    {
                        "system"  : "http://loinc.org",
                        "code"    : "8310-5",
                        "display" : "Body temperature"
                    },
                    {
                        "system"  : "http://loinc.org",
                        "code"    : "8331-1",
                        "display" : "Oral temperature"
                    },
                    {
                        "system"  : "http://snomed.info/sct",
                        "code"    : "56342008",
                        "display" : "Temperature taking"
                    }
                ],
                text : "Temperature"
            },
            component : [],
        };

        if (model.EhrId != null) {
            resource['subject'] = {
                reference : `Patient/${model.EhrId}`
            };
        }

        /*if (model.VisitEhirId != null) {
            resource['VisitId'] = model.VisitEhrId
        }*/

        if (model.RecordDate != null) {
            resource['effectiveDateTime'] = Helper.formatDate(model.RecordDate);
        }

        if (model.RecordedByUserId != null) {
            resource['performer'] = [
                {
                    reference : `Practitioner/${model.RecordedByUserId}`
                }
            ];
        }

        if (model.BodyTemperature != null) {
            resource.component.push({
                "code" : {
                    "coding" : [
                        {
                            "system"  : "http://acme.lab",
                            "code"    : "BT",
                            "display" : "Body temperature"
                        },
                        {
                            "system"  : "http://loinc.org",
                            "code"    : "8310-5",
                            "display" : "Body temperature"
                        },
                        {
                            "system"  : "http://loinc.org",
                            "code"    : "8331-1",
                            "display" : "Oral temperature"
                        },
                        {
                            "system"  : "http://snomed.info/sct",
                            "code"    : "56342008",
                            "display" : "Temperature taking"
                        }
                    ],
                    "text" : "Temperature"
                },
                valueQuantity : {
                    value  : 99,
                    unit   : "°F",
                    system : "http://unitsofmeasure.org",
                    code   : "Farenheit"
                },
            });
        }

        return resource;
    }
    
    private updateTemperatureFhirResource(updates: BodyTemperatureDomainModel, existingResource: any): any {

        existingResource.resourceType = "Observation";

        if (updates.EhrId != null) {
            existingResource['subject'] = {
                reference : `Patient/${updates.EhrId}`
            };
        }

        /*if (updates.VisitEhirId != null) {
            existingResource['VisitId'] = updates.VisitEhrId
        }*/

        if (updates.RecordDate != null) {
            existingResource['effectiveDateTime'] = Helper.formatDate(updates.RecordDate);
        }

        if (updates.RecordedByUserId != null) {
            existingResource['performer'] = [
                {
                    reference : `Practitioner/${updates.RecordedByUserId}`
                }
            ];
        }

        return existingResource;
    }

}
