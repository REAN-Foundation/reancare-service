import { CareplanActivity } from "../../../domain.types/clinical/careplan/activity/careplan.activity";
import { IBloodWarriorService } from "../interface/community.network.interface";
import { injectable } from "tsyringe";

@injectable()
export class DonorNetworkService implements IBloodWarriorService {

    fetchActivities(careplanCode: string, enrollmentId: string, participantId?: string,
        fromDate?: Date, toDate?: Date): Promise<CareplanActivity[]> {
        throw new Error("Method not implemented.");
    }

    public providerName(): string {
        return "REAN_BW";
    }
    
}
