import { IStorageService } from '../../../../interfaces/storage.service.interface';
import { Logger } from '../../../../../../common/logger';
import { GcpHelper } from './helper.gcp';

////////////////////////////////////////////////////////////////////////////////

export class GcpStorageService implements IStorageService {

    //#region public methods

    public init = async (): Promise<boolean> => {
        try {
            Logger.instance().log('Connecting to EHR store...');

            const datasets = await this.getDatasetList();
            let defaultDataset = this.findDefaultDataset(datasets);
            if (defaultDataset == null) {
                defaultDataset = await this.createDataset();
            }
            Logger.instance().log('Verified default dataset...');

            const fhirStores = await this.getFhirStoreList();
            let defaultFhirStore = this.findDefaultFhirStore(fhirStores);
            if (defaultFhirStore == null) {
                defaultFhirStore = await this.createFhirStore();
            }
            Logger.instance().log('Verified default fhir-store...');

            const dicomStores = await this.getDicomStoreList();
            let defaultDicomStore = this.findDefaultDicomStore(dicomStores);
            if (defaultDicomStore == null) {
                defaultDicomStore = await this.createDicomStore();
            }

            Logger.instance().log('Connected to EHR store.');

            //var metadata = await this.getDefaultFhirStoreMetadata();
            //Logger.instance().log(JSON.stringify(metadata, null, 2));

            return true;
        } catch (error) {
            Logger.instance().log('Error initializing GCP dataset/fhir-store. Error: ' + error.message);
        }
    };

    //#endregion

    //#region Private methods

    private createDataset = async () => {

        const g = await GcpHelper.getGcpClient();
        const c = GcpHelper.getGcpFhirConfig();

        var parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}`;
        const datasetId: string = c.DatasetId;
        const create_dataset_request = { parent, datasetId };
        await g.projects.locations.datasets.create(
            create_dataset_request
        );

        parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}`;
        const get_dataset_request = { name: parent };
        const dataset = await g.projects.locations.datasets.get(
            get_dataset_request
        );

        //Logger.instance().log(dataset.data);
        return dataset.data;
    };

    private createFhirStore = async () => {

        const g = await GcpHelper.getGcpClient();
        const c = GcpHelper.getGcpFhirConfig();

        var parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}`;
        const fhirStoreId: string = c.FhirStoreId;
        const version: string = c.FhirVersion;
        
        const create_store_request = {
            parent,
            fhirStoreId,
            resource : {
                version,
            },
        };
        await g.projects.locations.datasets.fhirStores.create(
            create_store_request
        );

        parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
        const request = { name: parent };
        const store = await g.projects.locations.datasets.fhirStores.get(
            request
        );

        //Logger.instance().log(store.data);
        return store.data;
    };

    private createDicomStore = async () => {

        const g = await GcpHelper.getGcpClient();
        const c = GcpHelper.getGcpFhirConfig();

        var parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}`;
        const dicomStoreId: string = c.DicomStoreId;
        const create_store_request = {
            parent,
            dicomStoreId
        };
        await g.projects.locations.datasets.dicomStores.create(
            create_store_request
        );

        parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/dicomStores/${c.DicomStoreId}`;
        const request = { name: parent };
        const store = await g.projects.locations.datasets.dicomStores.get(
            request
        );

        //Logger.instance().log(store.data);
        return store.data;
    };

    private getDefaultDataset = async () => {
        try {

            const g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();

            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}`;
            const request = { name: parent };
            const dataset = await g.projects.locations.datasets.get(
                request
            );

            //Logger.instance().log(dataset.data);
            return dataset.data;
        } catch (error) {
            Logger.instance().log(error.message);
            return null;
        }
    };

    private getDefaultFhirStore = async () => {

        const g = await GcpHelper.getGcpClient();
        const c = GcpHelper.getGcpFhirConfig();

        const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
        const store = await g.projects.locations.datasets.fhirStores.get(
            { name: parent }
        );

        //Logger.instance().log(store.data);
        return store.data;
    };

    private getDefaultDicomStore = async () => {

        const g = await GcpHelper.getGcpClient();
        const c = GcpHelper.getGcpFhirConfig();

        const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/dicomStores/${c.DicomStoreId}`;
        const store = await g.projects.locations.datasets.dicomStores.get(
            { name: parent }
        );

        //Logger.instance().log(store.data);
        return store.data;
    };

    private getDatasetList = async () => {
        try {

            const g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();

            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}`;
            const request = { parent };
            const datasets = await g.projects.locations.datasets.list(
                request
            );

            //Logger.instance().log(datasets);
            return datasets;

        } catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    private getFhirStoreList = async () => {
        try {

            const g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();

            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}`;
            const request = { parent };
            const stores = await g.projects.locations.datasets.fhirStores.list(
                request
            );

            return stores;

        } catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    private getDicomStoreList = async () => {
        try {

            const g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();

            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}`;
            const request = { parent };
            const stores = await g.projects.locations.datasets.dicomStores.list(
                request
            );

            //Logger.instance().log(stores);
            return stores;

        } catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    private findDefaultDataset = (datasets) => {
        
        const c = GcpHelper.getGcpFhirConfig();

        const datasetPath = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}`;
        if (datasets.data.datasets && datasets.data.datasets.length > 0) {
            for (var d of datasets.data.datasets) {
                if (d.name === datasetPath) {
                    return d;
                }
            }
        }
        return null;
    };

    private findDefaultFhirStore = (stores) => {

        const c = GcpHelper.getGcpFhirConfig();

        const storePath = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
        if (stores.data.fhirStores && stores.data.fhirStores.length > 0) {
            for (var s of stores.data.fhirStores) {
                if (s.name === storePath) {
                    return s;
                }
            }
        }
        return null;
    };

    private findDefaultDicomStore = (stores) => {

        const c = GcpHelper.getGcpFhirConfig();

        const storePath = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/dicomStores/${c.DicomStoreId}`;
        if (stores.data.dicomStores && stores.data.dicomStores.length > 0) {
            for (var s of stores.data.dicomStores) {
                if (s.name === storePath) {
                    return s;
                }
            }
        }
        return null;
    };

    private getDefaultFhirStoreMetadata = async () => {

        const g = await GcpHelper.getGcpClient();
        const c = GcpHelper.getGcpFhirConfig();

        const name = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/metadata`;
        const request = { name };
        const fhirStore = await g.projects.locations.datasets.fhirStores.get(request);

        //Logger.instance().log(JSON.stringify(fhirStore.data, null, 2));
        return fhirStore.data;
    };

    //#endregion

}
