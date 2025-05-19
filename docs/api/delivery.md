# Delivery API

The Delivery API enables healthcare systems to record and manage **childbirth and delivery-related data** for registered patients.
This includes capturing vital delivery information such as the **type of delivery, date and time of delivery, birth outcome, gestational age, and delivery-related complications.**

Each delivery record is associated with a specific pregnancy and helps provide a comprehensive view of the **maternal and neonatal outcomes**, supporting continuity of care for both mother and newborn.

## POST

Adds Delivery details of a registered patient:
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/**

---


**📥 Request Body**
```json
{
    "PregnancyId"          : "{{PREGNANCY_ID}}",
    "PatientUserId"        : "{{PATIENT_USER_ID}}",
    "DeliveryDate"         : "2025-08-09",
    "DeliveryTime"         : "14:30:00",
    "GestationAtBirth"     : 38,
    "DeliveryMode"         : "Assisted",
    "DeliveryPlace"        : "aa hospital",
    "DeliveryOutcome"      : "Aborted",
    "DateOfDischarge"      : "2025-08-09",
    "OverallDiagnosis"     : "In Good Health"
}
```

**📤 Response**
```json
{
    
    "Status": "success",
    "Message": "Delivery record created successfully!",
    "HttpCode": 201,
    "Data": {
        "Delivery": {
            "id": "7d112c72-9ab5-427a-b235-340e62ab95f4",
            "PregnancyId": "42420315-74d3-4216-b641-d723fdadf1ae",
            "PatientUserId": "a0d0b78a-7688-4606-8489-d9263d59d1fe",
            "DeliveryDate": "2025-08-09T00:00:00.000Z",
            "DeliveryTime": null,
            "GestationAtBirth": 38,
            "DeliveryMode": "Assisted",
            "DeliveryPlace": "aa hospital",
            "DeliveryOutcome": "Aborted",
            "DateOfDischarge": "2025-08-09T00:00:00.000Z",
            "OverallDiagnosis": "In Good Health"
        }
    }
}
```
## GET

Retrive Delivery details by id:  
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}**

---

**📤 Response**
```json
{
     "Status": "success",
    "Message": "Delivery record retrieved successfully!",
    "HttpCode": 200,
    "Data": {
        "Delivery": {
            "id": "7d112c72-9ab5-427a-b235-340e62ab95f4",
            "PregnancyId": "42420315-74d3-4216-b641-d723fdadf1ae",
            "PatientUserId": "a0d0b78a-7688-4606-8489-d9263d59d1fe",
            "DeliveryDate": "2025-08-09T00:00:00.000Z",
            "DeliveryTime": "00:00:00",
            "GestationAtBirth": 38,
            "DeliveryMode": "Assisted",
            "DeliveryPlace": "aa hospital",
            "DeliveryOutcome": "Aborted",
            "DateOfDischarge": "2025-08-09T00:00:00.000Z",
            "OverallDiagnosis": "In Good Health"
        }
    }
}
```

## PUT

Update Delivery details of a patient : 
**{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}**

---

**📥 Request Body**
```json
{
    "PregnancyId"     : "{{PREGNANCY_ID}}",
    "PatientUserId"   : "9ad2f83e-626a-497d-b607-e9092a8861c1",
    "DeliveryDate"         : "2025-08-09",
    "DeliveryTime"         : "14:30:00",
    "GestationAtBirth"     : 38,
    "DeliveryMode"         : "LSCS",
    "DeliveryPlace"        : "aa hospital",
    "DeliveryOutcome"      : "Aborted",
    "DateOfDischarge"     : "2025-08-09",
    "OverallDiagnosis"    : "In Good Health"
}
```

**📤 Response**
```json
{
     "Status": "success",
    "Message": "Delivery record updated successfully!",
    "HttpCode": 200,
    "Data": {
        "Delivery": {
            "id": "7d112c72-9ab5-427a-b235-340e62ab95f4",
            "PregnancyId": "42420315-74d3-4216-b641-d723fdadf1ae",
            "PatientUserId": "a0d0b78a-7688-4606-8489-d9263d59d1fe",
            "DeliveryDate": "2025-08-09T00:00:00.000Z",
            "DeliveryTime": "00:00:00",
            "GestationAtBirth": 38,
            "DeliveryMode": "LSCS",
            "DeliveryPlace": "aa hospital",
            "DeliveryOutcome": "Aborted",
            "DateOfDischarge": "2025-08-09T00:00:00.000Z",
            "OverallDiagnosis": "In Good Health"
        }
    }
}
```
## SEARCH

Search Delivery details of a patient by given search filter:
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/search?DeliveryMode=LSCS**

---

**📥 Query Parameters**

These are the optional filters you can pass in the request:

| Parameter             | Type                  | Description                                              |
|----------------------|-----------------------|----------------------------------------------------------|
| `DeliveryMode`       | string                | Mode of delivery (e.g., Normal, Cesarean, Assisted)      |
| `DeliveryDate`       | string (YYYY-MM-DD)   | Date when the delivery occurred                          |
| `GestationAtBirth`   | number                | Number of weeks of gestation at the time of birth        |
| `GestationAtBirth`   | number                | Number of weeks of gestation at the time of birth        |
| `DeliveryOutcome`       | string                | Mode of delivery (e.g., Normal, Cesarean, Assisted)   |

**📤 Response**
```json
{
      "Status": "success",
    "Message": "Total 1 delivery records retrieved successfully!",
    "HttpCode": 200,
    "Data": {
        "Deliveries": {
            "TotalCount": 1,
            "RetrievedCount": 1,
            "PageIndex": 0,
            "ItemsPerPage": 25,
            "Order": "ascending",
            "OrderedBy": "CreatedAt",
            "Items": [
                {
                    "id": "7d112c72-9ab5-427a-b235-340e62ab95f4",
                    "PregnancyId": "42420315-74d3-4216-b641-d723fdadf1ae",
                    "PatientUserId": "a0d0b78a-7688-4606-8489-d9263d59d1fe",
                    "DeliveryDate": "2025-08-09T00:00:00.000Z",
                    "DeliveryTime": "00:00:00",
                    "GestationAtBirth": 38,
                    "DeliveryMode": "LSCS",
                    "DeliveryPlace": "aa hospital",
                    "DeliveryOutcome": "Aborted",
                    "DateOfDischarge": "2025-08-09T00:00:00.000Z",
                    "OverallDiagnosis": "In Good Health"
                }
            ]
        }
    }
}
```

## DELETE

Delete Delivery details of a patient
**Endpoint** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}**

---

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Pregnancy record deleted successfully!",
    "HttpCode": 200,
    "Data": {
        "Deleted": true
    }
}
```