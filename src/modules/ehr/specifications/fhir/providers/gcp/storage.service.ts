import { IStorageService } from '../../../../interfaces/storage.service.interface';
import { google, healthcare_v1 } from 'googleapis';
import { Logger } from '../../../../../../common/logger';

const healthcare = google.healthcare({
    version : 'v1',
    headers : { 'Content-Type': 'application/fhir+json' }
});

////////////////////////////////////////////////////////////////////////////////

export class GcpStorageService implements IStorageService {

    //#region gcp fhir parameters

    static _projectId: string = process.env.GCP_PROJECT_ID;

    static _cloudRegion: string = process.env.GCP_FHIR_CLOUD_REGION;

    static _datasetId: string = process.env.GCP_FHIR_DATASET_ID;

    static _fhirStoreId: string = process.env.GCP_FHIR_STORE_NAME;

    static _dicomStoreId: string = process.env.GCP_DICOM_STORE_NAME;

    static _fhirVersion: string = process.env.GCP_FHIR_CURRENT_VERSION;

    static _defaultDataset: healthcare_v1.Schema$Dataset = null;

    static _defaultFhirStore: healthcare_v1.Schema$FhirStore = null;

    static _defaultDicomStore: healthcare_v1.Schema$DicomStore = null;

    static _healthcare: healthcare_v1.Healthcare = null;

    //#endregion

    //#region properties

    public static get projectId(): string {
        return GcpStorageService._projectId;
    }

    public static get cloudRegion(): string {
        return GcpStorageService._cloudRegion;
    }

    public static get datasetId(): string {
        return GcpStorageService._datasetId;
    }

    public static get fhirStoreId(): string {
        return GcpStorageService._fhirStoreId;
    }

    public static get dicomStoreId(): string {
        return GcpStorageService._dicomStoreId;
    }

    public static get defaultDataset(): healthcare_v1.Schema$Dataset {
        return GcpStorageService._defaultDataset;
    }

    public static get defaultFhirStore(): healthcare_v1.Schema$FhirStore {
        return GcpStorageService._defaultFhirStore;
    }

    public static get defaultDicomStore(): healthcare_v1.Schema$DicomStore {
        return GcpStorageService._defaultDicomStore;
    }

    public static get fhirVersion(): string {
        return GcpStorageService._fhirVersion;
    }

    public static get healthcare(): healthcare_v1.Healthcare {
        return GcpStorageService._healthcare;
    }

    //#endregion

    //#region public methods

