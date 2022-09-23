import { NoticeActionDomainModel } from "../../../domain.types/general/notice.action/notice.action.domain.model";
import { NoticeActionDto } from "../../../domain.types/general/notice.action/notice.action.dto";
import { NoticeDomainModel } from "../../../domain.types/general/notice/notice.domain.model";
import { NoticeDto } from "../../../domain.types/general/notice/notice.dto";
import { NoticeSearchFilters, NoticeSearchResults } from "../../../domain.types/general/notice/notice.search.types";

export interface INoticeRepo {

    create(noticeDomainModel: NoticeDomainModel): Promise<NoticeDto>;

    getById(id: string): Promise<NoticeDto>;
    
    search(filters: NoticeSearchFilters): Promise<NoticeSearchResults>;

    update(id: string, noticeDomainModel: NoticeDomainModel): Promise<NoticeDto>;

    delete(id: string): Promise<boolean>;

    createAction(noticeActionDomainModel: NoticeActionDomainModel): Promise<NoticeActionDto>;

    getActionById(id: string): Promise<NoticeActionDto>;

}
