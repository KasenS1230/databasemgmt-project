import sqlite3
import os

base_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(base_dir, 'vet.db')

connect = sqlite3.connect(db_path)
cursor = connect.cursor()
cursor.execute("PRAGMA foreign_keys = ON;")

cursor.execute("""
    INSERT INTO client (first_name, last_name, street, city, state, zip, phone_number, email)
    VALUES 
        ('Drew', 'Campbell', '123 Oak St', 'Baton Rouge', 'LA', '70803', '225550142', 'drewcampbell@gmail.com'),
        ('Rick', 'Devens', '456 Magnolia Ave', 'Baton Rouge', 'LA', '70803', '2254820142', 'rickdevens@cox.net'),
        ('Melody', 'Morris', '176 Maple Dr', 'Baton Rouge', 'LA', '70803', '2253878913', 'melodymorris@yahoo.com'),
        ('Taylor', 'Brown', '898 Cypress Dr', 'Baton Rouge', 'LA', '70803', '2259263247', 'taylorbrown@gmail.com'),
        ('Rachel', 'Reilly', '432 Elm St', 'Baton Rouge', 'LA', '70803', '2257696781', 'rachelreilly@cox.net'),
        ('Quinn', 'Martin', '871 Pinecrest Rd', 'Baton Rouge', 'LA', '70803', '2252314390', 'quinnmartin@yahoo.com'),
        ('Barrett', 'Pfeiffer', '764 Bayou Dr', 'Baton Rouge', 'LA', '70803', '2257531984', 'barrettpfeiffer@gmail.com'),
        ('Glenn', 'Garcia', '812 River Rd', 'Baton Rouge', 'LA', '70803', '2256157235', 'glenngarcia@cox.net'),
        ('Britney', 'Haynes', '256 Live Oak Blvd', 'Baton Rouge', 'LA', '70803', '2253382609', 'britneyhaynes@yahoo.com'),
        ('Ian', 'Terry', '777 Magnolia Ridge Dr', 'Baton Rouge', 'LA', '70803', '2252939418', 'ianterry@gmail.com'),
        ('Jun', 'Song', '458 Plant Rd', 'Baton Rouge', 'LA', '70803', '2256643052', 'junsong@cox.net'),
        ('Paul', 'Abrahamian', '211 Pelican St', 'Baton Rouge', 'LA', '70803', '2254506814', 'paulabrahamian@yahoo.com'),
        ('Lauren', 'Domingue', '979 Azalea Dr', 'Baton Rouge', 'LA', '70803', '2258194197', 'laurendomingue@gmail.com'),
        ('Levi', 'Banks', '565 University Ave', 'Baton Rouge', 'LA', '70803', '2252728360', 'levibanks@cox.net'),
        ('Yash', 'Patel', '434 Highland Rd', 'Baton Rouge', 'LA', '70803', '2253561529', 'yashpatel@yahoo.com'),
        ('Mallory', 'Aurichio', '543 Perkins Rd', 'Baton Rouge', 'LA', '70803', '2257567643', 'malloryaurichio@gmail.com'),
        ('Matt', 'Turner', '611 Burbank Dr', 'Baton Rouge', 'LA', '70803', '2259222095', 'mattturner@cox.net'),
        ('Vince', 'Panaro', '377 Nicholson Dr', 'Baton Rouge', 'LA', '70803', '2253836311', 'vincepanaro@yahoo.com'),
        ('Will', 'Kirby', '877 Lee Dr', 'Baton Rouge', 'LA', '70803', '2257664988', 'willkirby@gmail.com'),
        ('Tiffany', 'Mitchell', '912 Acadian Rd', 'Baton Rouge', 'LA', '70803', '2256580736', 'tiffanymitchell@cox.net');
""")

cursor.execute("""
    INSERT INTO staff (first_name, last_name, role, hire_date, license_no)
    VALUES 
        ('Ava', 'Pearl', 'Veterinarian', '06-15-2026', 98765),
        ('Rome', 'Seymour', 'Veterinarian', '06-01-2026', 12345),
        ('Morgan', 'Pope', 'Veterinarian', '06-30-2026', 13579),
        ('Katherine', 'Woodman', 'Front Desk', '07-01-2026', 4385),
        ('Tucker', 'Lauriers', 'Owner', '06-01-2026', 55663);
""")

