-- =====================================================================
-- LSU-VET: every query the website needs, one set per table.
--
-- Each block says which button triggers it. The website hands the backend
-- a change like:
--     { op: "update", table: "pets", key: { pet_id: 1 }, row: { ...all columns... } }
-- "table" is the website name in the section headers below (e.g. "pets"),
-- and the query uses the real table name (e.g. pet).
--
-- :name is a placeholder for the value of that column in "row"
-- (or in "key" for the WHERE clause). Fill placeholders with your
-- language's parameter binding, never by pasting values into the SQL text:
--   Python sqlite3:  conn.execute(sql, {"pet_id": 1, ...})   (works as written)
--   Java JDBC:       replace each :name with ? and call setXxx() in order
--
-- Run every change from one save inside ONE transaction, with
--   PRAGMA foreign_keys = ON;
-- turned on for the connection.
-- =====================================================================


-- ---------------------------------------------------------------------
-- clients  ->  table client   (primary key: client_id)
-- ---------------------------------------------------------------------

-- SELECT: page load (show the rows)
SELECT client_id, first_name, last_name, street, city, state, zip,
       phone_number, email
FROM client
ORDER BY client_id;

-- INSERT: "+ New" then Save
INSERT INTO client (client_id, first_name, last_name, street, city,
                    state, zip, phone_number, email)
VALUES (:client_id, :first_name, :last_name, :street, :city,
        :state, :zip, :phone_number, :email);

-- UPDATE: "Save changes" on an existing record
UPDATE client
SET first_name = :first_name, last_name = :last_name,
    street = :street, city = :city, state = :state, zip = :zip,
    phone_number = :phone_number, email = :email
WHERE client_id = :client_id;

-- DELETE: "Delete" then confirm
DELETE FROM client WHERE client_id = :client_id;


-- ---------------------------------------------------------------------
-- staff  ->  table staff   (primary key: staff_id)
-- ---------------------------------------------------------------------

-- SELECT: page load (show the rows)
SELECT staff_id, first_name, last_name, role, hire_date, license_no
FROM staff
ORDER BY staff_id;

-- INSERT: "+ New" then Save
INSERT INTO staff (staff_id, first_name, last_name, role, hire_date,
                   license_no)
VALUES (:staff_id, :first_name, :last_name, :role, :hire_date,
        :license_no);

-- UPDATE: "Save changes" on an existing record
UPDATE staff
SET first_name = :first_name, last_name = :last_name, role = :role,
    hire_date = :hire_date, license_no = :license_no
WHERE staff_id = :staff_id;

-- DELETE: "Delete" then confirm
DELETE FROM staff WHERE staff_id = :staff_id;


-- ---------------------------------------------------------------------
-- pets  ->  table pet   (primary key: pet_id)
-- ---------------------------------------------------------------------

-- SELECT: page load (show the rows)
SELECT pet_id, client_id, name, species, breed, sex, birth_date,
       alerts, deceased_date
FROM pet
ORDER BY pet_id;

-- INSERT: "+ New" then Save
INSERT INTO pet (pet_id, client_id, name, species, breed, sex,
                 birth_date, alerts, deceased_date)
VALUES (:pet_id, :client_id, :name, :species, :breed, :sex,
        :birth_date, :alerts, :deceased_date);

-- UPDATE: "Save changes" on an existing record
UPDATE pet
SET client_id = :client_id, name = :name, species = :species,
    breed = :breed, sex = :sex, birth_date = :birth_date,
    alerts = :alerts, deceased_date = :deceased_date
WHERE pet_id = :pet_id;

-- DELETE: "Delete" then confirm
DELETE FROM pet WHERE pet_id = :pet_id;


-- ---------------------------------------------------------------------
-- medications  ->  table medication   (primary key: med_id)
-- ---------------------------------------------------------------------

-- SELECT: page load (show the rows)
SELECT med_id, name, form, mg_no, unit_price
FROM medication
ORDER BY med_id;

-- INSERT: "+ New" then Save
INSERT INTO medication (med_id, name, form, mg_no, unit_price)
VALUES (:med_id, :name, :form, :mg_no, :unit_price);

-- UPDATE: "Save changes" on an existing record
UPDATE medication
SET name = :name, form = :form, mg_no = :mg_no,
    unit_price = :unit_price
WHERE med_id = :med_id;

-- DELETE: "Delete" then confirm
DELETE FROM medication WHERE med_id = :med_id;


-- ---------------------------------------------------------------------
-- appointments  ->  table appointment   (primary key: appt_id)
-- ---------------------------------------------------------------------

