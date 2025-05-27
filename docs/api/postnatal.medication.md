# Postnatal Medication API

The Postnatal Medication API enables healthcare systems to manage and record medications administered to a patient during the postnatal period.  
It captures vital information such as the **medication name**, **dosage**, **administration date**, and **associated health conditions**.

Each postnatal medication record is linked to a specific **postnatal visit** and **patient**, ensuring accurate tracking of treatments and aiding in effective postnatal care and recovery monitoring.

## POST

Adds Postnatal medication details of a  mother:
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/postnatal-medications**

---

**📥 Request Body**
```json
{
    "PostNatalVisitId": "{{POSTNATAL_VISIT_ID}}",
    "DeliveryId": "{{DELIVERY_ID}}",
    "VisitId": "{{VISIT_ID}}",
    "Name": "Paracetamol",
    "Given": "None",
    "MedicationId": "d1234567-89ab-cdef-0123-456789abcdef"
}
```

**📤 Response**
```json
{
   "Status": "success",
    "Message": "Postnatal medication record created successfully!",
    "HttpCode": 201,
    "Data": {
        "PostnatalMedication": {
            "id": "28f07273-b56d-4984-95f3-63b27ab43fee",
            "PostNatalVisitId": "4cde9317-d429-4f3c-95df-5cb306ab90c5",
            "DeliveryId": "0f47b771-8ebb-44cf-b692-865ef99f36d3",
            "VisitId": "c7a5b208-e33a-4363-89c1-766f5e2a3b90",
            "Name": "Paracetamol",
            "Given": "None",
            "MedicationId": "d1234567-89ab-cdef-0123-456789abcdef"
        }
    }
}
```
## GET

Retrive Postnatal medication details by id:  
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/postnatal-medications/{{POSTNATAL_MEDICATION_ID}}**

---

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Postnatal medication record retrieved successfully!",
    "HttpCode": 200,
    "Data": {
        "PostnatalMedication": {
            "id": "28f07273-b56d-4984-95f3-63b27ab43fee",
            "PostNatalVisitId": "4cde9317-d429-4f3c-95df-5cb306ab90c5",
            "DeliveryId": "0f47b771-8ebb-44cf-b692-865ef99f36d3",
            "VisitId": "c7a5b208-e33a-4363-89c1-766f5e2a3b90",
            "Name": "Paracetamol",
            "Given": "None",
            "MedicationId": "d1234567-89ab-cdef-0123-456789abcdef"
        }
    }
}
```

## PUT

Update Postnatal medication details by id : 
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/postnatal-medications/{{POSTNATAL_MEDICATION_ID}}**

---


**📥 Request Body**
```json
{
   "PostNatalVisitId": "{{POSTNATAL_VISIT_ID}}",
    "DeliveryId": "{{DELIVERY_ID}}",
    "VisitId": "{{VISIT_ID}}",
    "Name": "Paracetamol",
    "Given": "None",
    "MedicationId": "d1234567-89ab-cdef-0123-456789abcdef"
}
```

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Postnatal medication record updated successfully!",
    "HttpCode": 200,
    "Data": {
        "PostnatalMedication": {
            "id": "28f07273-b56d-4984-95f3-63b27ab43fee",
            "PostNatalVisitId": "4cde9317-d429-4f3c-95df-5cb306ab90c5",
            "DeliveryId": "0f47b771-8ebb-44cf-b692-865ef99f36d3",
            "VisitId": "c7a5b208-e33a-4363-89c1-766f5e2a3b90",
            "Name": "Paracetamol",
            "Given": "None",
            "MedicationId": "d1234567-89ab-cdef-0123-456789abcdef"
        }
    }
}
```

## DELETE

Delete Postnatal medication details by id:
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/postnatal-medications/{{POSTNATAL_MEDICATION_ID}}**

---

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Postnatal medication record deleted successfully!",
    "HttpCode": 200,
    "Data": {
        "Deleted": true
    }
}
```