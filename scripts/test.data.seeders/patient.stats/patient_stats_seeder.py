import requests
import json
import os
from types import SimpleNamespace as Namespace
from datetime import datetime, timedelta
import uuid
import random

mock_data_file = 'patient_stat_records.json'
patient_user_id = 'fdc032b3-63e9-410e-8eb4-12c38c7ae57f'
medication_id = 'dda96f41-4649-42b6-a398-24a77293064a'
drug_name = 'Tylenol 8 HR Arthritis Pain: 650 mg'
drug_id = '64dd5c85-86bf-480d-b8a1-8e959892b439'
dose = 1
medication_details = 'Crestor (rosuvastatin): 1.0 Tablet, Afternoon'

lab_record_type_LDL = '712bb004-8174-4c3e-9d8b-da56033bb17a'
lab_record_type_tri = '7e5ecc39-8e68-4b8c-b04c-dba156b93dc9'
lab_record_type_HDL = '04c5f67b-4d91-43fb-90a9-77da5ccd2b77'
lab_record_type_Total = '2321342e-1a8f-4efa-bd7d-84f113474c12'
lab_record_type_a1c = '6f9fc248-6886-4062-9f4b-226e1c9263ca'

out_file = open('out_test_data.sql', mode='w', encoding='utf-8')

def read_json(mock_data_file_):
    data_file = os.path.join(os.getcwd(), mock_data_file_)
    fille_ = open(data_file, mode='r', encoding='utf-8')
    txt = fille_.read()
    fille_.close()
    contents = json.loads(txt, object_hook=lambda d: Namespace(**d))
    return contents

def getRandomFood():
    items = ["Rice","Chapati", "Milk", "Roti", "Salad", "Pizza", "Idli Sambhar", "Fries", "Burger", "Egg", "Noodles", "Soup", "Tea", "Coffee", "Bread Slice", "Curry"]
    rand_idx = random.randrange(len(items))
    return items[rand_idx]

def getRandomFoodConsumption():
    items = ["Breakfast","Lunch", "Dinner", "Snack"]
    rand_idx = random.randrange(len(items))
    return items[rand_idx]

def add_nutrition(c, dt):
    str = ''''''
    generic_healthy_nutrition  = 1 if bool(c.generic_healthy_nutrition) == True else 0
    healthy_protein            = 1 if bool(c.healthy_protein) == True else 0
    low_salt                   = 1 if bool(c.low_salt) == True else 0
    vegetables_servings        = c.vegetables_servings
    fruit_servings             = c.fruit_servings
    grains_servings            = c.grains_servings
    sea_food_servings          = c.sea_food_servings
    food_calories              = c.food_calories
    sugary_drinks_servings     = c.sugary_drinks_servings

    generic_nutrition_tag = '[\\"GenericNutrition\\"]'
    protein_tag = '[\\"Protein\\"]'
    salt_tag = '[\\"Salt\\"]'
    vegetables_tag = '[\\"Vegetables\\"]'
    fruit_tag = '[\\"Fruit\\"]'
    sugary_drinks_tag = '[\\"Sugary drinks\\"]'
    seafood_tag = '[\\"Sea food\\"]'
    grains_tag = '[\\"Grains\\"]'

    consumed_as = getRandomFoodConsumption()
    food = getRandomFood()

    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.nutrition_food_consumption (id, PatientUserId, FoodTypes, UserResponse, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{tag}', {v}, '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, tag = generic_nutrition_tag, v = generic_healthy_nutrition, created = dt, updated = dt)
    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.nutrition_food_consumption (id, PatientUserId, FoodTypes, UserResponse, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{tag}', {v}, '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, tag = protein_tag, v = healthy_protein, created = dt, updated = dt)
    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.nutrition_food_consumption (id, PatientUserId, FoodTypes, UserResponse, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{tag}', {v}, '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, tag = salt_tag, v = low_salt, created = dt, updated = dt)

    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.nutrition_food_consumption (id, PatientUserId, FoodTypes, Servings, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{tag}', {v}, '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, tag = vegetables_tag, v = vegetables_servings, created = dt, updated = dt)
    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.nutrition_food_consumption (id, PatientUserId, FoodTypes, Servings, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{tag}', {v}, '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, tag = grains_tag, v = grains_servings, created = dt, updated = dt)
    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.nutrition_food_consumption (id, PatientUserId, FoodTypes, Servings, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{tag}', {v}, '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, tag = fruit_tag, v = fruit_servings, created = dt, updated = dt)
    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.nutrition_food_consumption (id, PatientUserId, FoodTypes, Servings, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{tag}', {v}, '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, tag = sugary_drinks_tag, v = sugary_drinks_servings, created = dt, updated = dt)
    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.nutrition_food_consumption (id, PatientUserId, FoodTypes, Servings, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{tag}', {v}, '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, tag = seafood_tag, v = sea_food_servings, created = dt, updated = dt)

    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.nutrition_food_consumption (id, PatientUserId, Food, ConsumedAs, Calories, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{food}', '{consumed_as}', {calories}, '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, food = food, consumed_as = consumed_as, calories = food_calories, created = dt, updated = dt)

    out_file.write(str)

