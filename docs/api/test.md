# Test API

TMaternity tests are a series of diagnostic evaluations and screenings conducted during pregnancy to monitor the health of both the mother and the fetus. These tests help detect potential complications, confirm normal development, and guide healthcare professionals in providing timely and appropriate care.

---

**🎯 Purpose of Maternity Tests**
- Confirm pregnancy status and fetal viability
- Identify high-risk pregnancies
- Monitor maternal health parameters
- Detect genetic, chromosomal, or developmental abnormalities
- Check fetal growth, position, and well-being
- Plan and manage safe delivery

## POST

Add a Test record for a specific pregnancy:  
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}/tests**

---

**📥 Request Body**
```json
{
    "PregnancyId": "{{PREGNANCY_ID}}",
    "TestName": "CBC",
    "Type": "Blood",
    "Impression": "Hemoglobin and RBC levels are within the normal range.",
    "Parameters": {
        "Name": "Sugar",
        "Value": "90",
        "Unit": "mg/dL"
    },
    "DateOfTest": "2024-08-10T10:30:00Z"
}
```
**📤 Response**
```json
{
    "Status": "success",
    "Message": "Test record created successfully!",
    "HttpCode": 201,
    "Data": {
        "Test": {
            "id": "f61e64ab-aee9-445f-9e6b-1c8fd48f9dc6",
            "PregnancyId": "42420315-74d3-4216-b641-d723fdadf1ae",
            "TestName": "CBC",
            "Type": "Blood",
            "Impression": "Hemoglobin and RBC levels are within the normal range.",
            "Parameters": {
                "Name": "Sugar",
                "Value": "90",
                "Unit": "mg/dL"
            },
            "DateOfTest": "2024-08-10T10:30:00.000Z"
        }
    }
}
```

## GET
Retrieve Test record by ID:
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}/tests/{{TEST_ID}}**

---
**📤 Response**
```json
{
    "Status": "success",
    "Message": "Test record retrieved successfully!",
    "HttpCode": 200,
    "Data": {
        "Test": {
            "id": "f61e64ab-aee9-445f-9e6b-1c8fd48f9dc6",
            "PregnancyId": "42420315-74d3-4216-b641-d723fdadf1ae",
            "TestName": "CBC",
            "Type": "Blood",
            "Impression": "Hemoglobin and RBC levels are within the normal range.",
            "Parameters": {
                "Name": "Sugar",
                "Value": "90",
                "Unit": "mg/dL"
            },
            "DateOfTest": "2024-08-10T10:30:00.000Z"
        }
    }
}
```
## UPDATE

Update a Test record for a specific pregnancy:  
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}/tests/{{TEST_ID}}**

---

**📥 Request Body**
```json
{
    "PregnancyId": "{{PREGNANCY_ID}}",
        "TestName": "Glucose Tolerance Test (GTT)",
        "Type": "Blood",
        "Impression": "Fasting and post-glucose blood sugar levels are within the normal range.",
        "Parameters": {
            "Name": "Fasting Blood Sugar",
            "Value": "85",
            "Unit": "mg/dL"
        },
        "DateOfTest": "2024-08-12T08:00:00Z"
}
```
**📤 Response**
```json
{
    "Status": "success",
    "Message": "Test record updated successfully!",
    "HttpCode": 200,
    "Data": {
        "Test": {
            "id": "f61e64ab-aee9-445f-9e6b-1c8fd48f9dc6",
            "PregnancyId": "42420315-74d3-4216-b641-d723fdadf1ae",
            "TestName": "Glucose Tolerance Test (GTT)",
            "Type": "Blood",
            "Impression": "Fasting and post-glucose blood sugar levels are within the normal range.",
            "Parameters": {
                "Name": "Fasting Blood Sugar",
                "Value": "85",
                "Unit": "mg/dL"
            },
            "DateOfTest": "2024-08-12T08:00:00.000Z"
        }
    }
}
```

## DELETE

Delete Test details of a mother
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-pregnancies/{{PREGNANCY_ID}}/tests/{{TEST_ID}}**

---

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Test record deleted successfully!",
    "HttpCode": 200,
    "Data": {
        "Deleted": true
    }
}
```