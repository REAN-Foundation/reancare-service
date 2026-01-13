# Pregnancy API

The Pregnancy API allows healthcare systems to manage pregnancy-related data for registered patients.  
This includes capturing critical information such as the **date of the last menstrual period**, **estimated due date**, **gravidity**, and **parity**.

Each pregnancy record is linked to a specific patient and helps track maternal health and history throughout the pregnancy journey.

## POST

Adds pregnancy details of a registered patient:
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/**

---


**📥 Request Body**
```json
{
    "PatientUserId": "{{PATIENT_USER_ID}}",
    "ExternalPregnancyId": "1",
    "DateOfLastMenstrualPeriod":"2024-11-01",
    "EstimatedDateOfChildBirth" : "2025-08-09",
    "Gravidity" : 6,
    "Parity" : 2
}
```

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Pregnancy record created successfully!",
    "HttpCode": 201,
    "Data": {
        "Pregnancy": {
            "id": "b231e879-bbb1-4d0f-b479-ad1afc7d17e2",
            "PatientUserId": "c13770ff-41c9-445c-9942-cad35b004530",
            "ExternalPregnancyId": "1",
            "DateOfLastMenstrualPeriod": "2024-11-01T00:00:00.000Z",
            "EstimatedDateOfChildBirth": "2025-08-09T00:00:00.000Z",
            "Gravidity": 6,
            "Parity": 2
        }
    }
}
```
## GET

Retrive pregnancy details of a patient:  
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}**

---

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Pregnancy record retrived successfully!",
    "HttpCode": 200,
    "Data": {
        "Pregnancy": {
            "id": "b231e879-bbb1-4d0f-b479-ad1afc7d17e2",
            "PatientUserId": "c13770ff-41c9-445c-9942-cad35b004530",
            "ExternalPregnancyId": "1",
            "DateOfLastMenstrualPeriod": "2024-11-01T00:00:00.000Z",
            "EstimatedDateOfChildBirth": "2025-08-09T00:00:00.000Z",
            "Gravidity": 6,
            "Parity": 2
        }
    }
}
```

## PUT

Update pregnancy details of a patient : 
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}**

---


**📥 Request Body**
```json
{
    "PatientUserId": "{{PATIENT_USER_ID}}",
    "ExternalPregnancyId": "1",
    "DateOfLastMenstrualPeriod":"2024-11-01",
    "EstimatedDateOfChildBirth" : "2025-08-09",
    "Gravidity" : 6,
    "Parity" : 2
}
```

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Pregnancy record Updated successfully!",
    "HttpCode": 200,
    "Data": {
        "Pregnancy": {
            "id": "b231e879-bbb1-4d0f-b479-ad1afc7d17e2",
            "PatientUserId": "c13770ff-41c9-445c-9942-cad35b004530",
            "ExternalPregnancyId": "1",
            "DateOfLastMenstrualPeriod": "2024-11-01T00:00:00.000Z",
            "EstimatedDateOfChildBirth": "2025-08-09T00:00:00.000Z",
            "Gravidity": 6,
            "Parity": 2
        }
    }
}
```
## SEARCH

Search Pregnancy details of a patient by given search filter:
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/**

---

**📥 Query Parameters**

These are the optional filters you can pass in the request:

| Parameter                 | Type     | Description                                        |
|--------------------------|----------|----------------------------------------------------|
| `PatientUserId`          | string   | Unique ID of the patient                          |
| `ExternalPregnancyId`    | string   | External reference ID for pregnancy               |
| `DateOfLastMenstrualPeriod` | string (YYYY-MM-DD) | Start date of the pregnancy              |
| `EstimatedDateOfChildBirth` | string (YYYY-MM-DD) | Expected delivery date                   |
| `Gravidity`              | number   | Number of times patient has been pregnant         |
| `Parity`                 | number   | Number of viable pregnancies carried to term      |

**📤 Response**
```json
{
     "Status": "success",
    "Message": "Total 1 pregnancy records retrieved successfully!",
    "HttpCode": 200,
    "Data": {
        "Pregnancies": {
            "TotalCount": 1,
            "RetrievedCount": 1,
            "PageIndex": 0,
            "ItemsPerPage": 25,
            "Order": "ascending",
            "OrderedBy": "CreatedAt",
            "Items": [
                {
                    "id": "b63f6de4-7c7d-4746-8254-561064968d6a",
                    "PatientUserId": "c13770ff-41c9-445c-9942-cad35b004530",
                    "ExternalPregnancyId": "1",
                    "DateOfLastMenstrualPeriod": "2024-11-01T00:00:00.000Z",
                    "EstimatedDateOfChildBirth": "2025-08-09T00:00:00.000Z",
                    "Gravidity": 3,
                    "Parity": 2
                }
            ]
        }
    }
}
```

## DELETE

Delete pregnancy details of a patient
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}**

---

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Delivery record deleted successfully!",
    "HttpCode": 200,
    "Data": {
        "Deleted": true
    }
}
```