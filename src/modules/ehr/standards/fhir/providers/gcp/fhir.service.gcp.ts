import { IStorageService } from '../../../../interfaces/storage.service.interface';
import { google, healthcare_v1 } from 'googleapis';
const healthcare = google.healthcare('v1');

////////////////////////////////////////////////////////////////////////////////

export class GcpFhirStoreService implements IStorageService {

    //#region gcp fhir parameters

    _projectId: string = process.env.GCP_PROJECT_ID;
    _cloudRegion: string = process.env.GCP_FHIR_CLOUD_REGION;
    _datasetId: string = process.env.GCP_FHIR_DATASET_ID;
    _fhirStoreId: string = process.env.GCP_FHIR_STORE_NAME;
    _dicomStoreId: string = process.env.GCP_DICOM_STORE_NAME;
    _fhirVersion: string = process.env.GCP_FHIR_CURRENT_VERSION;

    _defaultDataset: healthcare_v1.Schema$Dataset = null;
    _defaultFhirStore: healthcare_v1.Schema$FhirStore = null;
    _defaultDicomStore: healthcare_v1.Schema$DicomStore = null;

    //#endregion

    //#region properties

    public get projectId(): string {
        return this._projectId;
    }

    public get cloudRegion(): string {
        return this._cloudRegion;
    }

    public get datasetId(): string {
        return this._datasetId;
    }

    public get fhirStoreId(): string {
        return this._fhirStoreId;
    }

    public get dicomStoreId(): string {
        return this._dicomStoreId;
    }

    public get defaultDataset(): healthcare_v1.Schema$Dataset {
        return this._defaultDataset;
    }

    public get defaultFhirStore(): healthcare_v1.Schema$FhirStore {
        return this._defaultFhirStore;
    }
    
    public get defaultDicomStore(): healthcare_v1.Schema$DicomStore {
        return this._defaultDicomStore;
    }
    
    public get fhirVersion(): string {
        return this._fhirVersion;
    }

    //#endregion

    //#region public methods

    public initialize = async (): Promise<boolean> => {
        try {

            var datasets = await this.getDatasetList();
            this._defaultDataset = this.findDefaultDataset(datasets);
            if (this._defaultDataset == null) {
                this._defaultDataset = await this.createDataset();
            }

            var fhirStores = await this.getFhirStoreList();
            this._defaultFhirStore = this.findDefaultFhirStore(fhirStores);
            if (this._defaultFhirStore == null) {
                this._defaultFhirStore = await this.createFhirStore();
            }

            var dicomStores = await this.getDicomStoreList();
            this._defaultDicomStore = this.findDefaultDicomStore(dicomStores);
            if (this._defaultDicomStore == null) {
                this._defaultDicomStore = await this.createDicomStore();
            }

            var metadata = await this.getDefaultFhirStoreMetadata();
            console.log(JSON.stringify(metadata, null, 2));

            return true;

        } catch (error) {
            console.log(
                'Error initializing GCP dataset/fhir-store. Error: ' +
                    error.message
            );
        }
    };

    //#endregion

    //#region Private methods

    private setClientAuth = async () => {
        const auth = await google.auth.getClient({
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });
        google.options({ auth });
    };

    private createDataset = async () => {
        await this.setClientAuth();

        var parent = `projects/${this._projectId}/locations/${this._cloudRegion}`;
        var datasetId: string = this._datasetId;
        var create_dataset_request = { parent, datasetId };
        await healthcare.projects.locations.datasets.create(
            create_dataset_request
        );
        parent = `projects/${this._projectId}/locations/${this._cloudRegion}/datasets/${this._datasetId}`;
        var get_dataset_request = { name: parent };
        const dataset = await healthcare.projects.locations.datasets.get(
            get_dataset_request
        );
        console.log(dataset.data);
        return dataset.data;
    };

    private createFhirStore = async () => {
        try {
            await this.setClientAuth();

            var parent = `projects/${this._projectId}/locations/${this._cloudRegion}/datasets/${this._datasetId}`;

            var fhirStoreId: string = this._fhirStoreId;
            var version: string = this._fhirVersion;
            var create_store_request = {
                parent,
                fhirStoreId,
                resource: {
                    version,
                },
            };
            await healthcare.projects.locations.datasets.fhirStores.create(
                create_store_request
            );

            parent = `projects/${this._projectId}/locations/${this._cloudRegion}/datasets/${this._datasetId}/fhirStores/${this._fhirStoreId}`;
            var request = { name: parent };
            const store = await healthcare.projects.locations.datasets.fhirStores.get(
                request
            );
            console.log(store.data);
            return store.data;
        } catch (error) {
            throw error;
        }
    };

