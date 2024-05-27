import { inject, injectable } from 'tsyringe';
import { IPersonRepo } from '../../../database/repository.interfaces/person/person.repo.interface';
import { IUserRepo } from '../../../database/repository.interfaces/users/user/user.repo.interface';
import { BridgeSearchFilters, BridgeSearchResults } from '../../../domain.types/assorted/blood.donation/bridge/bridge.search.types';
import { IBridgeRepo } from '../../../database/repository.interfaces/assorted/blood.donation/bridge.repo.interface';
import { BridgeDomainModel } from '../../../domain.types/assorted/blood.donation/bridge/bridge.domain.model';
import { BridgeDto } from '../../../domain.types/assorted/blood.donation/bridge/bridge.dto';
import { TimeHelper } from "../../../common/time.helper";
import { IDonorRepo } from '../../../database/repository.interfaces/assorted/blood.donation/donor.repo.interface';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BridgeService {

    constructor(
        @inject('IBridgeRepo') private _bridgeRepo: IBridgeRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IDonorRepo') private _donorRepo: IDonorRepo
    ) {}

    //#region Publics

    public create = async (model: BridgeDomainModel): Promise<BridgeDto> => {

        var dto = await this._bridgeRepo.create(model);
        dto = await this.updateDetailsDto(dto);

        return dto;
    };

    public getById = async (id: string): Promise<BridgeDto> => {
        var dto = await this._bridgeRepo.getById(id);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public search = async (
        filters: BridgeSearchFilters
    ): Promise<BridgeSearchResults> => {
        var items = [];
        var results = await this._bridgeRepo.search(filters);
        for await (var dto of results.Items) {
            if (filters.OnlyElligible === true) {
                dto = await this.elligibleDonors(dto);
            } else {
                dto = await this.updateDetailsDto(dto);
            }
            if (dto === null) {
                continue;
            }
            items.push(dto);
        }
        results.Items = items;
        results.RetrievedCount = items.length;
        return results;
    };

    public update = async (
        id: string,
        updateModel: BridgeDomainModel
    ): Promise<BridgeDto> => {
        var dto = await this._bridgeRepo.update(id, updateModel);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public delete = async (id: string): Promise<boolean> => {
        return await this._bridgeRepo.delete(id);
    };

    //#endregion

    //#region Privates

    private updateDetailsDto = async (dto: BridgeDto): Promise<BridgeDto> => {
        if (dto == null) {
            return null;
        }
        var donor = await this._donorRepo.getByUserId(dto.DonorUserId);
        if (donor == null) {
            return null;
        }
        const user = await this._userRepo.getById(dto.DonorUserId);
        dto.Donor = donor;
        const person = await this._personRepo.getById(user.PersonId);
        dto.DonorGender = person.Gender;
        dto.DonorName = person.DisplayName;
        dto.DonorPhone = person.Phone;
        return dto;
    };

    private elligibleDonors = async (dto: BridgeDto): Promise<BridgeDto > => {
        if (dto == null) {
            return null;
        }
        const user = await this._userRepo.getById(dto.DonorUserId);
        var donor = await this._donorRepo.getByUserId(dto.DonorUserId);
        dto.Donor = donor;
        if (user.Person == null) {
            user.Person = await this._personRepo.getById(user.PersonId);
        }
        dto.DonorGender = user.Person.Gender;
        dto.DonorName = user.Person.DisplayName;
        dto.DonorPhone =  user.Person.Phone;
        if (user.Person.Gender === 'Male' ) {
            const dayDiff = Math.floor(TimeHelper.dayDiff(new Date(), dto.LastDonationDate));
            return dayDiff > 90 ? dto : null;
        }
        else if (user.Person.Gender === 'Female' ) {
            const dayDiff = Math.floor(TimeHelper.dayDiff(new Date(), dto.LastDonationDate));
            return dayDiff > 120 ? dto : null;
        }
    };

    //#endregion

}
