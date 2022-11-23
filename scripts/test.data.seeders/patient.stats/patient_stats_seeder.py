import requests
import json
import os
from types import SimpleNamespace as Namespace
from datetime import datetime, timedelta
import uuid
import random

mock_data_file = 'patient_stat_records.json'
patient_user_id = '32deb191-1ebf-4a98-85d2-fe65e1e0eb9f'
medication_id = 'dda96f41-4649-42b6-a398-24a77293064a'
drug_name = 'Tylenol 8 HR Arthritis Pain: 650 mg'
drug_id = '64dd5c85-86bf-480d-b8a1-8e959892b439'
dose = 1
medication_details = 'Crestor (rosuvastatin): 1.0 Tablet, Afternoon'

out_file = open('out_test_data.sql', mode='w', encoding='utf-8')

def read_json():
    data_file = os.path.join(os.getcwd(), mock_data_file)
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

def add_physical_activity(movement, calories, dt):
    str = ''''''
    moved  = 1 if bool(movement) == True else 0
    question = 'Did you add movement to your day today?'

    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.exercise_physical_activities (id, PatientUserId, Category, PhysicalActivityQuestion, PhysicalActivityQuestionAns, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', 'Other', '{question}', '{answer}', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, question = question, answer = moved, created = dt, updated = dt)
    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.exercise_physical_activities (id, PatientUserId, Exercise, Category, CaloriesBurned, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', 'Push-up', 'Strength training', '{calories}', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, calories = calories, created = dt, updated = dt)
    out_file.write(str)

def add_blood_pressure(systolic, diastolic, dt):
    str = ''''''
    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.biometrics_blood_pressure (id, PatientUserId, Systolic, Diastolic, Unit, RecordDate, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{systolic}', '{diastolic}', 'mmHg', '{created}', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, systolic = systolic, diastolic = diastolic, created = dt, updated = dt)
    out_file.write(str)

def add_blood_glucose(blood_glucose, dt):
    str = ''''''
    id = uuid.uuid4()
    str += '''INSERT INTO reancare_new.biometrics_blood_glucose (id, PatientUserId, BloodGlucose, Unit, RecordDate, CreatedAt, UpdatedAt) VALUES ('{id}', '{patient_user_id}', '{blood_glucose}', 'mgDL', '{created}', '{created}', '{updated}');\n'''.format(id = id, patient_user_id = patient_user_id, blood_glucose = blood_glucose, created = dt, updated = dt)
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

    str = '''INSERT INTO reancare_new.medication_consumptions (id, PatientUserId, MedicationId, DrugName, DrugId, Dose, Details, TimeScheduleStart, TimeScheduleEnd, IsTaken, IsMissed, CreatedAt, UpdatedAt)
    VALUES ('{id}', '{patient_user_id}', '{medication_id}', '{drug_name}', '{drug_id}', '{dose}', '{details}', '{start}', '{end}', '{taken}', '{missed}', '{created}', '{updated}');
    \n'''.format(
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
        add_physical_activity(c.movement_today, c.physical_activity_calories, dt)
        add_medication_consumption(c.medication_taken, dt)
        add_blood_pressure(c.blood_pressure_systolic, c.blood_pressure_diastolic, dt)
        add_blood_glucose(c.blood_glucose, dt)

def seed_data():
    print('seeding patient stats data...')
    contents = read_json()
    add_contents(contents)

if __name__ == '__main__':
    seed_data()
    out_file.close()