    private createDicomStore = async () => {
        try {
            await this.setClientAuth();

            var parent = `projects/${this._projectId}/locations/${this._cloudRegion}/datasets/${this._datasetId}`;

            var dicomStoreId: string = this._dicomStoreId;
            var create_store_request = {
                parent,
                dicomStoreId
            };
            await healthcare.projects.locations.datasets.dicomStores.create(
                create_store_request
            );

            parent = `projects/${this._projectId}/locations/${this._cloudRegion}/datasets/${this._datasetId}/dicomStores/${this._dicomStoreId}`;
            var request = { name: parent };
            const store = await healthcare.projects.locations.datasets.dicomStores.get(
                request
            );
            console.log(store.data);
            return store.data;
        } catch (error) {
            throw error;
        }
    };

    private getDefaultDataset = async () => {
        try {
            await this.setClientAuth();

            const parent = `projects/${this._projectId}/locations/${this._cloudRegion}/datasets/${this._datasetId}`;
            const request = { name: parent };
            const dataset = await healthcare.projects.locations.datasets.get(
                request
            );
            console.log(dataset.data);
            return dataset.data;
        } catch (error) {
            console.log(error.message);
            return null;
        }
    };

    private getDefaultFhirStore = async () => {
        
        await this.setClientAuth();

        var parent = `projects/${this._projectId}/locations/${this._cloudRegion}/datasets/${this._datasetId}/fhirStores/${this._fhirStoreId}`;
        const store = await healthcare.projects.locations.datasets.fhirStores.get(
            { name: parent }
        );
        console.log(store.data);
        return store.data;
    };

    private getDefaultDicomStore = async () => {
        
        await this.setClientAuth();

        var parent = `projects/${this._projectId}/locations/${this._cloudRegion}/datasets/${this._datasetId}/dicomStores/${this._dicomStoreId}`;
        const store = await healthcare.projects.locations.datasets.dicomStores.get(
            { name: parent }
        );
        console.log(store.data);
        return store.data;
    };

    private getDatasetList = async () => {
        try {
            await this.setClientAuth();

            const parent = `projects/${this._projectId}/locations/${this._cloudRegion}`;
            const request = { parent };
            const datasets = await healthcare.projects.locations.datasets.list(
                request
            );
            console.log(datasets);
            return datasets;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    };

    private getFhirStoreList = async () => {
        try {
            await this.setClientAuth();

            const parent = `projects/${this._projectId}/locations/${this._cloudRegion}/datasets/${this._datasetId}`;
            const request = { parent };
            const stores = await healthcare.projects.locations.datasets.fhirStores.list(
                request
            );
            console.log(stores);
            return stores;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    };

    private getDicomStoreList = async () => {
        try {
            await this.setClientAuth();

            const parent = `projects/${this._projectId}/locations/${this._cloudRegion}/datasets/${this._datasetId}`;
            const request = { parent };
            const stores = await healthcare.projects.locations.datasets.dicomStores.list(
                request
            );
            console.log(stores);
            return stores;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    };

    private findDefaultDataset = (datasets) => {
        const datasetPath = `projects/${this._projectId}/locations/${this._cloudRegion}/datasets/${this._datasetId}`;
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
        const storePath = `projects/${this._projectId}/locations/${this._cloudRegion}/datasets/${this._datasetId}/fhirStores/${this._fhirStoreId}`;
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
        const storePath = `projects/${this._projectId}/locations/${this._cloudRegion}/datasets/${this._datasetId}/dicomStores/${this._dicomStoreId}`;
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
        
        await this.setClientAuth();

        const name = `projects/${this._projectId}/locations/${this._cloudRegion}/datasets/${this._datasetId}/fhirStores/${this._fhirStoreId}/fhir/metadata`;
        const request = { name };
        const fhirStore =
            await healthcare.projects.locations.datasets.fhirStores.get(
                request
            );
        console.log(JSON.stringify(fhirStore.data, null, 2));
        return fhirStore.data;
    }

    //#endregion

}