def add_body_weight(body_weight, dt):
    id = uuid.uuid4()
    str = '''INSERT INTO reancare_new.biometrics_body_weight (id, PatientUserId, BodyWeight, Unit, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{body_weight}', 'Kg', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, body_weight = body_weight, created = dt, updated = dt)
    out_file.write(str)

def add_daily_sleep_hours(sleep, dt):
    id = uuid.uuid4()
    str = '''INSERT INTO reancare_new.daily_records_sleep (id, PatientUserId, SleepDuration, Unit, RecordDate, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{sleep}', 'hrs', '{record_date}', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, sleep = sleep, record_date = dt, created = dt, updated = dt)
    out_file.write(str)

def add_physical_activity(movement, calories, move_minutes, dt):
    str = ''''''
    moved  = 1 if bool(movement) == True else 0
    question = 'Did you add movement to your day today?'

    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.exercise_physical_activities (id, PatientUserId, Category, PhysicalActivityQuestion, PhysicalActivityQuestionAns, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', 'Other', '{question}', '{answer}', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, question = question, answer = moved, created = dt, updated = dt)
    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.exercise_physical_activities (id, PatientUserId, Exercise, Category, CaloriesBurned, DurationInMin, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', 'Push-up', 'Strength training', '{calories}', '{move_minutes}', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, calories = calories, move_minutes = move_minutes, created = dt, updated = dt)
    out_file.write(str)

def add_blood_pressure(systolic, diastolic, dt):
    str = ''''''
    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.biometrics_blood_pressure (id, PatientUserId, Systolic, Diastolic, Unit, RecordDate, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{systolic}', '{diastolic}', 'mmHg', '{created}', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, systolic = systolic, diastolic = diastolic, created = dt, updated = dt)
    out_file.write(str)

def add_blood_glucose(blood_glucose, dt):
    str = ''''''
    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.biometrics_blood_glucose (id, PatientUserId, BloodGlucose, Unit, RecordDate, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{blood_glucose}', 'mg/dL', '{created}', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, blood_glucose = blood_glucose, created = dt, updated = dt)
    out_file.write(str)

def add_medication_consumption(medication_taken, dt):
    taken = 0
    missed = 0
    if medication_taken == 1:
        taken = 1
        missed = 0
    elif medication_taken == -1:
        taken = 0
        missed = 1
    else:
        taken = 0
        missed = 0
    id = uuid.uuid4()
    schedule = dt
    start = schedule.split(' ')[0] + ' 06:00:00'
    end = schedule.split(' ')[0] + ' 08:00:00'

    str = '''INSERT INTO reancare_new.medication_consumptions (id, PatientUserId, MedicationId, DrugName, DrugId, Dose, Details, TimeScheduleStart,  TimeScheduleEnd, IsTaken, IsMissed, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{medication_id}', '{drug_name}', '{drug_id}', '{dose}', '{details}', '{start}', '{end}', '{taken}', '{missed}', '{created}', '{updated}');\n'''.format(
        id = id,
        patient_user_id = patient_user_id,
        medication_id = medication_id,
        drug_name = drug_name,
        drug_id = drug_id,
        dose = dose,
        details = medication_details,
        start = start,
        end = end,
        taken = taken,
        missed = missed,
        created = dt,
        updated = dt)
    out_file.write(str)

def add_lab_records(c, dt):
    str = ''''''
    total_cholesterol  = c.total_cholesterol
    HDL                = c.HDL
    LDL                = c.LDL
    triglyceride_level = c.triglyceride_level
    a1c_level          = c.a1c_level


    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.lab_records (id, PatientUserId, TypeId, TypeName, DisplayName, PrimaryValue, Unit, RecordedAt, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{recordType}', 'Cholesterol', 'Total Cholesterol', {primaryValue}, 'mg/dL', '{created}', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, recordType = lab_record_type_Total, primaryValue = total_cholesterol, created = dt, updated = dt)

    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.lab_records (id, PatientUserId, TypeId, TypeName, DisplayName, PrimaryValue, Unit, RecordedAt, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{recordType}', 'Cholesterol', 'HDL', {primaryValue}, 'mg/dL', '{created}', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, recordType = lab_record_type_HDL, primaryValue = HDL, created = dt, updated = dt)

    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.lab_records (id, PatientUserId, TypeId, TypeName, DisplayName, PrimaryValue, Unit, RecordedAt, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{recordType}', 'Cholesterol', 'LDL', {primaryValue}, 'mg/dL', '{created}', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, recordType = lab_record_type_LDL, primaryValue = LDL, created = dt, updated = dt)

    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.lab_records (id, PatientUserId, TypeId, TypeName, DisplayName, PrimaryValue, Unit, RecordedAt, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{recordType}', 'Cholesterol', 'Triglyceride Level', {primaryValue}, 'mg/dL', '{created}', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, recordType = lab_record_type_tri, primaryValue = triglyceride_level, created = dt, updated = dt)

    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.lab_records (id, PatientUserId, TypeId, TypeName, DisplayName, PrimaryValue, Unit, RecordedAt, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{recordType}', 'Cholesterol', 'A1C Level', {primaryValue}, 'mg/dL', '{created}', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, recordType = lab_record_type_a1c, primaryValue = a1c_level, created = dt, updated = dt)

    out_file.write(str)

def add_daily_assessments(feeling, mood, energy_level, dt):
    str = ''''''

    feelings = ["Worse", "Same", "Better", "Unspecified"]
    feeling_str = feelings[feeling - 1]

    moods = ["Happy", "Lonely", "Angry", "Stressed", "Anxious", "Fearful", "Sad", "Hopeful", "Calm", "Status Quo", "Unspecified"]
    mood_str = moods[mood - 1]

    energy_levels = ["Get off the bed", "Climb stairs", "Exercise", "Walk", "Stand", "Eat", "Get through the day without a nap", "Unspecified"]
    energy_levels_str = '[\"' + energy_levels[energy_level - 1] + '\"]'

    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.daily_assessments (id, PatientUserId, Feeling, Mood, EnergyLevels, RecordDate, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{feeling}', '{mood}', '{energy_levels}', '{created}', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, feeling = feeling_str, mood = mood_str, energy_levels = energy_levels_str, created = dt, updated = dt)

    out_file.write(str)


def add_contents(contents):
    count = 0
    today = datetime.today()
    for c in contents:
        count += 1
        day = today - timedelta(days=count)
        dt = day.strftime("%Y-%m-%d %H:%M:%S")
        add_nutrition(c, dt)
        add_body_weight(c.body_weight, dt)
        add_daily_sleep_hours(c.daily_sleep_hours, dt)
        add_physical_activity(c.movement_today, c.physical_activity_calories, c.move_minutes, dt)
        add_medication_consumption(c.medication_taken, dt)
        add_blood_pressure(c.blood_pressure_systolic, c.blood_pressure_diastolic, dt)
        add_blood_glucose(c.blood_glucose, dt)
        add_daily_assessments(c.daily_assessment_feeling, c.daily_assessment_mood, c.daily_assessment_energy_level, dt)
        add_lab_records(c, dt)

def add_user_task(t):
    str = ''''''
    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.user_tasks (id, UserId, DisplayId, Task, Category, Description, ActionType, ActionId, ScheduledStartTime, ScheduledEndTime, Started, Finished, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{displayId}', '{task}', '{category}', '{description}', '{actionType}', '{actionId}', '{scheduledStartTime}', '{scheduledEndTime}', '{started}', '{finished}', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, displayId = t.DisplayId, task = t.Task, category = t.Category, description = t.Description, actionType = t.ActionType, actionId = t.ActionId, scheduledStartTime = t.ScheduledStartTime, scheduledEndTime = t.ScheduledEndTime, started = t.Started, finished = t.Finished, created = t.CreatedAt, updated = t.UpdatedAt)
    out_file.write(str)

def add_enrollment(e):
    str = ''''''
    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.careplan_enrollments (id, PatientUserId, EnrollmentId, ParticipantId, Provider, PlanCode, PlanName, StartDate, EndDate, IsActive, ParticipantStringId, EnrollmentStringId, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{enrollmentId}', '{participantId}', '{provider}', '{planCode}', '{planName}', '{startDate}', '{endDate}', '{isActive}', '{participantStringId}', '{enrollmentStringId}', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, enrollmentId = e.EnrollmentId, participantId = e.ParticipantId, provider = e.Provider, planCode = e.PlanCode, planName = e.PlanName, startDate = e.StartDate, endDate = e.EndDate, isActive = e.IsActive, participantStringId = e.ParticipantStringId, enrollmentStringId = e.EnrollmentStringId, created = e.CreatedAt, updated = e.UpdatedAt)
    out_file.write(str)

def add_user_tasks(user_tasks):
    for c in user_tasks:
        add_user_task(c)

def seed_data():
    print('seeding patient stats data...')
    contents = read_json(mock_data_file)
    add_contents(contents)
    user_tasks = read_json('user_tasks.json')
    careplan_enrollments = read_json('enrollments.json')
    add_user_tasks(user_tasks)
    add_enrollment(careplan_enrollments[0])

if __name__ == '__main__':
    seed_data()
    out_file.close()