    public init = async (): Promise<boolean> => {
        try {
            Logger.instance().log('Connecting to EHR store...');

            await this.setClientAuth();
            GcpStorageService._healthcare = healthcare;

            const datasets = await this.getDatasetList();
            GcpStorageService._defaultDataset = this.findDefaultDataset(datasets);
            if (GcpStorageService._defaultDataset == null) {
                GcpStorageService._defaultDataset = await this.createDataset();
            }

            const fhirStores = await this.getFhirStoreList();
            GcpStorageService._defaultFhirStore = this.findDefaultFhirStore(fhirStores);
            if (GcpStorageService._defaultFhirStore == null) {
                GcpStorageService._defaultFhirStore = await this.createFhirStore();
            }

            const dicomStores = await this.getDicomStoreList();
            GcpStorageService._defaultDicomStore = this.findDefaultDicomStore(dicomStores);
            if (GcpStorageService._defaultDicomStore == null) {
                GcpStorageService._defaultDicomStore = await this.createDicomStore();
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

    private setClientAuth = async () => {
        const auth = await google.auth.getClient({
            scopes : ['https://www.googleapis.com/auth/cloud-platform'],
        });
        google.options({ auth });
    };

    private createDataset = async () => {
        let parent = `projects/${GcpStorageService._projectId}/locations/${GcpStorageService._cloudRegion}`;

        const datasetId: string = GcpStorageService._datasetId;
        const create_dataset_request = { parent, datasetId };
        await GcpStorageService.healthcare.projects.locations.datasets.create(create_dataset_request);
        parent = `projects/${GcpStorageService._projectId}/locations/${GcpStorageService._cloudRegion}/datasets/${GcpStorageService._datasetId}`;
        const get_dataset_request = { name: parent };
        const dataset = await GcpStorageService.healthcare.projects.locations.datasets.get(
            get_dataset_request
        );

        //Logger.instance().log(dataset.data);
        return dataset.data;
    };

    private createFhirStore = async () => {
        let parent = `projects/${GcpStorageService._projectId}/locations/${GcpStorageService._cloudRegion}/datasets/${GcpStorageService._datasetId}`;

        const fhirStoreId: string = GcpStorageService._fhirStoreId;
        const version: string = GcpStorageService._fhirVersion;
        const create_store_request = {
            parent,
            fhirStoreId,
            resource : {
                version,
            },
        };
        await GcpStorageService.healthcare.projects.locations.datasets.fhirStores.create(
            create_store_request
        );

        parent = `projects/${GcpStorageService._projectId}/locations/${GcpStorageService._cloudRegion}/datasets/${GcpStorageService._datasetId}/fhirStores/${GcpStorageService._fhirStoreId}`;
        const request = { name: parent };
        const store = await GcpStorageService.healthcare.projects.locations.datasets.fhirStores.get(request);

        //Logger.instance().log(store.data);
        return store.data;
    };

    private createDicomStore = async () => {
        let parent = `projects/${GcpStorageService._projectId}/locations/${GcpStorageService._cloudRegion}/datasets/${GcpStorageService._datasetId}`;

        const dicomStoreId: string = GcpStorageService._dicomStoreId;
        const create_store_request = {
            parent,
            dicomStoreId,
        };
        await GcpStorageService.healthcare.projects.locations.datasets.dicomStores.create(
            create_store_request
        );

        parent = `projects/${GcpStorageService._projectId}/locations/${GcpStorageService._cloudRegion}/datasets/${GcpStorageService._datasetId}/dicomStores/${GcpStorageService._dicomStoreId}`;
        const request = { name: parent };
        const store = await GcpStorageService.healthcare.projects.locations.datasets.dicomStores.get(request);

        //Logger.instance().log(store.data);
        return store.data;
    };

    private getDefaultDataset = async () => {
        try {
            const parent = `projects/${GcpStorageService._projectId}/locations/${GcpStorageService._cloudRegion}/datasets/${GcpStorageService._datasetId}`;
            const request = { name: parent };
            const dataset = await GcpStorageService.healthcare.projects.locations.datasets.get(request);

            //Logger.instance().log(dataset.data);
            return dataset.data;
        } catch (error) {
            Logger.instance().log(error.message);
            return null;
        }
    };

    private getDefaultFhirStore = async () => {
        const parent = `projects/${GcpStorageService._projectId}/locations/${GcpStorageService._cloudRegion}/datasets/${GcpStorageService._datasetId}/fhirStores/${GcpStorageService._fhirStoreId}`;
        const store = await GcpStorageService.healthcare.projects.locations.datasets.fhirStores.get({
            name : parent,
        });

        //Logger.instance().log(store.data);
        return store.data;
    };

    private getDefaultDicomStore = async () => {
        const parent = `projects/${GcpStorageService._projectId}/locations/${GcpStorageService._cloudRegion}/datasets/${GcpStorageService._datasetId}/dicomStores/${GcpStorageService._dicomStoreId}`;
        const store = await GcpStorageService.healthcare.projects.locations.datasets.dicomStores.get({
            name : parent,
        });

        //Logger.instance().log(store.data);
        return store.data;
    };

    private getDatasetList = async () => {
        try {
            const parent = `projects/${GcpStorageService._projectId}/locations/${GcpStorageService._cloudRegion}`;
            const request = { parent };
            const datasets = await GcpStorageService.healthcare.projects.locations.datasets.list(request);

            //Logger.instance().log(datasets);
            return datasets;
        } catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    private getFhirStoreList = async () => {
        try {
            const parent = `projects/${GcpStorageService._projectId}/locations/${GcpStorageService._cloudRegion}/datasets/${GcpStorageService._datasetId}`;
            const request = { parent };
            const stores = await GcpStorageService.healthcare.projects.locations.datasets.fhirStores.list(
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
            const parent = `projects/${GcpStorageService._projectId}/locations/${GcpStorageService._cloudRegion}/datasets/${GcpStorageService._datasetId}`;
            const request = { parent };
            const stores = await GcpStorageService.healthcare.projects.locations.datasets.dicomStores.list(
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
        const datasetPath = `projects/${GcpStorageService._projectId}/locations/${GcpStorageService._cloudRegion}/datasets/${GcpStorageService._datasetId}`;
        if (datasets.data.datasets && datasets.data.datasets.length > 0) {
            for (const d of datasets.data.datasets) {
                if (d.name === datasetPath) {
                    return d;
                }
            }
        }
        return null;
    };

    private findDefaultFhirStore = (stores) => {
        const storePath = `projects/${GcpStorageService._projectId}/locations/${GcpStorageService._cloudRegion}/datasets/${GcpStorageService._datasetId}/fhirStores/${GcpStorageService._fhirStoreId}`;
        if (stores.data.fhirStores && stores.data.fhirStores.length > 0) {
            for (const s of stores.data.fhirStores) {
                if (s.name === storePath) {
                    return s;
                }
            }
        }
        return null;
    };

    private findDefaultDicomStore = (stores) => {
        const storePath = `projects/${GcpStorageService._projectId}/locations/${GcpStorageService._cloudRegion}/datasets/${GcpStorageService._datasetId}/dicomStores/${GcpStorageService._dicomStoreId}`;
        if (stores.data.dicomStores && stores.data.dicomStores.length > 0) {
            for (const s of stores.data.dicomStores) {
                if (s.name === storePath) {
                    return s;
                }
            }
        }
        return null;
    };

    private getDefaultFhirStoreMetadata = async () => {
        const name = `projects/${GcpStorageService._projectId}/locations/${GcpStorageService._cloudRegion}/datasets/${GcpStorageService._datasetId}/fhirStores/${GcpStorageService._fhirStoreId}/fhir/metadata`;
        const request = { name };
        const fhirStore = await GcpStorageService.healthcare.projects.locations.datasets.fhirStores.get(
            request
        );

        //Logger.instance().log(JSON.stringify(fhirStore.data, null, 2));
        return fhirStore.data;
    };

    //#endregion

}
