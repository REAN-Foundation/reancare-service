
export interface IFeatureFlagsService {

    init(): Promise<boolean>;

    providerName(): string;

    flagExists(key: string): Promise<boolean>;

    isEnabled(key: string): Promise<boolean>;

}