-- SELECT: page load (show the rows)
SELECT appt_id, pet_id, staff_id, appt_datetime, reason, status,
       weight, temp, exam_notes, diagnosis
FROM appointment
ORDER BY appt_id;

-- INSERT: "+ New" then Save
INSERT INTO appointment (appt_id, pet_id, staff_id, appt_datetime,
                         reason, status, weight, temp, exam_notes,
                         diagnosis)
VALUES (:appt_id, :pet_id, :staff_id, :appt_datetime, :reason,
        :status, :weight, :temp, :exam_notes, :diagnosis);

-- UPDATE: "Save changes" on an existing record
UPDATE appointment
SET pet_id = :pet_id, staff_id = :staff_id,
    appt_datetime = :appt_datetime, reason = :reason,
    status = :status, weight = :weight, temp = :temp,
    exam_notes = :exam_notes, diagnosis = :diagnosis
WHERE appt_id = :appt_id;

-- DELETE: "Delete" then confirm
DELETE FROM appointment WHERE appt_id = :appt_id;


-- ---------------------------------------------------------------------
-- administered  ->  table administered   (primary key: administer_id)
-- ---------------------------------------------------------------------

-- SELECT: page load (show the rows)
SELECT administer_id, appt_id, med_id, quantity_given, next_due_date
FROM administered
ORDER BY administer_id;

-- INSERT: "+ New" then Save
INSERT INTO administered (administer_id, appt_id, med_id,
                          quantity_given, next_due_date)
VALUES (:administer_id, :appt_id, :med_id, :quantity_given,
        :next_due_date);

-- UPDATE: "Save changes" on an existing record
UPDATE administered
SET appt_id = :appt_id, med_id = :med_id,
    quantity_given = :quantity_given, next_due_date = :next_due_date
WHERE administer_id = :administer_id;

-- DELETE: "Delete" then confirm
DELETE FROM administered WHERE administer_id = :administer_id;


-- ---------------------------------------------------------------------
-- prescriptions  ->  table prescription   (primary key: rx_id)
-- ---------------------------------------------------------------------

-- SELECT: page load (show the rows)
SELECT rx_id, appt_id, med_id, date_written, quantity, refills,
       instructions
FROM prescription
ORDER BY rx_id;

-- INSERT: "+ New" then Save
INSERT INTO prescription (rx_id, appt_id, med_id, date_written,
                          quantity, refills, instructions)
VALUES (:rx_id, :appt_id, :med_id, :date_written, :quantity,
        :refills, :instructions);

-- UPDATE: "Save changes" on an existing record
UPDATE prescription
SET appt_id = :appt_id, med_id = :med_id,
    date_written = :date_written, quantity = :quantity,
    refills = :refills, instructions = :instructions
WHERE rx_id = :rx_id;

-- DELETE: "Delete" then confirm
DELETE FROM prescription WHERE rx_id = :rx_id;


-- ---------------------------------------------------------------------
-- invoices  ->  table invoice   (primary key: invoice_id)
-- ---------------------------------------------------------------------

-- SELECT: page load (show the rows)
SELECT invoice_id, appt_id, total, exam_fee, balance_due
FROM invoice
ORDER BY invoice_id;

-- INSERT: "+ New" then Save
INSERT INTO invoice (invoice_id, appt_id, total, exam_fee, balance_due)
VALUES (:invoice_id, :appt_id, :total, :exam_fee, :balance_due);

-- UPDATE: "Save changes" on an existing record
UPDATE invoice
SET appt_id = :appt_id, total = :total, exam_fee = :exam_fee,
    balance_due = :balance_due
WHERE invoice_id = :invoice_id;

-- DELETE: "Delete" then confirm
DELETE FROM invoice WHERE invoice_id = :invoice_id;


-- ---------------------------------------------------------------------
-- payments  ->  table payment   (primary key: payment_no)
-- ---------------------------------------------------------------------

-- SELECT: page load (show the rows)
SELECT payment_no, invoice_id, pay_date, amount, method
FROM payment
ORDER BY payment_no;

-- INSERT: "+ New" then Save
INSERT INTO payment (payment_no, invoice_id, pay_date, amount, method)
VALUES (:payment_no, :invoice_id, :pay_date, :amount, :method);

-- UPDATE: "Save changes" on an existing record
UPDATE payment
SET invoice_id = :invoice_id, pay_date = :pay_date,
    amount = :amount, method = :method
WHERE payment_no = :payment_no;

-- DELETE: "Delete" then confirm
DELETE FROM payment WHERE payment_no = :payment_no;
