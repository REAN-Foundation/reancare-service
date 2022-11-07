import { NoticeActionDto } from '../../../../../domain.types/general/notice.action/notice.action.dto';
import { NoticeDto } from '../../../../../domain.types/general/notice/notice.dto';
import NoticeAction from '../../models/general/notice/notice.action.model';
import NoticeModel from '../../models/general/notice/notice.model';

///////////////////////////////////////////////////////////////////////////////////

export class NoticeMapper {

    static toDto = (
        notice: NoticeModel, actionByCurrentUser?: any): NoticeDto => {
        if (notice == null) {
            return null;
        }

        var tags = [];
        if (notice.Tags !== null && notice.Tags !== undefined) {
            tags = JSON.parse(notice.Tags);
        }

        const dto: NoticeDto = {
            id          : notice.id,
            Title       : notice.Title,
            Description : notice.Description,
            Link        : notice.Link,
            PostDate    : notice.PostDate,
            EndDate     : notice.EndDate,
            DaysActive  : notice.DaysActive,
            IsActive    : notice.IsActive,
            Tags        : tags,
            ImageUrl    : notice.ImageUrl,
            Action      : notice.Action,
            UserAction  : actionByCurrentUser,
        };
        return dto;
    };

    static toActionDto = (
        noticeAction: NoticeAction): NoticeActionDto => {
        if (noticeAction == null) {
            return null;
        }

        var contents = [];
        if (noticeAction.Contents !== null && noticeAction.Contents !== undefined) {
            contents = JSON.parse(noticeAction.Contents);
        }

        const actionDto: NoticeActionDto = {
            id       : noticeAction.id,
            UserId   : noticeAction.UserId,
            NoticeId : noticeAction.NoticeId,
            Notice   : noticeAction.Notice,
            Action   : noticeAction.Action,
            Contents : contents

        };
        return actionDto;
    };

}