cursor.execute("""
    INSERT INTO medication (name, form, mg_no, unit_price)
    VALUES 
        ('Amoxicillin', 'Tablet', 250, 12.50),
        ('Clavamox', 'Tablet', 150, 28.00),
        ('Rimadyl', 'Tablet', 75, 45.00),
        ('Gabapentin', 'Capsule', 100, 15.00),
        ('Meloxicam', 'Liquid', 2, 22.50),
        ('Prednisone', 'Tablet', 10, 8.00),
        ('Doxycycline', 'Tablet', 100, 30.00),
        ('Metronidazole', 'Tablet', 250, 14.00),
        ('Enrofloxacin', 'Tablet', 68, 38.50),
        ('Furosemide', 'Tablet', 12, 10.00),
        ('Tramadol', 'Tablet', 50, 18.00),
        ('Phenobarbital', 'Tablet', 30, 16.50),
        ('Methimazole', 'Tablet', 5, 25.00),
        ('Levothyroxine', 'Tablet', 1, 20.00),
        ('Ketoconazole', 'Tablet', 200, 35.00),
        ('Cephalexin', 'Capsule', 500, 24.00),
        ('Sucralfate', 'Tablet', 1000, 19.00),
        ('Famotidine', 'Tablet', 20, 9.50),
        ('Otomax (Ear Drops)', 'Liquid', 15, 31.00),
        ('Azithromycin', 'Liquid', 200, 27.00),
        ('Clindamycin', 'Capsule', 75, 21.50),
        ('Spironolactone', 'Tablet', 25, 17.00),
        ('Benazepril', 'Tablet', 5, 26.00),
        ('Phenylpropanolamine', 'Tablet', 25, 32.00),
        ('Ursodiol', 'Capsule', 250, 40.00),
        ('Theophylline', 'Tablet', 100, 15.50),
        ('Cyclosporine', 'Capsule', 25, 55.00),
        ('Mirtazapine', 'Tablet', 15, 29.00),
        ('Buprenorphine', 'Injection', 1, 42.00),
        ('Acepromazine', 'Tablet', 10, 11.00);
""")

cursor.execute("""
    INSERT INTO pet (client_id, name, species, breed, sex, birth_date, alerts)
    VALUES 
        (1, 'Buddy', 'Dog', 'Golden Retriever', 'Male', '04-12-20', 'Allergic to penicillin'),
        (2, 'Bailey', 'Cat', 'Domestic Shorthair', 'Female', '05-13-20', NULL),
        (3, 'Luna', 'Dog', 'German Shepherd', 'Male', '06-14-20', 'Allergic to pollen'),
        (4, 'Charlie', 'Cat', 'Maine Coon', 'Female', '07-15-20', NULL),
        (5, 'Cooper', 'Dog', 'French Bulldog', 'Female', '08-16-20', NULL),
        (6, 'Bella', 'Cat', 'Siamese', 'Female', '09-17-20', NULL),
        (7, 'Milo', 'Hamster', 'Syrian', 'Male', '10-18-20', NULL),
        (8, 'Daisy', 'Hamster', 'Roborovski Dwarf', 'Female', '11-19-20', NULL),
        (9, 'Oliver', 'Dog', 'Labrador Retriever', 'Male', '12-20-20', 'Allergic to eggs'),
        (10, 'Buddy', 'Cat', 'Ragdoll', 'Male', '01-21-21', 'Allergic to cephalosporins'),
        (11, 'Sadie', 'Dog', 'Miniature Poodle', 'Female', '02-22-21', NULL),
        (12, 'Tucker', 'Cat', 'British Shorthair', 'Female', '03-23-21', NULL),
        (13, 'Rocky', 'Dog', 'Beagle', 'Male', '04-24-21', NULL),
        (14, 'Chloe', 'Cat', 'Bengal', 'Female', '05-25-20', NULL),
        (15, 'Buster', 'Dog', 'Boxer', 'Male', '06-26-20', NULL),
        (16, 'Ruby', 'Cat', 'Sphynx', 'Female', '07-27-24', NULL),
        (17, 'Duke', 'Dog', 'Siberian Husky', 'Male', '08-28-20', NULL),
        (18, 'Lola', 'Cat', 'Abyssinian', 'Female', '09-29-20', NULL),
        (19, 'Zoey', 'Dog', 'Australian Shepherd', 'Male', '10-30-20', NULL),
        (20, 'Zeus', 'Cat', 'Scottish Fold', 'Female', '11-01-20', NULL);
""")

