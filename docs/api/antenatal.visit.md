# Antenatal visit API

The Antenatal Visit API allows healthcare systems to record and manage antenatal (prenatal) visits for pregnant patients.
Each visit captures key information such as gestation in weeks, fundal height, fetal heart rate, and biometric identifiers.

Antenatal visits are linked to a specific pregnancy and help monitor the ongoing health of both mother and baby.

## POST
Add antenatal visit details for a specific pregnancy.
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}/antenatal-visit**

---


**📥 Request Body**
```json
{
    "VisitId": "{{VISIT_ID}}",
    "ExternalVisitId": "ext-visit-456",
    "PregnancyId": "{{PREGNANCY_ID}}",
    "PatientUserId": "{{PATIENT_USER_ID}}",
    "DateOfVisit": "2024-08-10T10:00:00Z",
    "GestationInWeeks": 28,
    "FetalHeartRateBPM": 140,
    "FundalHeight": {
        "Weeks": "5",
        "Centimeters": "28.5"
    },
    "DateOfNextVisit": "2024-08-24T10:00:00Z",
    "BodyWeightID": "{{BODY_WEIGHT_ID}}",
    "BodyTemperatureId": "{{BIOMETRICS_BODY_TEMPERATURE_ID}}",
    "BloodPressureId": "{{BIOMETRICS_BLOOD_PRESSURE_ID}}"
}
```

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Antenatal visit record created successfully!",
    "HttpCode": 201,
    "Data": {
        "AntenatalVisit": {
            "id": "bdbd13b7-1efd-410c-b5e8-47a795906569",
            "VisitId": "fda7b26a-9abe-4b20-8bdc-8dfb4657b798",
            "PregnancyId": "b63f6de4-7c7d-4746-8254-561064968d6a",
            "PatientUserId": "219c7eae-4c39-4a94-9740-c2be428dbec5",
            "DateOfVisit": "2024-08-10T10:00:00.000Z",
            "GestationInWeeks": 28,
            "FetalHeartRateBPM": 140,
            "FundalHeight": {
                "Weeks": "5",
                "Centimeters": "28.5"
            },
            "DateOfNextVisit": "2024-08-24T10:00:00.000Z",
            "BodyWeightID": "e92aa203-237b-4c71-8e9c-09091713dbaf",
            "BodyTemperatureId": "e273f280-684e-4703-8b5a-c46324f8f082",
            "BloodPressureId": "1b20959e-a7da-452f-8f06-14b3ac6b3df5"
        }
    }
}
```
## GET
Retrive antenatal visit details for a specific pregnancy.
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}/antenatal-visit/{{ANTENATAL_VISIT_ID}}**
---

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Antenatal visit record retrived successfully!",
    "HttpCode": 201,
    "Data": {
        "AntenatalVisit": {
            "id": "bdbd13b7-1efd-410c-b5e8-47a795906569",
            "VisitId": "fda7b26a-9abe-4b20-8bdc-8dfb4657b798",
            "PregnancyId": "b63f6de4-7c7d-4746-8254-561064968d6a",
            "PatientUserId": "219c7eae-4c39-4a94-9740-c2be428dbec5",
            "DateOfVisit": "2024-08-10T10:00:00.000Z",
            "GestationInWeeks": 28,
            "FetalHeartRateBPM": 140,
            "FundalHeight": {
                "Weeks": "5",
                "Centimeters": "28.5"
            },
            "DateOfNextVisit": "2024-08-24T10:00:00.000Z",
            "BodyWeightID": "e92aa203-237b-4c71-8e9c-09091713dbaf",
            "BodyTemperatureId": "e273f280-684e-4703-8b5a-c46324f8f082",
            "BloodPressureId": "1b20959e-a7da-452f-8f06-14b3ac6b3df5"
        }
    }
}
```
## UPDATE
Update antenatal visit details for a specific pregnancy.
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}/antenatal-visit/{{ANTENATAL_VISIT_ID}}**
---


**📥 Request Body**
```json
{
    "VisitId": "{{VISIT_ID}}",
    "ExternalVisitId": "ext-visit-456",
    "PregnancyId": "{{PREGNANCY_ID}}",
    "PatientUserId": "{{PATIENT_USER_ID}}",
    "DateOfVisit": "2024-08-10T10:00:00Z",
    "GestationInWeeks": 28,
    "FetalHeartRateBPM": 140,
    "FundalHeight": {
        "Weeks": "5",
        "Centimeters": "28.5"
    },
    "DateOfNextVisit": "2024-08-24T10:00:00Z",
    "BodyWeightID": "{{BODY_WEIGHT_ID}}",
    "BodyTemperatureId": "{{BIOMETRICS_BODY_TEMPERATURE_ID}}",
    "BloodPressureId": "{{BIOMETRICS_BLOOD_PRESSURE_ID}}"
}
```

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Antenatal visit record updated successfully!",
    "HttpCode": 200,
    "Data": {
        "AntenatalVisit": {
            "id": "bdbd13b7-1efd-410c-b5e8-47a795906569",
            "VisitId": "fda7b26a-9abe-4b20-8bdc-8dfb4657b798",
            "PregnancyId": "b63f6de4-7c7d-4746-8254-561064968d6a",
            "PatientUserId": "219c7eae-4c39-4a94-9740-c2be428dbec5",
            "DateOfVisit": "2024-08-10T10:00:00.000Z",
            "GestationInWeeks": 28,
            "FetalHeartRateBPM": 140,
            "FundalHeight": {
                "Weeks": "5",
                "Centimeters": "28.5"
            },
            "DateOfNextVisit": "2024-08-24T10:00:00.000Z",
            "BodyWeightID": "e92aa203-237b-4c71-8e9c-09091713dbaf",
            "BodyTemperatureId": "e273f280-684e-4703-8b5a-c46324f8f082",
            "BloodPressureId": "1b20959e-a7da-452f-8f06-14b3ac6b3df5"
        }
    }
}
```
## DELETE

Delete antenatal visit details for a specific pregnancy.
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}/antenatal-visit/{{ANTENATAL_VISIT_ID}}**
---

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Antenatal visit record deleted successfully!",
    "HttpCode": 200,
    "Data": {
        "Deleted": true
    }
}
```