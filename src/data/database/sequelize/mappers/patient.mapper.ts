import { UserDomainModel } from "../../../domain.types/user.domain.types";
import { UserRepo } from "../repositories/user.repo";
import Patient from '../models/patient.model';
import { PatientDetailsDto, PatientDomainModel, PatientDto } from "../../../domain.types/patient.domain.types";
import { AddressRepo } from "../repositories/address.repo";
import { UserMapper } from "./user.mapper";

///////////////////////////////////////////////////////////////////////////////////

export class PatientMapper {


    static toDetailsDto = async (patient: Patient): Promise<PatientDetailsDto> => {

        if(patient == null){
            return null;
        }

        var userRepo = new UserRepo();
        const user = await userRepo.getById(patient.UserId);

        var addressRepo = new AddressRepo();
        const addresses = await addressRepo.getByPersonId(user.Person.id);

        var dto: PatientDetailsDto = {
            id: patient.id,
            User: user,
            DisplayId: patient.DisplayId,
            EhrId: patient.EhrId,
            Addresses: addresses,
            MedicalProfile: null, //PatientMedicalProfileDto;
            Insurances: [], //PatientInsuranceDto[];
            EmergencyContacts: [], // PatientEmergencyContactDto[];
        };
        return dto;
    }

    static toDto = async (patient: Patient): Promise<PatientDto> => {

        if(patient == null){
            return null;
        }

        var userRepo = new UserRepo();
        const user = await userRepo.getById(patient.UserId);

        var dto: PatientDto = {
            id: patient.id,
            UserId: user.id,
            DisplayId: patient.DisplayId,
            EhrId: patient.EhrId,
            DisplayName: user.Person.DisplayName,
            UserName: user.UserName,
            Phone: user.Person.Phone,
            Email: user.Person.Email,
            Gender: user.Person.Gender,
            BirthDate: user.Person.BirthDate,
            Age: user.Person.Age,
        };
        return dto; 
    }
}