# Complication API

The Complication API allows healthcare systems to record and manage health complications that may occur during or after pregnancy and childbirth.  
It helps in documenting critical conditions that affect the **mother**, **fetus**, or **newborn**, and facilitates timely intervention and treatment.

Each complication record is associated with a specific **patient** and may be linked to events such as **pregnancy**, **delivery**, or **postnatal visits**, ensuring comprehensive monitoring of maternal and neonatal health outcomes.

## POST

Adds complication details of a  patient:
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/complications**

---

**📥 Request Body**
```json
{
    "DeliveryId": "{{DELIVERY_ID}}",
    "BabyId1": "baby-1234-uuid",
    "BabyId2": "baby-5678-uuid",
    "BabyId3": "baby-9101-uuid",
    "Name": "Complication Name",
    "Status": "Healthy",
    "Severity": "High",
    "MedicalConditionId": "condition-1234-uuid"
}
```

**📤 Response**
```json
{
   "Status": "success",
    "Message": "Complication record created successfully!",
    "HttpCode": 201,
    "Data": {
        "Complication": {
            "id": "176067be-5aaf-437f-9922-b0c48e05deaa",
            "DeliveryId": "0f47b771-8ebb-44cf-b692-865ef99f36d3",
            "BabyId1": "baby-1234-uuid",
            "BabyId2": "baby-5678-uuid",
            "BabyId3": "baby-9101-uuid",
            "Name": "Complication Name",
            "Status": "Healthy",
            "Severity": "High",
            "MedicalConditionId": "condition-1234-uuid"
        }
    }
}
```
## GET

Retrive Complications details by id:  
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/complications/{{COMPLICATION_ID}}**

---

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Complication record retrieved successfully!",
    "HttpCode": 200,
    "Data": {
        "Complication": {
            "id": "176067be-5aaf-437f-9922-b0c48e05deaa",
            "DeliveryId": "0f47b771-8ebb-44cf-b692-865ef99f36d3",
            "BabyId1": "baby-1234-uuid",
            "BabyId2": "baby-5678-uuid",
            "BabyId3": "baby-9101-uuid",
            "Name": "Complication Name",
            "Status": "Healthy",
            "Severity": "High",
            "MedicalConditionId": "condition-1234-uuid"
        }
    }
}
```

## PUT

Update Complication details by id : 
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/complications/{{COMPLICATION_ID}}**

---
**📥 Request Body**
```json
{
    "DeliveryId": "{{DELIVERY_ID}}",
    "BabyId1": "baby-1234-uuid",
    "BabyId2": "baby-5678-uuid",
    "BabyId3": "baby-9101-uuid",
    "Name": "Complication Name",
    "Status": "Healthy",
    "Severity": "High",
    "MedicalConditionId": "condition-1234-uuid"
}
```

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Complication record updated successfully!",
    "HttpCode": 200,
    "Data": {
        "Complication": {
            "id": "176067be-5aaf-437f-9922-b0c48e05deaa",
            "DeliveryId": "0f47b771-8ebb-44cf-b692-865ef99f36d3",
            "BabyId1": "baby-1234-uuid",
            "BabyId2": "baby-5678-uuid",
            "BabyId3": "baby-9101-uuid",
            "Name": "Complication Name",
            "Status": "Healthy",
            "Severity": "High",
            "MedicalConditionId": "condition-1234-uuid"
        }
    }
}
```
## SEARCH

Search Complication details of a mother by given search filter:
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/complications/search?Status=Healthy**

---

**📥 Query Parameters**

These are the optional filters you can pass in the request:

| Parameter              | Type     | Description                                             |
|------------------------|----------|---------------------------------------------------------|
| `DeliveryId`           | string   | Unique ID referencing the delivery record               |
| `BabyId1`              | string   | Reference ID for the first baby                         |
| `BabyId2`              | string   | Reference ID for the second baby                        |
| `BabyId3`              | string   | Reference ID for the third baby                         |
| `Name`                 | string   | Name of the complication                                |
| `Status`               | string   | Status of the baby/mother (e.g., Alive, Deceased)       |
| `Severity`             | string   | Severity level of the complication (e.g., Low, High)    |
| `MedicalConditionId`   | string   | Reference ID for the medical condition associated       |

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Total 1 complication records retrieved successfully!",
    "HttpCode": 200,
    "Data": {
        "Complications": {
            "Items": [
                {
                    "id": "176067be-5aaf-437f-9922-b0c48e05deaa",
                    "DeliveryId": "0f47b771-8ebb-44cf-b692-865ef99f36d3",
                    "BabyId1": "baby-1234-uuid",
                    "BabyId2": "baby-5678-uuid",
                    "BabyId3": "baby-9101-uuid",
                    "Name": "Complication Name",
                    "Status": "Healthy",
                    "Severity": "High",
                    "MedicalConditionId": "condition-1234-uuid"
                }
            ]
        }
    }
}
```

## DELETE

Delete Complications details by id:
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/complications/{{COMPLICATION_ID}}**

---

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Complications record deleted successfully!",
    "HttpCode": 200,
    "Data": {
        "Deleted": true
    }
}
```