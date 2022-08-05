import { uuid } from "../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { INoticeRepo } from "../../database/repository.interfaces/general/notice.repo.interface";
import { NoticeDomainModel } from '../../domain.types/general/notice/notice.domain.model';
import { NoticeDto } from '../../domain.types/general/notice/notice.dto';
import { NoticeSearchFilters, NoticeSearchResults } from '../../domain.types/general/notice/notice.search.types';
import { TimeHelper } from "../../common/time.helper";
import { DurationType } from "../../domain.types/miscellaneous/time.types";
import { NoticeActionDomainModel } from "../../domain.types/general/notice.action/notice.action.domain.model";
import { NoticeActionDto } from "../../domain.types/general/notice.action/notice.action.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class NoticeService {

    constructor(
        @inject('INoticeRepo') private _noticeRepo: INoticeRepo,
    ) {}

    create = async (noticeDomainModel: NoticeDomainModel):
    Promise<NoticeDto> => {
        var endDate = TimeHelper.addDuration(noticeDomainModel.PostDate,
            noticeDomainModel.DaysActive, DurationType.Day);
        noticeDomainModel.EndDate = endDate;
        return await this._noticeRepo.create(noticeDomainModel);
    };

    getById = async (id: uuid): Promise<NoticeDto> => {
        return await this._noticeRepo.getById(id);
    };

    search = async (filters: NoticeSearchFilters): Promise<NoticeSearchResults> => {
        return await this._noticeRepo.search(filters);
    };

    update = async (id: uuid, noticeDomainModel: NoticeDomainModel):
    Promise<NoticeDto> => {
        return await this._noticeRepo.update(id, noticeDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._noticeRepo.delete(id);
    };

    createAction = async (noticeActionDomainModel: NoticeActionDomainModel): Promise<NoticeActionDto> => {
        return await this._noticeRepo.createAction(noticeActionDomainModel);
    };

    getActionById = async (id: uuid): Promise<NoticeActionDto> => {
        return await this._noticeRepo.getActionById(id);
    };

}
