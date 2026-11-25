/* ------------------------------------------------------------------
   MOCK DATA: a copy of the rows in vet.db, so the site works with no
   backend. Every page reads the tables from `DB` below.

   To connect the real database, give the browser this same object
   filled from the SELECTs in queries.sql instead (same table names,
   same column names). Dates must be ISO here: "2020-04-12" for dates,
   "2026-07-01T13:30" for appointment times. See README.
------------------------------------------------------------------- */
const DB = {
 "clients": [
  {
   "client_id": 1,
   "first_name": "Drew",
   "last_name": "Campbell",
   "street": "123 Oak St",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 225550142,
   "email": "drewcampbell@gmail.com"
  },
  {
   "client_id": 2,
   "first_name": "Rick",
   "last_name": "Devens",
   "street": "456 Magnolia Ave",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2254820142,
   "email": "rickdevens@cox.net"
  },
  {
   "client_id": 3,
   "first_name": "Melody",
   "last_name": "Morris",
   "street": "176 Maple Dr",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2253878913,
   "email": "melodymorris@yahoo.com"
  },
  {
   "client_id": 4,
   "first_name": "Taylor",
   "last_name": "Brown",
   "street": "898 Cypress Dr",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2259263247,
   "email": "taylorbrown@gmail.com"
  },
  {
   "client_id": 5,
   "first_name": "Rachel",
   "last_name": "Reilly",
   "street": "432 Elm St",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2257696781,
   "email": "rachelreilly@cox.net"
  },
  {
   "client_id": 6,
   "first_name": "Quinn",
   "last_name": "Martin",
   "street": "871 Pinecrest Rd",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2252314390,
   "email": "quinnmartin@yahoo.com"
  },
  {
   "client_id": 7,
   "first_name": "Barrett",
   "last_name": "Pfeiffer",
   "street": "764 Bayou Dr",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2257531984,
   "email": "barrettpfeiffer@gmail.com"
  },
  {
   "client_id": 8,
   "first_name": "Glenn",
   "last_name": "Garcia",
   "street": "812 River Rd",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2256157235,
   "email": "glenngarcia@cox.net"
  },
  {
   "client_id": 9,
   "first_name": "Britney",
   "last_name": "Haynes",
   "street": "256 Live Oak Blvd",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2253382609,
   "email": "britneyhaynes@yahoo.com"
  },
  {
   "client_id": 10,
   "first_name": "Ian",
   "last_name": "Terry",
   "street": "777 Magnolia Ridge Dr",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2252939418,
   "email": "ianterry@gmail.com"
  },
  {
   "client_id": 11,
   "first_name": "Jun",
   "last_name": "Song",
   "street": "458 Plant Rd",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2256643052,
   "email": "junsong@cox.net"
  },
  {
   "client_id": 12,
   "first_name": "Paul",
   "last_name": "Abrahamian",
   "street": "211 Pelican St",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2254506814,
   "email": "paulabrahamian@yahoo.com"
  },
  {
   "client_id": 13,
   "first_name": "Lauren",
   "last_name": "Domingue",
   "street": "979 Azalea Dr",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2258194197,
   "email": "laurendomingue@gmail.com"
  },
  {
   "client_id": 14,
   "first_name": "Levi",
   "last_name": "Banks",
   "street": "565 University Ave",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2252728360,
   "email": "levibanks@cox.net"
  },
  {
   "client_id": 15,
   "first_name": "Yash",
   "last_name": "Patel",
   "street": "434 Highland Rd",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2253561529,
   "email": "yashpatel@yahoo.com"
  },
  {
   "client_id": 16,
   "first_name": "Mallory",
   "last_name": "Aurichio",
   "street": "543 Perkins Rd",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2257567643,
   "email": "malloryaurichio@gmail.com"
  },
  {
   "client_id": 17,
   "first_name": "Matt",
   "last_name": "Turner",
   "street": "611 Burbank Dr",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2259222095,
   "email": "mattturner@cox.net"
  },
  {
   "client_id": 18,
   "first_name": "Vince",
   "last_name": "Panaro",
   "street": "377 Nicholson Dr",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2253836311,
   "email": "vincepanaro@yahoo.com"
  },
  {
   "client_id": 19,
   "first_name": "Will",
   "last_name": "Kirby",
   "street": "877 Lee Dr",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2257664988,
   "email": "willkirby@gmail.com"
  },
  {
   "client_id": 20,
   "first_name": "Tiffany",
   "last_name": "Mitchell",
   "street": "912 Acadian Rd",
   "city": "Baton Rouge",
   "state": "LA",
   "zip": "70803",
   "phone_number": 2256580736,
   "email": "tiffanymitchell@cox.net"
  }
 ],
 "staff": [
  {
   "staff_id": 1,
   "first_name": "Ava",
   "last_name": "Pearl",
   "role": "Veterinarian",
   "hire_date": "2026-06-15",
   "license_no": 98765
  },
  {
   "staff_id": 2,
   "first_name": "Rome",
   "last_name": "Seymour",
   "role": "Veterinarian",
   "hire_date": "2026-06-01",
   "license_no": 12345
  },
  {
   "staff_id": 3,
   "first_name": "Morgan",
   "last_name": "Pope",
   "role": "Veterinarian",
   "hire_date": "2026-06-30",
   "license_no": 13579
  },
  {
   "staff_id": 4,
   "first_name": "Katherine",
   "last_name": "Woodman",
   "role": "Front Desk",
   "hire_date": "2026-07-01",
   "license_no": 4385
  },
  {
   "staff_id": 5,
   "first_name": "Tucker",
   "last_name": "Lauriers",
   "role": "Owner",
   "hire_date": "2026-06-01",
   "license_no": 55663
  }
 ],
 "pets": [
  {
   "pet_id": 1,
   "client_id": 1,
   "name": "Buddy",
   "species": "Dog",
   "breed": "Golden Retriever",
   "sex": "Male",
   "birth_date": "2020-04-12",
   "alerts": "Allergic to penicillin",
   "deceased_date": null
  },
  {
   "pet_id": 2,
   "client_id": 2,
   "name": "Bailey",
   "species": "Cat",
   "breed": "Domestic Shorthair",
   "sex": "Female",
   "birth_date": "2020-05-13",
   "alerts": null,
   "deceased_date": null
  },
  {
   "pet_id": 3,
   "client_id": 3,
   "name": "Luna",
   "species": "Dog",
   "breed": "German Shepherd",
   "sex": "Male",
   "birth_date": "2020-06-14",
   "alerts": "Allergic to pollen",
   "deceased_date": null
  },
  {
   "pet_id": 4,
   "client_id": 4,
   "name": "Charlie",
   "species": "Cat",
   "breed": "Maine Coon",
   "sex": "Female",
   "birth_date": "2020-07-15",
   "alerts": null,
   "deceased_date": null
  },
  {
   "pet_id": 5,
   "client_id": 5,
   "name": "Cooper",
   "species": "Dog",
   "breed": "French Bulldog",
   "sex": "Female",
   "birth_date": "2020-08-16",
   "alerts": null,
   "deceased_date": null
  },
  {
   "pet_id": 6,
   "client_id": 6,
   "name": "Bella",
   "species": "Cat",
   "breed": "Siamese",
   "sex": "Female",
   "birth_date": "2020-09-17",
   "alerts": null,
   "deceased_date": null
  },
  {
   "pet_id": 7,
   "client_id": 7,
   "name": "Milo",
   "species": "Hamster",
   "breed": "Syrian",
   "sex": "Male",
   "birth_date": "2020-10-18",
   "alerts": null,
   "deceased_date": null
  },
  {
   "pet_id": 8,
   "client_id": 8,
   "name": "Daisy",
   "species": "Hamster",
   "breed": "Roborovski Dwarf",
   "sex": "Female",
   "birth_date": "2020-11-19",
   "alerts": null,
   "deceased_date": null
  },
  {
   "pet_id": 9,
   "client_id": 9,
   "name": "Oliver",
   "species": "Dog",
   "breed": "Labrador Retriever",
   "sex": "Male",
   "birth_date": "2020-12-20",
   "alerts": "Allergic to eggs",
   "deceased_date": null
  },
  {
   "pet_id": 10,
   "client_id": 10,
   "name": "Buddy",
   "species": "Cat",
   "breed": "Ragdoll",
   "sex": "Male",
   "birth_date": "2021-01-21",
   "alerts": "Allergic to cephalosporins",
   "deceased_date": null
  },
  {
   "pet_id": 11,
   "client_id": 11,
   "name": "Sadie",
   "species": "Dog",
   "breed": "Miniature Poodle",
   "sex": "Female",
   "birth_date": "2021-02-22",
   "alerts": null,
   "deceased_date": null
  },
  {
   "pet_id": 12,
   "client_id": 12,
   "name": "Tucker",
   "species": "Cat",
   "breed": "British Shorthair",
   "sex": "Female",
   "birth_date": "2021-03-23",
   "alerts": null,
   "deceased_date": null
  },
  {
   "pet_id": 13,
   "client_id": 13,
   "name": "Rocky",
   "species": "Dog",
   "breed": "Beagle",
   "sex": "Male",
   "birth_date": "2021-04-24",
   "alerts": null,
   "deceased_date": null
  },
  {
   "pet_id": 14,
   "client_id": 14,
   "name": "Chloe",
   "species": "Cat",
   "breed": "Bengal",
   "sex": "Female",
   "birth_date": "2020-05-25",
   "alerts": null,
   "deceased_date": null
  },
  {
   "pet_id": 15,
   "client_id": 15,
   "name": "Buster",
   "species": "Dog",
   "breed": "Boxer",
   "sex": "Male",
   "birth_date": "2020-06-26",
   "alerts": null,
   "deceased_date": null
  },
  {
   "pet_id": 16,
   "client_id": 16,
   "name": "Ruby",
   "species": "Cat",
   "breed": "Sphynx",
   "sex": "Female",
   "birth_date": "2024-07-27",
   "alerts": null,
   "deceased_date": null
  },
  {
   "pet_id": 17,
   "client_id": 17,
   "name": "Duke",
   "species": "Dog",
   "breed": "Siberian Husky",
   "sex": "Male",
   "birth_date": "2020-08-28",
   "alerts": null,
   "deceased_date": null
  },
  {
   "pet_id": 18,
   "client_id": 18,
   "name": "Lola",
   "species": "Cat",
   "breed": "Abyssinian",
   "sex": "Female",
   "birth_date": "2020-09-29",
   "alerts": null,
   "deceased_date": null
  },
  {
   "pet_id": 19,
   "client_id": 19,
   "name": "Zoey",
   "species": "Dog",
   "breed": "Australian Shepherd",
   "sex": "Male",
   "birth_date": "2020-10-30",
   "alerts": null,
   "deceased_date": null
  },
  {
   "pet_id": 20,
   "client_id": 20,
   "name": "Zeus",
   "species": "Cat",
   "breed": "Scottish Fold",
   "sex": "Female",
   "birth_date": "2020-11-01",
   "alerts": null,
   "deceased_date": null
  }
 ],
 "medications": [
  {
   "med_id": 1,
   "name": "Amoxicillin",
   "form": "Tablet",
   "mg_no": 250,
   "unit_price": 12.5
  },
  {
   "med_id": 2,
   "name": "Clavamox",
   "form": "Tablet",
   "mg_no": 150,
   "unit_price": 28
  },
  {
   "med_id": 3,
   "name": "Rimadyl",
   "form": "Tablet",
   "mg_no": 75,
   "unit_price": 45
  },
  {
   "med_id": 4,
   "name": "Gabapentin",
   "form": "Capsule",
   "mg_no": 100,
   "unit_price": 15
  },
  {
   "med_id": 5,
   "name": "Meloxicam",
   "form": "Liquid",
   "mg_no": 2,
   "unit_price": 22.5
  },
  {
   "med_id": 6,
   "name": "Prednisone",
   "form": "Tablet",
   "mg_no": 10,
   "unit_price": 8
  },
  {
   "med_id": 7,
   "name": "Doxycycline",
   "form": "Tablet",
   "mg_no": 100,
   "unit_price": 30
  },
  {
   "med_id": 8,
   "name": "Metronidazole",
   "form": "Tablet",
   "mg_no": 250,
   "unit_price": 14
  },
  {
   "med_id": 9,
   "name": "Enrofloxacin",
   "form": "Tablet",
   "mg_no": 68,
   "unit_price": 38.5
  },
  {
   "med_id": 10,
   "name": "Furosemide",
   "form": "Tablet",
   "mg_no": 12,
   "unit_price": 10
  },
  {
   "med_id": 11,
   "name": "Tramadol",
   "form": "Tablet",
   "mg_no": 50,
   "unit_price": 18
  },
  {
   "med_id": 12,
   "name": "Phenobarbital",
   "form": "Tablet",
   "mg_no": 30,
   "unit_price": 16.5
  },
  {
   "med_id": 13,
   "name": "Methimazole",
   "form": "Tablet",
   "mg_no": 5,
   "unit_price": 25
  },
  {
   "med_id": 14,
   "name": "Levothyroxine",
   "form": "Tablet",
   "mg_no": 1,
   "unit_price": 20
  },
  {
   "med_id": 15,
   "name": "Ketoconazole",
   "form": "Tablet",
   "mg_no": 200,
   "unit_price": 35
  },
  {
   "med_id": 16,
   "name": "Cephalexin",
   "form": "Capsule",
   "mg_no": 500,
   "unit_price": 24
  },
  {
   "med_id": 17,
   "name": "Sucralfate",
   "form": "Tablet",
   "mg_no": 1000,
   "unit_price": 19
  },
  {
   "med_id": 18,
   "name": "Famotidine",
   "form": "Tablet",
   "mg_no": 20,
   "unit_price": 9.5
  },
  {
   "med_id": 19,
   "name": "Otomax (Ear Drops)",
   "form": "Liquid",
   "mg_no": 15,
   "unit_price": 31
  },
  {
   "med_id": 20,
   "name": "Azithromycin",
   "form": "Liquid",
   "mg_no": 200,
   "unit_price": 27
  },
  {
   "med_id": 21,
   "name": "Clindamycin",
   "form": "Capsule",
   "mg_no": 75,
   "unit_price": 21.5
  },
  {
   "med_id": 22,
   "name": "Spironolactone",
   "form": "Tablet",
   "mg_no": 25,
   "unit_price": 17
  },
  {
   "med_id": 23,
   "name": "Benazepril",
   "form": "Tablet",
   "mg_no": 5,
   "unit_price": 26
  },
  {
   "med_id": 24,
   "name": "Phenylpropanolamine",
   "form": "Tablet",
   "mg_no": 25,
   "unit_price": 32
  },
  {
   "med_id": 25,
   "name": "Ursodiol",
   "form": "Capsule",
   "mg_no": 250,
   "unit_price": 40
  },
  {
   "med_id": 26,
   "name": "Theophylline",
   "form": "Tablet",
   "mg_no": 100,
   "unit_price": 15.5
  },
  {
   "med_id": 27,
   "name": "Cyclosporine",
   "form": "Capsule",
   "mg_no": 25,
   "unit_price": 55
  },
  {
   "med_id": 28,
   "name": "Mirtazapine",
   "form": "Tablet",
   "mg_no": 15,
   "unit_price": 29
  },
  {
   "med_id": 29,
   "name": "Buprenorphine",
   "form": "Injection",
   "mg_no": 1,
   "unit_price": 42
  },
  {
   "med_id": 30,
   "name": "Acepromazine",
   "form": "Tablet",
   "mg_no": 10,
   "unit_price": 11
  }
 ],
 "appointments": [
  {
   "appt_id": 1,
   "pet_id": 1,
   "staff_id": 1,
   "appt_datetime": "2026-07-01T10:00",
   "reason": "Annual Checkup",
   "status": "Completed",
   "weight": "68.5 lbs",
   "temp": 97,
   "exam_notes": "Coat shiny, heart and lungs clear, mild tartar on back molars.",
   "diagnosis": "None"
  },
  {
   "appt_id": 2,
   "pet_id": 2,
   "staff_id": 1,
   "appt_datetime": "2026-07-02T11:00",
   "reason": "Microchip Implantation",
   "status": "Completed",
   "weight": "8.2 lbs",
   "temp": 98,
   "exam_notes": "Microchip implanted between shoulder blades; scanned and verified.",
   "diagnosis": "None"
  },
  {
   "appt_id": 3,
   "pet_id": 3,
   "staff_id": 1,
   "appt_datetime": "2026-07-03T12:00",
   "reason": "Annual Checkup",
   "status": "Completed",
   "weight": "76.0 lbs",
   "temp": 99,
   "exam_notes": "Good muscle tone, joints mobile, annual vaccinations updated.",
   "diagnosis": "None"
  },
  {
   "appt_id": 4,
   "pet_id": 4,
   "staff_id": 1,
   "appt_datetime": "2026-07-06T13:00",
   "reason": "Heartworm Testing & Refill",
   "status": "Completed",
   "weight": "14.5 lbs",
   "temp": 100,
   "exam_notes": "Blood draw completed; heartworm antigen test negative.",
   "diagnosis": "None"
  },
  {
   "appt_id": 5,
   "pet_id": 5,
   "staff_id": 1,
   "appt_datetime": "2026-07-07T14:00",
   "reason": "Annual Checkup",
   "status": "Completed",
   "weight": "24.0 lbs",
   "temp": 97,
   "exam_notes": "Normal breathing for breed, skin folds clean, weight stable.",
   "diagnosis": "None"
  },
  {
   "appt_id": 6,
   "pet_id": 6,
   "staff_id": 1,
   "appt_datetime": "2026-07-08T15:00",
   "reason": "Vomiting and Diarrhea",
   "status": "Completed",
   "weight": "7.8 lbs",
   "temp": 98,
   "exam_notes": "Mild dehydration, abdomen slightly tender on palpation.",
   "diagnosis": "Acute Gastroenteritis"
  },
  {
   "appt_id": 7,
   "pet_id": 7,
   "staff_id": 1,
   "appt_datetime": "2026-07-09T16:00",
   "reason": "Annual Checkup",
   "status": "Completed",
   "weight": "0.35 lbs",
   "temp": 99,
   "exam_notes": "Active and alert, cheek pouches clear, incisors normal length.",
   "diagnosis": "None"
  },
  {
   "appt_id": 8,
   "pet_id": 8,
   "staff_id": 1,
   "appt_datetime": "2026-07-10T10:00",
   "reason": "Straining to Urinate",
   "status": "Completed",
   "weight": "0.15 lbs",
   "temp": 100,
   "exam_notes": "Bladder feels firm, dampness around hindquarters, mild discomfort.",
   "diagnosis": "Urinary Tract Infection"
  },
  {
   "appt_id": 9,
   "pet_id": 9,
   "staff_id": 1,
   "appt_datetime": "2026-07-13T11:00",
   "reason": "Annual Checkup",
   "status": "Completed",
   "weight": "72.0 lbs",
   "temp": 97,
   "exam_notes": "Eyes and ears clear, energetic, advised on maintaining current diet.",
   "diagnosis": "None"
  },
  {
   "appt_id": 10,
   "pet_id": 10,
   "staff_id": 1,
   "appt_datetime": "2026-07-14T12:00",
   "reason": "Ear Infection",
   "status": "Completed",
   "weight": "11.0 lbs",
   "temp": 98,
   "exam_notes": "Dark waxy debris and redness in left ear canal; head shaking noted.",
   "diagnosis": "Otitis Externa"
  },
  {
   "appt_id": 11,
   "pet_id": 11,
   "staff_id": 1,
   "appt_datetime": "2026-07-15T13:00",
   "reason": "Annual Checkup",
   "status": "Completed",
   "weight": "13.5 lbs",
   "temp": 99,
   "exam_notes": "Clean teeth, normal heart rate, no fleas or ticks found.",
   "diagnosis": "None"
  },
  {
   "appt_id": 12,
   "pet_id": 12,
   "staff_id": 1,
   "appt_datetime": "2026-07-16T14:00",
   "reason": "Eye Discharge",
   "status": "Incomplete",
   "weight": "10.2 lbs",
   "temp": 100,
   "exam_notes": null,
   "diagnosis": null
  },
  {
   "appt_id": 13,
   "pet_id": 13,
   "staff_id": 1,
   "appt_datetime": "2026-07-17T15:00",
   "reason": "Annual Checkup",
   "status": "Incomplete",
   "weight": "25.5 lbs",
   "temp": 97,
   "exam_notes": null,
   "diagnosis": null
  },
  {
   "appt_id": 14,
   "pet_id": 14,
   "staff_id": 1,
   "appt_datetime": "2026-07-20T16:00",
   "reason": "Limping",
   "status": "Incomplete",
   "weight": "9.5 lbs",
   "temp": 98,
   "exam_notes": null,
   "diagnosis": null
  },
  {
   "appt_id": 15,
   "pet_id": 15,
   "staff_id": 1,
   "appt_datetime": "2026-07-21T09:00",
   "reason": "Annual Checkup",
   "status": "Incomplete",
   "weight": "65.0 lbs",
   "temp": 99,
   "exam_notes": null,
   "diagnosis": null
  },
  {
   "appt_id": 16,
   "pet_id": 16,
   "staff_id": 1,
   "appt_datetime": "2026-07-22T10:00",
   "reason": "Respiratory Distress",
   "status": "Incomplete",
   "weight": "7.2 lbs",
   "temp": 100,
   "exam_notes": null,
   "diagnosis": null
  },
  {
   "appt_id": 17,
   "pet_id": 17,
   "staff_id": 1,
   "appt_datetime": "2026-07-23T11:00",
   "reason": "Annual Checkup",
   "status": "Incomplete",
   "weight": "54.0 lbs",
   "temp": 97,
   "exam_notes": null,
   "diagnosis": null
  },
  {
   "appt_id": 18,
   "pet_id": 18,
   "staff_id": 1,
   "appt_datetime": "2026-07-24T12:00",
   "reason": "Bee Sting",
   "status": "Incomplete",
   "weight": "8.0 lbs",
   "temp": 98,
   "exam_notes": null,
   "diagnosis": null
  },
  {
   "appt_id": 19,
   "pet_id": 19,
   "staff_id": 1,
   "appt_datetime": "2026-07-27T13:00",
   "reason": "Annual Checkup",
   "status": "Incomplete",
   "weight": "48.5 lbs",
   "temp": 99,
   "exam_notes": null,
   "diagnosis": null
  },
  {
   "appt_id": 20,
   "pet_id": 20,
   "staff_id": 1,
   "appt_datetime": "2026-07-28T14:00",
   "reason": "Dental Cleaning",
   "status": "Incomplete",
   "weight": "9.1 lbs",
   "temp": 100,
   "exam_notes": null,
   "diagnosis": null
  }
 ],
 "administered": [
  {
   "administer_id": 1,
   "appt_id": 6,
   "med_id": 8,
   "quantity_given": 1,
   "next_due_date": "2026-08-08"
  },
  {
   "administer_id": 2,
   "appt_id": 8,
   "med_id": 1,
   "quantity_given": 1,
   "next_due_date": "2026-08-10"
  },
  {
   "administer_id": 3,
   "appt_id": 10,
   "med_id": 19,
   "quantity_given": 1,
   "next_due_date": "2026-08-14"
  }
 ],
 "prescriptions": [
  {
   "rx_id": 1,
   "appt_id": 6,
   "med_id": 8,
   "date_written": "2026-07-08",
   "quantity": 30,
   "refills": 1,
   "instructions": "Give one tablet twice daily with food"
  },
  {
   "rx_id": 2,
   "appt_id": 8,
   "med_id": 1,
   "date_written": "2026-07-10",
   "quantity": 30,
   "refills": 1,
   "instructions": "Give one tablet twice daily with food"
  },
  {
   "rx_id": 3,
   "appt_id": 10,
   "med_id": 19,
   "date_written": "2026-07-14",
   "quantity": 30,
   "refills": 1,
   "instructions": "Give one tablet twice daily with food"
  }
 ],
 "invoices": [
  {
   "invoice_id": 1,
   "appt_id": 1,
   "total": 100,
   "exam_fee": 100,
   "balance_due": 0
  },
  {
   "invoice_id": 2,
   "appt_id": 2,
   "total": 125,
   "exam_fee": 100,
   "balance_due": 0
  },
  {
   "invoice_id": 3,
   "appt_id": 3,
   "total": 100,
   "exam_fee": 100,
   "balance_due": 0
  },
  {
   "invoice_id": 4,
   "appt_id": 4,
   "total": 130,
   "exam_fee": 100,
   "balance_due": 0
  },
  {
   "invoice_id": 5,
   "appt_id": 5,
   "total": 100,
   "exam_fee": 100,
   "balance_due": 0
  },
  {
   "invoice_id": 6,
   "appt_id": 6,
   "total": 114,
   "exam_fee": 100,
   "balance_due": 0
  },
  {
   "invoice_id": 7,
   "appt_id": 7,
   "total": 100,
   "exam_fee": 100,
   "balance_due": 0
  },
  {
   "invoice_id": 8,
   "appt_id": 8,
   "total": 110,
   "exam_fee": 100,
   "balance_due": 0
  },
  {
   "invoice_id": 9,
   "appt_id": 9,
   "total": 100,
   "exam_fee": 100,
   "balance_due": 0
  },
  {
   "invoice_id": 10,
   "appt_id": 10,
   "total": 131,
   "exam_fee": 100,
   "balance_due": 0
  },
  {
   "invoice_id": 11,
   "appt_id": 11,
   "total": 100,
   "exam_fee": 100,
   "balance_due": 0
  },
  {
   "invoice_id": 12,
   "appt_id": 12,
   "total": 100,
   "exam_fee": 100,
   "balance_due": 100
  },
  {
   "invoice_id": 13,
   "appt_id": 13,
   "total": 100,
   "exam_fee": 100,
   "balance_due": 100
  },
  {
   "invoice_id": 14,
   "appt_id": 14,
   "total": 115,
   "exam_fee": 100,
   "balance_due": 115
  },
  {
   "invoice_id": 15,
   "appt_id": 15,
   "total": 100,
   "exam_fee": 100,
   "balance_due": 100
  },
  {
   "invoice_id": 16,
   "appt_id": 16,
   "total": 125,
   "exam_fee": 100,
   "balance_due": 125
  },
  {
   "invoice_id": 17,
   "appt_id": 17,
   "total": 100,
   "exam_fee": 100,
   "balance_due": 100
  },
  {
   "invoice_id": 18,
   "appt_id": 18,
   "total": 110,
   "exam_fee": 100,
   "balance_due": 110
  },
  {
   "invoice_id": 19,
   "appt_id": 19,
   "total": 100,
   "exam_fee": 100,
   "balance_due": 100
  },
  {
   "invoice_id": 20,
   "appt_id": 20,
   "total": 150,
   "exam_fee": 100,
   "balance_due": 150
  }
 ],
 "payments": [
  {
   "payment_no": 1,
   "invoice_id": 1,
   "pay_date": "2026-07-01",
   "amount": 100,
   "method": "Credit Card"
  },
  {
   "payment_no": 2,
   "invoice_id": 2,
   "pay_date": "2026-07-02",
   "amount": 125,
   "method": "Credit Card"
  },
  {
   "payment_no": 3,
   "invoice_id": 3,
   "pay_date": "2026-07-03",
   "amount": 100,
   "method": "Credit Card"
  },
  {
   "payment_no": 4,
   "invoice_id": 4,
   "pay_date": "2026-07-06",
   "amount": 130,
   "method": "Credit Card"
  },
  {
   "payment_no": 5,
   "invoice_id": 5,
   "pay_date": "2026-07-07",
   "amount": 100,
   "method": "Credit Card"
  },
  {
   "payment_no": 6,
   "invoice_id": 6,
   "pay_date": "2026-07-08",
   "amount": 114,
   "method": "Credit Card"
  },
  {
   "payment_no": 7,
   "invoice_id": 7,
   "pay_date": "2026-07-09",
   "amount": 100,
   "method": "Credit Card"
  },
  {
   "payment_no": 8,
   "invoice_id": 8,
   "pay_date": "2026-07-10",
   "amount": 110,
   "method": "Credit Card"
  },
  {
   "payment_no": 9,
   "invoice_id": 9,
   "pay_date": "2026-07-13",
   "amount": 100,
   "method": "Credit Card"
  },
  {
   "payment_no": 10,
   "invoice_id": 10,
   "pay_date": "2026-07-14",
   "amount": 131,
   "method": "Credit Card"
  },
  {
   "payment_no": 11,
   "invoice_id": 11,
   "pay_date": "2026-07-15",
   "amount": 100,
   "method": "Credit Card"
  }
 ]
};
