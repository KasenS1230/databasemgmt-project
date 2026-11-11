import sqlite3

connect = sqlite3.connect('vet.db')
cursor = connect.cursor()

cursor.execute("""
    CREATE TABLE client (
        client_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        street TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip TEXT NOT NULL,
        phone_number INTEGER UNIQUE,
        email TEXT UNIQUE
        );
    """)

cursor.execute("""
    CREATE TABLE pet (
        pet_id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        species TEXT NOT NULL,
        breed TEXT NOT NULL,
        sex TEXT NOT NULL,
        birth_date TEXT NOT NULL,
        alerts TEXT,
        deceased_date TEXT,
        FOREIGN KEY (client_id) REFERENCES client (client_id)
        );
    """)

#removing age

cursor.execute("""
    CREATE TABLE staff (
        staff_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        role TEXT NOT NULL,
        hire_date TEXT NOT NULL,
        license_no INTEGER
        );
    """)

cursor.execute("""
    CREATE TABLE appointment (
        appt_id INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_id INTEGER NOT NULL,
        staff_id INTEGER NOT NULL,
        appt_datetime TEXT NOT NULL,
        reason TEXT NOT NULL,
        status TEXT NOT NULL,
        weight TEXT NOT NULL,
        temp INTEGER NOT NULL,
        exam_notes TEXT,
        diagnosis TEXT,
        FOREIGN KEY (pet_id) REFERENCES pet (pet_id),
        FOREIGN KEY (staff_id) REFERENCES staff (staff_id)
        );
    """)

#added a foreign key reference to pet

cursor.execute("""
    CREATE TABLE medication (
        med_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        form TEXT NOT NULL,
        mg_no INTEGER NOT NULL,
        unit_price REAL NOT NULL
        );
    """)

cursor.execute("""
    CREATE TABLE prescription (
        rx_id INTEGER PRIMARY KEY AUTOINCREMENT,
        appt_id INTEGER NOT NULL,
        med_id INTEGER NOT NULL,
        date_written TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        refills INTEGER NOT NULL,
        instructions TEXT NOT NULL,
        FOREIGN KEY (med_id) REFERENCES medication (med_id),
        FOREIGN KEY (appt_id) REFERENCES appointment (appt_id)
        );
    """)

cursor.execute("""
    CREATE TABLE invoice (
        invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
        appt_id INTEGER NOT NULL,
        total REAL NOT NULL,
        exam_fee REAL NOT NULL,
        balance_due REAL NOT NULL,
        FOREIGN KEY (appt_id) REFERENCES appointment (appt_id)
        );
    """)

cursor.execute("""
    CREATE TABLE payment (
        payment_no INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_id INTEGER NOT NULL,
        pay_date TEXT NOT NULL,
        amount REAL NOT NULL,
        method TEXT NOT NULL,
        FOREIGN KEY (invoice_id) REFERENCES invoice (invoice_id)
        );
    """)

#relationship set table below
cursor.execute("""
    CREATE TABLE administered (
        administer_id INTEGER PRIMARY KEY AUTOINCREMENT,
        appt_id INTEGER NOT NULL,
        med_id INTEGER NOT NULL,
        quantity_given INTEGER NOT NULL,
        next_due_date TEXT NOT NULL,
        FOREIGN KEY (appt_id) REFERENCES appointment (appt_id),
        FOREIGN KEY (med_id) REFERENCES medication (med_id)
        );
    """)

connect.commit()
connect.close()
