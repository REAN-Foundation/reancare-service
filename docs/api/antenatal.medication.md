# Antenatal Medication API

An Antenatal Medication is a API used in maternity care systems to manage and track medications prescribed to pregnant women during the antenatal period (the period before birth, during pregnancy).

**🔑 Key Purposes of Antenatal Medication API**

- **Prescribe medications** for pregnant women
- **Track medication history** across visits
- **Ensure medication safety** for both mother and fetus
- **Integrate with antenatal checkups** and lab results
- **Monitor medication adherence**

## POST
Add antenatal medication details for a specific pregnancy.
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}/antenatal-medication**
---

**📥 Request Body**
```json
{
    "AnteNatalVisitId"   : "{{ANTENATAL_VISIT_ID}}",
    "PregnancyId"        : "{{PREGNANCY_ID}}",
    "VisitId"            : "{{VISIT_ID}}", 
    "Name"               : "Calcium",
    "Given"              : "Yes",
    "MedicationId"       : "{{MEDICATION_ID}}"
}
```

**📤 Response**
```json
{
     "Status": "success",
    "Message": "Antenatal medication record created successfully!",
    "HttpCode": 201,
    "Data": {
        "AntenatalMedication": {
            "id": "9bc505ec-2c35-4013-89bd-02188f3c9d16",
            "AnteNatalVisitId": "788c74e6-db5a-45a8-a458-4e6f48f8fd93",
            "PregnancyId": "42420315-74d3-4216-b641-d723fdadf1ae",
            "VisitId": "c7a5b208-e33a-4363-89c1-766f5e2a3b90",
            "Name": "Calcium",
            "Given": "Yes",
            "MedicationId": "9579c572-034b-48d1-9e8b-2e3263d8279b"
        }
    }
}
```
## GET
Retrive antenatal medication details for a specific pregnancy.
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}/antenatal-medication/{{ANTENATAL_MEDICATION_ID}}**
---

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Antenatal medication record retrieved successfully!",
    "HttpCode": 200,
    "Data": {
        "AntenatalMedication": {
            "id": "9bc505ec-2c35-4013-89bd-02188f3c9d16",
            "AnteNatalVisitId": "788c74e6-db5a-45a8-a458-4e6f48f8fd93",
            "PregnancyId": "42420315-74d3-4216-b641-d723fdadf1ae",
            "VisitId": "c7a5b208-e33a-4363-89c1-766f5e2a3b90",
            "Name": "Calcium",
            "Given": "Yes",
            "MedicationId": "9579c572-034b-48d1-9e8b-2e3263d8279b"
        }
    }
}
```
## UPDATE
Update antenatal medication details for a specific pregnancy.
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}/antenatal-visit/{{ANTENATAL_MEDICATION_ID}}**

---


**📥 Request Body**
```json
{
    "AnteNatalVisitId"   : "{{ANTENATAL_VISIT_ID}}",
    "PregnancyId"        : "{{PREGNANCY_ID}}",
    "VisitId"            : "{{VISIT_ID}}", 
    "Name"               : "Calcium",
    "Given"              : "Yes",
    "MedicationId"       : "{{MEDICATION_ID}}"
}
```

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Antenatal medication updated successfully!",
    "HttpCode": 200,
    "Data": {
        "AntenatalMedication": {
            "id": "9bc505ec-2c35-4013-89bd-02188f3c9d16",
            "AnteNatalVisitId": "788c74e6-db5a-45a8-a458-4e6f48f8fd93",
            "PregnancyId": "42420315-74d3-4216-b641-d723fdadf1ae",
            "VisitId": "c7a5b208-e33a-4363-89c1-766f5e2a3b90",
            "Name": "Iron",
            "Given": "None",
            "MedicationId": "9579c572-034b-48d1-9e8b-2e3263d8279b"
        }
    }
}
```
## DELETE

Delete antenatal medication details for a specific pregnancy.
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}/antenatal-visit/{{ANTENATAL_MEDICATION_ID}}**

---

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Antenatal medication record deleted successfully!",
    "HttpCode": 200,
    "Data": {
        "Deleted": true
    }
}
```