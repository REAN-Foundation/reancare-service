# Postnatal Visit API

The Postnatal Visit API enables healthcare systems to manage and document postnatal care provided to a patient following childbirth.  
It supports the tracking of essential data such as the **visit date**, **health condition of the mother and newborn**, **postpartum symptoms**, and **follow-up instructions**.

Each postnatal visit record is associated with a specific delivery and patient, helping to monitor the recovery and well-being of the mother and baby during the postnatal period.

## POST

Adds Postnatal visit details of a  patient:
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/postnatal-visits**

---


**📥 Request Body**
```json
{
    "DeliveryId": "{{DELIVERY_ID}}",
    "PatientUserId": "{{PATIENT_USER_ID}}",
    "DateOfVisit": "2025-03-30T10:30:00Z",
    "BodyWeightId": "e4f8d9a7-3b27-4f90-b5a1-19c5e0c1a4f3",
    "ComplicationId": "a12d8f7e-9b27-4c11-a5a1-26c5e0b2c7d4",
    "BodyTemperatureId": "f1c9d8b7-6a27-4f01-a4a1-12e5c0d1c5e3",
    "BloodPressureId": "c7d9e1b2-5c27-4a12-b5c1-14e6f0c2d4a5"
}
```

**📤 Response**
```json
{
   "Status": "success",
    "Message": "Postnatal visit record created successfully!",
    "HttpCode": 201,
    "Data": {
        "PostnatalVisit": {
            "id": "4cde9317-d429-4f3c-95df-5cb306ab90c5",
            "DeliveryId": "0f47b771-8ebb-44cf-b692-865ef99f36d3",
            "PatientUserId": "a0d0b78a-7688-4606-8489-d9263d59d1fe",
            "DateOfVisit": "2025-03-30T10:30:00.000Z",
            "BodyWeightId": "e4f8d9a7-3b27-4f90-b5a1-19c5e0c1a4f3",
            "ComplicationId": "a12d8f7e-9b27-4c11-a5a1-26c5e0b2c7d4",
            "BodyTemperatureId": "f1c9d8b7-6a27-4f01-a4a1-12e5c0d1c5e3",
            "BloodPressureId": "c7d9e1b2-5c27-4a12-b5c1-14e6f0c2d4a5"
        }
    }
}
```
## GET

Retrive Postnatal visit details by id:  
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/postnatal-visits/{{POSTNATAL_VISIT_ID}}**

---

**📤 Response**
```json
{
     "Status": "success",
    "Message": "Postnatal visit record retrieved successfully!",
    "HttpCode": 200,
    "Data": {
        "PostnatalVisit": {
            "id": "4cde9317-d429-4f3c-95df-5cb306ab90c5",
            "DeliveryId": "0f47b771-8ebb-44cf-b692-865ef99f36d3",
            "PatientUserId": "a0d0b78a-7688-4606-8489-d9263d59d1fe",
            "DateOfVisit": "2025-03-30T10:30:00.000Z",
            "BodyWeightId": "e4f8d9a7-3b27-4f90-b5a1-19c5e0c1a4f3",
            "ComplicationId": "a12d8f7e-9b27-4c11-a5a1-26c5e0b2c7d4",
            "BodyTemperatureId": "f1c9d8b7-6a27-4f01-a4a1-12e5c0d1c5e3",
            "BloodPressureId": "c7d9e1b2-5c27-4a12-b5c1-14e6f0c2d4a5"
        }
    }
}
```

## PUT

Update Postnatal visit details by id : 
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/postnatal-visits/{{POSTNATAL_VISIT_ID}}**

---


**📥 Request Body**
```json
{
    "DeliveryId": "{{DELIVERY_ID}}",
    "PatientUserId": "{{PATIENT_USER_ID}}",
    "DateOfVisit": "2025-03-30T10:30:00Z",
    "BodyWeightId": "e4f8d9a7-3b27-4f90-b5a1-19c5e0c1a4f3",
    "ComplicationId": "a12d8f7e-9b27-4c11-a5a1-26c5e0b2c7d4",
    "BodyTemperatureId": "f1c9d8b7-6a27-4f01-a4a1-12e5c0d1c5e3",
    "BloodPressureId": "c7d9e1b2-5c27-4a12-b5c1-14e6f0c2d4a5"
}
```

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Postnatal visit record updated successfully!",
    "HttpCode": 200,
    "Data": {
        "PostnatalVisit": {
            "id": "4cde9317-d429-4f3c-95df-5cb306ab90c5",
            "DeliveryId": "0f47b771-8ebb-44cf-b692-865ef99f36d3",
            "PatientUserId": "a0d0b78a-7688-4606-8489-d9263d59d1fe",
            "DateOfVisit": "2025-03-30T10:30:00.000Z",
            "BodyWeightId": "e4f8d9a7-3b27-4f90-b5a1-19c5e0c1a4f3",
            "ComplicationId": "a12d8f7e-9b27-4c11-a5a1-26c5e0b2c7d4",
            "BodyTemperatureId": "f1c9d8b7-6a27-4f01-a4a1-12e5c0d1c5e3",
            "BloodPressureId": "c7d9e1b2-5c27-4a12-b5c1-14e6f0c2d4a5"
        }
    }
}
```
## SEARCH

Search Postnatal visit details of a mother by given search filter:
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/postnatal-visits/search?DeliveryId={{DELIVERY_ID}}**

---

**📥 Query Parameters**

These are the optional filters you can pass in the request:

| Parameter            | Type     | Description                                          |
|----------------------|----------|------------------------------------------------------|
| `DeliveryId`         | string   | Unique ID referencing the delivery record            |
| `PatientUserId`      | string   | Unique ID of the patient                             |
| `DateOfVisit`        | string (YYYY-MM-DD) | Date when the postnatal visit occurred    |
| `BodyWeightId`       | string   | Reference ID for the body weight record              |
| `ComplicationId`     | string   | Reference ID for any postnatal complications         |
| `BodyTemperatureId`  | string   | Reference ID for the recorded body temperature       |
| `BloodPressureId`    | string   | Reference ID for the recorded blood pressure         |

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Total 1 postnatal visit records retrieved successfully!",
    "HttpCode": 200,
    "Data": {
        "PostnatalVisits": {
            "TotalCount": 1,
            "RetrievedCount": 1,
            "PageIndex": 0,
            "ItemsPerPage": 25,
            "Order": "ascending",
            "OrderedBy": "CreatedAt",
            "Items": [
                {
                    "id": "4cde9317-d429-4f3c-95df-5cb306ab90c5",
                    "DeliveryId": "0f47b771-8ebb-44cf-b692-865ef99f36d3",
                    "PatientUserId": "a0d0b78a-7688-4606-8489-d9263d59d1fe",
                    "DateOfVisit": "2025-03-30T10:30:00.000Z",
                    "BodyWeightId": "e4f8d9a7-3b27-4f90-b5a1-19c5e0c1a4f3",
                    "ComplicationId": "a12d8f7e-9b27-4c11-a5a1-26c5e0b2c7d4",
                    "BodyTemperatureId": "f1c9d8b7-6a27-4f01-a4a1-12e5c0d1c5e3",
                    "BloodPressureId": "c7d9e1b2-5c27-4a12-b5c1-14e6f0c2d4a5"
                }
            ]
        }
    }
}
```

## DELETE

Delete Postnatal visit details by id:
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/postnatal-visits/{{POSTNATAL_VISIT_ID}}**

---

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Postnatal visit record deleted successfully!",
    "HttpCode": 200,
    "Data": {
        "Deleted": true
    }
}
```