import { HowDoYouFeelDomainModel } from "../../../../domain.types/symptom/how.do.you.feel/how.do.you.feel.domain.model";
import { HowDoYouFeelDto } from "../../../../domain.types/symptom/how.do.you.feel/how.do.you.feel.dto";
import { HowDoYouFeelSearchFilters, HowDoYouFeelSearchResults } from "../../../../domain.types/symptom/how.do.you.feel/how.do.you.feel.search.types";

export interface IHowDoYouFeelRepo {

    create(addressDomainModel: HowDoYouFeelDomainModel): Promise<HowDoYouFeelDto>;

    getById(id: string): Promise<HowDoYouFeelDto>;

    search(filters: HowDoYouFeelSearchFilters): Promise<HowDoYouFeelSearchResults>;

    update(id: string, addressDomainModel: HowDoYouFeelDomainModel): Promise<HowDoYouFeelDto>;

    delete(id: string): Promise<boolean>;

}
