# Vaccination API

The Vaccination API allows healthcare systems to record and manage vaccinations administered to pregnant patients.  
It helps in tracking the type of vaccine, dose number, and administration details, ensuring proper maternal care throughout pregnancy.

Each vaccination record is associated with a pregnancy record and contributes to maintaining an accurate immunization history.

---

## POST

Add a vaccination record for a specific pregnancy:  
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}/vaccinations**

---

**📥 Request Body**
```json
{
    "PregnancyId": "{{PREGNANCY_ID}}",
    "VaccineName": "Tetanus Toxoid",
    "DoseNumber": 1,
    "DateAdministered": "2024-08-08T10:30:00Z",
    "MedicationId": "c234g2b3-56e7-8901-2345-67890abcdef1",
    "MedicationConsumptionId": "d345h3c4-67f8-9012-3456-78901abcdef2"
}
```
**📤 Response**
```json
{
    "Status": "success",
    "Message": "Vaccination record created successfully!",
    "HttpCode": 201,
    "Data": {
        "Vaccination": {
            "id": "e767dc3b-cd80-4f5a-8f12-f384c347492e",
            "PregnancyId": "42420315-74d3-4216-b641-d723fdadf1ae",
            "VaccineName": "Tetanus Toxoid",
            "DoseNumber": 1,
            "DateAdministered": "2024-08-08T10:30:00.000Z",
            "MedicationId": "c234g2b3-56e7-8901-2345-67890abcdef1",
            "MedicationConsumptionId": "d345h3c4-67f8-9012-3456-78901abcdef2"
        }
    }
}
```

## GET
Retrieve vaccination record by ID:
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}/vaccinations/{{VACCINATION_ID}}**

---
**📤 Response**
```json
{
    "Status": "success",
    "Message": "Vaccination record retrieved successfully!",
    "HttpCode": 200,
    "Data": {
        "Vaccination": {
            "id": "e767dc3b-cd80-4f5a-8f12-f384c347492e",
            "PregnancyId": "42420315-74d3-4216-b641-d723fdadf1ae",
            "VaccineName": "Tetanus Toxoid",
            "DoseNumber": 1,
            "DateAdministered": "2024-08-08T10:30:00.000Z",
            "MedicationId": "c234g2b3-56e7-8901-2345-67890abcdef1",
            "MedicationConsumptionId": "d345h3c4-67f8-9012-3456-78901abcdef2"
        }
    }
}
```
## UPDATE

Update a vaccination record for a specific pregnancy:  
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}/vaccinations/{{VACCINATION_ID}}**

---

**📥 Request Body**
```json
{
    "PregnancyId": "{{PREGNANCY_ID}}",
    "VaccineName": "Tetanus Toxoid",
    "DoseNumber": 1,
    "DateAdministered": "2024-08-08T10:30:00Z",
    "MedicationId": "c234g2b3-56e7-8901-2345-67890abcdef1",
    "MedicationConsumptionId": "d345h3c4-67f8-9012-3456-78901abcdef2"
}
```
**📤 Response**
```json
{
    "Status": "success",
    "Message": "Vaccination record updated successfully!",
    "HttpCode": 200,
    "Data": {
        "Vaccination": {
            "id": "e767dc3b-cd80-4f5a-8f12-f384c347492e",
            "PregnancyId": "42420315-74d3-4216-b641-d723fdadf1ae",
            "VaccineName": "Tetanus Toxoid",
            "DoseNumber": 1,
            "DateAdministered": "2024-08-08T10:30:00.000Z",
            "MedicationId": "c234g2b3-56e7-8901-2345-67890abcdef1",
            "MedicationConsumptionId": "d345h3c4-67f8-9012-3456-78901abcdef2"
        }
    }
}
```
## SEARCH

Search Pregnancy details of a patient by given search filter:
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}/vaccinations/search?PregnancyId={{PREGNANCY_ID}}&DoseNumber=1**

**📥 Query Parameters**

These are the optional filters you can pass in the request:

| Parameter                 | Type     | Description                                                     |
|--------------------------|----------|------------------------------------------------------------------|
| `PregnancyId`            | string   | UUID of the associated pregnancy record                          |
| `VaccineName`            | string   | Name of the vaccine administered                                 |
| `DoseNumber`             | number   | Dose number for the vaccination (e.g., 1st, 2nd dose)            |
| `DateAdministered`       | string (ISO 8601) | Date and time the vaccine was administered (e.g., `2024-08-08T10:30:00Z`) |
| `MedicationId`           | string   | UUID of the medication used during vaccination                    |
| `MedicationConsumptionId`| string   | UUID of the medication consumption record                         |

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Total 1 vaccination records retrieved successfully!",
    "HttpCode": 200,
    "Data": {
        "Vaccinations": {
            "TotalCount": 1,
            "RetrievedCount": 1,
            "PageIndex": 0,
            "ItemsPerPage": 25,
            "Order": "ascending",
            "OrderedBy": "CreatedAt",
            "Items": [
                {
                    "id": "e767dc3b-cd80-4f5a-8f12-f384c347492e",
                    "PregnancyId": "42420315-74d3-4216-b641-d723fdadf1ae",
                    "VaccineName": "Tetanus",
                    "DoseNumber": 1,
                    "DateAdministered": "2024-08-08T10:30:00.000Z",
                    "MedicationId": "c234g2b3-56e7-8901-2345-67890abcdef1",
                    "MedicationConsumptionId": "d345h3c4-67f8-9012-3456-78901abcdef2"
                }
            ]
        }
}
```

## DELETE

Delete vaccination details of a mother
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}/vaccinations/{{VACCINATION_ID}}**

---

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Vaccination record deleted successfully!",
    "HttpCode": 200,
    "Data": {
        "Deleted": true
    }
}
```