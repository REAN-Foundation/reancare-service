import { Helper } from "../../../../common/helper";
import { addSectionTitle, addText } from "./stat.report.commons";

////////////////////////////////////////////////////////////////////////////

export const addReportMetadata = (document: PDFKit.PDFDocument, model: any, y: number): number => {

    y = y + 5;

    var clientList = ["HCHLSTRL", "REANPTNT"];
    if (clientList.indexOf(model.ClientCode) >= 0) {

        document
            .font('Helvetica-Bold')
            .fontSize(12)
            .text('Heart & Stroke Helper™', 35, y, { align: "center" })
            .moveDown();

        y = y + 20;

        const text = `Heart & Stroke Helper™ supports individuals to better manage their health condition by providing education from a trusted source and keeping track of healthy habits, health numbers, symptoms, and medications - all in one place.`;
        document
            .font('Helvetica')
            .fontSize(9)
            .text(text, 50, y, { align: "left" })
            .moveDown();

        y = y + 30;

        const text2 = `This summary of your app activity and data can be printed and brought along to appointments with your care team and shared with them by uploading it to your patient portal.The summary is meant to give your care team understanding about your condition management between visits.`;
        document
            .font('Times-Italic')
            .fontSize(9)
            .text(text2, 50, y, { align: "left" })
            .moveDown();

        y = y + 43;
        
    } else {

        document
            .font('Helvetica-Bold')
            .fontSize(12)
            .text('HF Helper', 35, y, { align: "center" })
            .moveDown();

        y = y + 20;

        const text = `The HF Helper app can help heart failure patients stay healthy between office visits by tracking their symptoms, managing medication, and sharing health information with their doctor - all in one place.`;
        document
            .font('Helvetica')
            .fontSize(9)
            .text(text, 50, y, { align: "left" })
            .moveDown();

        y = y + 30;

        const text2 = `This summary of your app activity and data can be printed and brought along to appointments with your care team and shared with them by uploading it to your patient portal.The summary is meant to give your care team understanding about your condition management between visits.`;
        document
            .font('Times-Italic')
            .fontSize(9)
            .text(text2, 50, y, { align: "left" })
            .moveDown();

        y = y + 43;

    }
    
    document
        .image(model.ProfileImagePath, 50, y, { width: 64 });

    document
        .roundedRect(135, y, 400, 95, 1)
        .lineWidth(0.1)
        .fillOpacity(0.8)
        .fill("#e8ecef");

    y = y + 20;

    document
        .fillOpacity(1.0)
        .lineWidth(1)
        .fill("#444444");

    document
        .fillColor("#444444")
        .font('Helvetica')
        .fontSize(13);

    document
        .font('Helvetica-Bold')
        .text('Patient', 190, y, { align: "left" })
        .font('Helvetica')
        .text(model.Name, 290, y, { align: "left" })
        .moveDown();

    y = y + 23;

    document
        .font('Helvetica-Bold')
        .text('Patient ID', 190, y, { align: "left" })
        .font('Helvetica')
        .text(model.DisplayId, 290, y, { align: "left" })
        .moveDown();

    y = y + 23;

    document
        .font('Helvetica-Bold')
        .text('BirthDate', 190, y, { align: "left" })
        .font('Helvetica')
        .text(model.BirthDate, 290, y, { align: "left" })
        .moveDown();

    y = y + 23;

    return y;
};

export const addReportSummary = (document: PDFKit.PDFDocument, model: any, y: number): number => {

    y = y + 45;

    const labelX = 135;
    const valueX = 325;
    const rowYOffset = 21;

    document
        .fontSize(11)
        .fillColor("#444444");

    document
        .font('Helvetica-Bold')
        .text('Age', labelX, y, { align: "left" })
        .font('Helvetica')
        .text(model.Age, valueX, y, { align: "left" })
        .moveDown();
    y = y + rowYOffset;

    document
        .font('Helvetica-Bold')
        .text('Sex', labelX, y, { align: "left" })
        .font('Helvetica')
        .text(model.Gender, valueX, y, { align: "left" })
        .moveDown();
    y = y + rowYOffset;

    document
        .font('Helvetica-Bold')
        .text('Race', labelX, y, { align: "left" })
        .font('Helvetica')
        .text(model.Race, valueX, y, { align: "left" })
        .moveDown();
    y = y + rowYOffset;

    document
        .font('Helvetica-Bold')
        .text('Ethnicity', labelX, y, { align: "left" })
        .font('Helvetica')
        .text(model.Ethnicity, valueX, y, { align: "left" })
        .moveDown();
    y = y + rowYOffset;

    document
        .font('Helvetica-Bold')
        .text('Marital Status', labelX, y, { align: "left" })
        .font('Helvetica')
        .text(model.MaritalStatus, valueX, y, { align: "left" })
        .moveDown();
    y = y + rowYOffset;

    y = y + 7;

    document
        .font('Helvetica-Bold')
        .text('Tobacco', labelX, y, { align: "left" })
        .font('Helvetica')
        .text(model.Tobacco, valueX, y, { align: "left" })
        .moveDown();
    y = y + rowYOffset;

    document
        .font('Helvetica-Bold')
        .text('Current Weight', labelX, y, { align: "left" })
        .font('Helvetica')
        .text(model.CurrentBodyWeight, valueX, y, { align: "left" })
        .moveDown();
    y = y + rowYOffset;

    document
        .font('Helvetica-Bold')
        .text('Current Height', labelX, y, { align: "left" })
        .font('Helvetica')
        .text(model.CurrentHeight, valueX, y, { align: "left" })
        .moveDown();
    y = y + rowYOffset;

    if (model.BodyMassIndex) {
        document
            .font('Helvetica-Bold')
            .text('Body Mass Index (BMI)', labelX, y, { align: "left" })
            .font('Helvetica')
            .text(model.BodyMassIndex.toFixed(), valueX, y, { align: "left" })
            .moveDown();
        y = y + rowYOffset;
        y = drawBMIScale(document, y, model.BodyMassIndex);
    }

    y = y + rowYOffset;

    return y;
};

