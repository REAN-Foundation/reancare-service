# Breastfeeding API

The Breastfeeding API enables healthcare systems to document and monitor breastfeeding activities and statuses for newborns.  
It plays a vital role in tracking whether a baby is being breastfed, the frequency, duration, and any challenges or complications related to feeding.

This data helps healthcare providers assess the **nutritional well-being** of the newborn, support **lactating mothers**, and provide timely **guidance or interventions** when necessary.

Each breastfeeding record is typically associated with a **baby** and linked to relevant visits or evaluations, ensuring holistic tracking of postnatal care.

## POST

Adds Breastfeeding details of a  mother:
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/breastfeedings**

---

**📥 Request Body**
```json
{
     "VisitId"                : "{{VISIT_ID}}",
    "PostNatalVisitId"       : "{{POSTNATAL_VISIT_ID}}",
    "BreastFeedingStatus"    : "Initiated",
    "BreastfeedingFrequency" : "Every 2 hours",
    "AdditionalNotes"        : "Mother is experiencing mild discomfort."
}
```

**📤 Response**
```json
{
   "Status": "success",
    "Message": "Breastfeeding record created successfully!",
    "HttpCode": 201,
    "Data": {
        "Breastfeeding": {
            "id": "2e65ac32-193b-4c97-8bf6-08d66c8e6704",
            "VisitId": "c7a5b208-e33a-4363-89c1-766f5e2a3b90",
            "PostNatalVisitId": "4cde9317-d429-4f3c-95df-5cb306ab90c5",
            "BreastFeedingStatus": "Initiated",
            "BreastfeedingFrequency": "Every 2 hours",
            "AdditionalNotes": "Mother is experiencing mild discomfort."
        }
    }
}
```
## GET

Retrive Breastfeeding details by id:  
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/breastfeedings/{{BREASTFEEDING_ID}}**

---

**📤 Response**
```json
{
    "Status": "success",
    "Message": "Breastfeeding record retrieved successfully!",
    "HttpCode": 200,
    "Data": {
        "Breastfeeding": {
            "id": "2e65ac32-193b-4c97-8bf6-08d66c8e6704",
            "VisitId": "c7a5b208-e33a-4363-89c1-766f5e2a3b90",
            "PostNatalVisitId": "4cde9317-d429-4f3c-95df-5cb306ab90c5",
            "BreastFeedingStatus": "Initiated",
            "BreastfeedingFrequency": "Every 2 hours",
            "AdditionalNotes": "Mother is experiencing mild discomfort."
        }
    }
}
```

## PUT

Update Breastfeeding details by id : 
**Endpoint:** **{{BASE_URL}}/clinical/maternity/maternity-deliveries/{{DELIVERY_ID}}/breastfeedings/{{BREASTFEEDING_ID}}**

---
**📥 Request Body**
```json
{
    "VisitId"                : "{{VISIT_ID}}",
    "PostNatalVisitId"       : "{{POSTNATAL_VISIT_ID}}",
    "BreastFeedingStatus"    : "Initiated",
    "BreastfeedingFrequency" : "Every 2 hours",
    "AdditionalNotes"        : "Mother is experiencing mild discomfort."
}
```

**📤 Response**
```json
{
     "Status": "success",
    "Message": "Breastfeeding record updated successfully!",
    "HttpCode": 200,
    "Data": {
        "Breastfeeding": {
            "id": "2e65ac32-193b-4c97-8bf6-08d66c8e6704",
            "VisitId": "c7a5b208-e33a-4363-89c1-766f5e2a3b90",
            "PostNatalVisitId": "4cde9317-d429-4f3c-95df-5cb306ab90c5",
            "BreastFeedingStatus": "Stopped",
            "BreastfeedingFrequency": "Every 2 hours",
            "AdditionalNotes": "Mother is experiencing mild discomfort."
        }
    }
}
```