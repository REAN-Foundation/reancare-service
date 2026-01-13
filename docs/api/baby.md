# Baby API

The Baby API allows healthcare systems to record and manage essential information about babies born from a registered delivery.  
This includes capturing important details such as **baby identification**, **birth weight**, **gestational age**, **health status**, and **initial diagnoses**.

Each baby record is associated with a specific delivery and provides a foundation for tracking postnatal care, medical conditions, and ongoing development.  
This ensures continuity of care for newborns right from birth and supports the monitoring of neonatal outcomes.

---

## POST

Add a Baby record for a specific delivery:  
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/babies**

---

**📥 Request Body**
```json
{
    "DeliveryId": "{{DELIVERY_ID}}",
    "PatientUserId": "{{PATIENT_USER_ID}}",
    "WeightAtBirthGrams": 3200,
    "Gender": "Male",
    "Status": "Alive",
    "ComplicationId": "{{COMPLICATION_ID}}"
}
```
**📤 Response**
```json
{
    "Status": "success",
    "Message": "Baby record created successfully!",
    "HttpCode": 201,
    "Data": {
        "Baby": {
            "id": "4ba45eec-7cc9-40e1-b9c0-ecf4baae7a26",
            "DeliveryId": "0f47b771-8ebb-44cf-b692-865ef99f36d3",
            "PatientUserId": "a0d0b78a-7688-4606-8489-d9263d59d1fe",
            "WeightAtBirthGrams": 3200,
            "Gender": "Male",
            "Status": "Alive",
            "ComplicationId": "eb14da18-c894-4afd-99f9-d8dd3eccd666"
        }
    }
}
```

## GET
Retrieve Baby record by ID:
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/babies/{{BABY_ID}}**

---
**📤 Response**
```json
{
    "Status": "success",
    "Message": "Baby record retrieved successfully!",
    "HttpCode": 200,
    "Data": {
        "Baby": {
            "id": "4ba45eec-7cc9-40e1-b9c0-ecf4baae7a26",
            "DeliveryId": "0f47b771-8ebb-44cf-b692-865ef99f36d3",
            "PatientUserId": "a0d0b78a-7688-4606-8489-d9263d59d1fe",
            "WeightAtBirthGrams": 3200,
            "Gender": "Male",
            "Status": "Alive",
            "ComplicationId": "eb14da18-c894-4afd-99f9-d8dd3eccd666"
        }
    }
}
```