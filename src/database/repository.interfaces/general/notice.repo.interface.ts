import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { NoticeActionDomainModel } from "../../../domain.types/general/notice.action/notice.action.domain.model";
import { NoticeActionDto } from "../../../domain.types/general/notice.action/notice.action.dto";
import { NoticeDomainModel } from "../../../domain.types/general/notice/notice.domain.model";
import { NoticeDto } from "../../../domain.types/general/notice/notice.dto";
import { NoticeSearchFilters, NoticeSearchResults } from "../../../domain.types/general/notice/notice.search.types";

export interface INoticeRepo {

    create(noticeDomainModel: NoticeDomainModel): Promise<NoticeDto>;

    getNotice(id: uuid): Promise<NoticeDto>;

    search(filters: NoticeSearchFilters, currentUserId: uuid): Promise<NoticeSearchResults>;

    updateNotice(id: uuid, noticeDomainModel: NoticeDomainModel): Promise<NoticeDto>;

    deleteNotice(id: uuid): Promise<boolean>;

    takeAction(noticeActionDomainModel: NoticeActionDomainModel): Promise<NoticeActionDto>;

    getNoticeActionForUser(noticeId: uuid, userId: uuid): Promise<NoticeActionDto>;

    getAllNoticeActionsForUser(userId: uuid): Promise<NoticeActionDto[]>;

}