export const addHealthJourney = (document: PDFKit.PDFDocument, model: any, y: number): number => {

    const journey = model.Stats.Careplan?.Enrollment;
    if (!journey) {
        return y;
    }
    const planName = journey.PlanName;
    // const enrollmentId = journey.EnrollmentId ? journey.EnrollmentId.toString() : journey.EnrollmentStringId;
    const startDate = journey.StartAt?.toLocaleDateString();
    const endDate = journey.EndAt?.toLocaleDateString();
    const icon = Helper.getIconsPath('health-journey.png');
    y = y + 20;
    y = addSectionTitle(document, y, 'Health Journey', icon);

    y = y + 18;
    const text = `The Health Journey helps you to better manage your condition and reduce your risk of heart disease and stroke. You'll learn about healthy lifestyle habits, goal planning, shared decision-making with your care team, medications, self-management tips, and health behavior maintenance.`;
    document
        .font('Helvetica')
        .fontSize(9)
        .text(text, 50, y, { align: "left" })
        .moveDown();

    const labelX = 135;
    const valueX = 325;
    const rowYOffset = 23;

    y = y + 60;

    document
        .fontSize(11)
        .fillColor("#444444");

    document
        .font('Helvetica-Bold')
        .text('Journey', labelX, y, { align: "left" })
        .font('Helvetica')
        .text(planName, valueX, y, { align: "left" })
        .moveDown();
    y = y + rowYOffset;

    /*document
        .font('Helvetica-Bold')
        .text('Enrollment Id', labelX, y, { align: "left" })
        .font('Helvetica')
        .text(enrollmentId, valueX, y, { align: "left" })
        .moveDown();
    y = y + rowYOffset;*/

    document
        .font('Helvetica-Bold')
        .text('Start Date', labelX, y, { align: "left" })
        .font('Helvetica')
        .text(startDate, valueX, y, { align: "left" })
        .moveDown();
    y = y + rowYOffset;

    document
        .font('Helvetica-Bold')
        .text('End Date', labelX, y, { align: "left" })
        .font('Helvetica')
        .text(endDate, valueX, y, { align: "left" })
        .moveDown();

    y = y + 35;

    var c = model.ChartImagePaths.find(x => x.key === 'Careplan_Progress');
    document.image(c.location, 115, y, { width: 375, align: 'center' });
    document.fontSize(7);
    document.moveDown();
    y = y + 32;
    addText(document, 'Health Journey Progress', 75, y, 9, '#505050', 'center');
    return y;
};

const drawBMIScale = (document: PDFKit.PDFDocument, y: number, bmi: number) => {
    const startX = 325;
    const imageWidth = 210;
    let bmiImage = null;
    if (bmi < 18.5) {
        bmiImage = Helper.getIconsPath('bmi_legend_underweight.png');
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        bmiImage = Helper.getIconsPath('bmi_legend_normal.png');
    } else if (bmi >= 24.9 && bmi <= 29.9) {
        bmiImage = Helper.getIconsPath('bmi_legend_overweight.png');
    } else if (bmi >= 29.9 && bmi <= 34.9) {
        bmiImage = Helper.getIconsPath('bmi_legend_obese.png');
    } else if (bmi > 34.9) {
        bmiImage = Helper.getIconsPath('bmi_legend_extremely_obese.png');
    }
    if (bmiImage) {
        document.image(bmiImage, startX, y, { width: imageWidth });
        y = y + 17;
    }
    return y;
};