cursor.execute("""
    INSERT INTO appointment (pet_id, staff_id, appt_datetime, reason, status, weight, temp, exam_notes, diagnosis)
    VALUES 
        (1, 1, '07-01-2026 10:00:00', 'Annual Checkup', 'Completed', '68.5 lbs', 97, 'Coat shiny, heart and lungs clear, mild tartar on back molars.', 'None'),
        (2, 1, '07-02-2026 11:00:00', 'Microchip Implantation', 'Completed', '8.2 lbs', 98, 'Microchip implanted between shoulder blades; scanned and verified.', 'None'),
        (3, 1, '07-03-2026 12:00:00', 'Annual Checkup', 'Completed', '76.0 lbs', 99, 'Good muscle tone, joints mobile, annual vaccinations updated.', 'None'),
        (4, 1, '07-06-2026 1:00:00', 'Heartworm Testing & Refill', 'Completed', '14.5 lbs', 100, 'Blood draw completed; heartworm antigen test negative.', 'None'),
        (5, 1, '07-07-2026 2:00:00', 'Annual Checkup', 'Completed', '24.0 lbs', 97, 'Normal breathing for breed, skin folds clean, weight stable.', 'None'),
        (6, 1, '07-08-2026 3:00:00', 'Vomiting and Diarrhea', 'Completed', '7.8 lbs', 98, 'Mild dehydration, abdomen slightly tender on palpation.', 'Acute Gastroenteritis'),
        (7, 1, '07-09-2026 4:00:00', 'Annual Checkup', 'Completed', '0.35 lbs', 99, 'Active and alert, cheek pouches clear, incisors normal length.', 'None'),
        (8, 1, '07-10-2026 10:00:00', 'Straining to Urinate', 'Completed', '0.15 lbs', 100, 'Bladder feels firm, dampness around hindquarters, mild discomfort.', 'Urinary Tract Infection'),
        (9, 1, '07-13-2026 11:00:00', 'Annual Checkup', 'Completed', '72.0 lbs', 97, 'Eyes and ears clear, energetic, advised on maintaining current diet.', 'None'),
        (10, 1, '07-14-2026 12:00:00', 'Ear Infection', 'Completed', '11.0 lbs', 98, 'Dark waxy debris and redness in left ear canal; head shaking noted.', 'Otitis Externa'),
        (11, 1, '07-15-2026 1:00:00', 'Annual Checkup', 'Completed', '13.5 lbs', 99, 'Clean teeth, normal heart rate, no fleas or ticks found.', 'None'),
        (12, 1, '07-16-2026 2:00:00', 'Eye Discharge', 'Incomplete', '10.2 lbs', 100, NULL, NULL),
        (13, 1, '07-17-2026 3:00:00', 'Annual Checkup', 'Incomplete', '25.5 lbs', 97, NULL, NULL),
        (14, 1, '07-20-2026 4:00:00', 'Limping', 'Incomplete', '9.5 lbs', 98, NULL, NULL),
        (15, 1, '07-21-2026 9:00:00', 'Annual Checkup', 'Incomplete', '65.0 lbs', 99, NULL, NULL),
        (16, 1, '07-22-2026 10:00:00', 'Respiratory Distress', 'Incomplete', '7.2 lbs', 100, NULL, NULL),
        (17, 1, '07-23-2026 11:00:00', 'Annual Checkup', 'Incomplete', '54.0 lbs', 97, NULL, NULL),
        (18, 1, '07-24-2026 12:00:00', 'Bee Sting', 'Incomplete', '8.0 lbs', 98, NULL, NULL),
        (19, 1, '07-27-2026 1:00:00', 'Annual Checkup', 'Incomplete', '48.5 lbs', 99, NULL, NULL),
        (20, 1, '07-28-2026 2:00:00', 'Dental Cleaning', 'Incomplete', '9.1 lbs', 100, NULL, NULL);
""")

cursor.execute("""
    INSERT INTO prescription (appt_id, med_id, date_written, quantity, refills, instructions)
    VALUES 
        (6, 8, '07-08-2026', 30, 1, 'Give one tablet twice daily with food'),
        (8, 1, '07-10-2026', 30, 1, 'Give one tablet twice daily with food'),
        (10, 19, '07-14-2026', 30, 1, 'Give one tablet twice daily with food');
""")

cursor.execute("""
    INSERT INTO invoice (appt_id, total, exam_fee, balance_due)
    VALUES 
        (1, 100.00, 100.00, 0.00),
        (2, 125.00, 100.00, 0.00),
        (3, 100.00, 100.00, 0.00),
        (4, 130.00, 100.00, 0.00),
        (5, 100.00, 100.00, 0.00),
        (6, 114.00, 100.00, 0.00),
        (7, 100.00, 100.00, 0.00),
        (8, 110.00, 100.00, 0.00),
        (9, 100.00, 100.00, 0.00),
        (10, 131.00, 100.00, 0.00),
        (11, 100.00, 100.00, 0.00),
        (12, 100.00, 100.00, 100.00),
        (13, 100.00, 100.00, 100.00),
        (14, 115.00, 100.00, 115.00),
        (15, 100.00, 100.00, 100.00),
        (16, 125.00, 100.00, 125.00),
        (17, 100.00, 100.00, 100.00),
        (18, 110.00, 100.00, 110.00),
        (19, 100.00, 100.00, 100.00),
        (20, 150.00, 100.00, 150.00);
""")

cursor.execute("""
    INSERT INTO payment (invoice_id, pay_date, amount, method)
    VALUES 
        (1, '07-01-2026', 100.00, 'Credit Card'),
        (2, '07-02-2026', 125.00, 'Credit Card'),
        (3, '07-03-2026', 100.00, 'Credit Card'),
        (4, '07-06-2026', 130.00, 'Credit Card'),
        (5, '07-07-2026', 100.00, 'Credit Card'),
        (6, '07-08-2026', 114.00, 'Credit Card'),
        (7, '07-09-2026', 100.00, 'Credit Card'),
        (8, '07-10-2026', 110.00, 'Credit Card'),
        (9, '07-13-2026', 100.00, 'Credit Card'),
        (10, '07-14-2026', 131.00, 'Credit Card'),
        (11, '07-15-2026', 100.00, 'Credit Card');
""")

cursor.execute("""
    INSERT INTO administered (appt_id, med_id, quantity_given, next_due_date)
    VALUES 
        (6, 8, 1, '08-08-2026'),
        (8, 1, 1, '08-10-2026'),
        (10, 19, 1, '08-14-2026');
""")

connect.commit()
connect.close()