import { BridgeDomainModel } from "../../../../domain.types/assorted/blood.donation/bridge/bridge.domain.model";
import { BridgeDto } from "../../../../domain.types/assorted/blood.donation/bridge/bridge.dto";
import { BridgeSearchFilters, BridgeSearchResults } from "../../../../domain.types/assorted/blood.donation/bridge/bridge.search.types";

export interface IBridgeRepo {

    create(entity: BridgeDomainModel): Promise<BridgeDto>;

    getById(userId: string): Promise<BridgeDto>;

    update(userId: string, updateModel: BridgeDomainModel): Promise<BridgeDto>;

    search(filters: BridgeSearchFilters): Promise<BridgeSearchResults>;

    delete(userId: string): Promise<boolean>;

}
