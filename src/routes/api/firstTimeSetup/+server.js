import pool from '$lib/server/db.js';
import { json } from '@sveltejs/kit';
import { SETUP_PASSWORD } from '$env/static/private';

export async function POST({ request }) {
    try {
        const body = await request.json();
        const { password } = body;

        if (password !== SETUP_PASSWORD) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const queries = [
            // Create Doctor Table
            `CREATE TABLE Doctor (
    doc_id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT,
    fee INT
);`,

            // Create Prescription Table
            `CREATE TABLE Prescription (
    pres_id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT,
    fee INT
);`,

            // Create Patient Table
            `CREATE TABLE Patient (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sex CHAR(1),
    phone TEXT,
    name TEXT,
    city TEXT
);`,

            // Create Appointment Table
            `CREATE TABLE Appointment (
    ap_id INT PRIMARY KEY AUTO_INCREMENT,
    date INT,
    cause_of_visit TEXT,
    examiner INT,
    patient INT,
    FOREIGN KEY (examiner) REFERENCES Doctor(doc_id),
    FOREIGN KEY (patient) REFERENCES Patient(id) ON DELETE CASCADE
);`,


`CREATE TABLE AppointmentPrescription (
    ap_id INT NOT NULL,
    pres_id INT NOT NULL,

    PRIMARY KEY (ap_id, pres_id),
    FOREIGN KEY (ap_id) REFERENCES Appointment(ap_id) ON DELETE CASCADE,
    FOREIGN KEY (pres_id) REFERENCES Prescription(pres_id) ON DELETE CASCADE
);`,

            // Insert Doctor Data
            `INSERT INTO Doctor (doc_id, name, fee) VALUES
(101, 'Dr. Abdurrehman Sandhu', 1500),
(102, 'Dr. Ramzan Usman', 1200),
(103, 'Dr. Bilal Siddiqui', 1800),
(104, 'Dr. Ayesha Malik', 1000);`,

            // Insert Prescription Data
            `INSERT INTO Prescription (pres_id, name, fee) VALUES
(201, 'Antibiotics Course', 500),
(202, 'Painkillers & Antacids', 300),
(203, 'Multivitamin Supplement', 250),
(204, 'Allergy Medication', 400);`,

            // Insert Patient Data
            `INSERT INTO Patient (id, sex, phone, name, city) VALUES
(1, 'M', '03001234567', 'Usman Tariq', 'Lahore'),
(2, 'F', '03337654321', 'Fatima Zahra', 'Karachi'),
(3, 'M', '03219876543', 'Ali Raza', 'Islamabad'),
(4, 'F', '03451122334', 'Zainab Bibi', 'Faisalabad'),
(5, 'M', '03105566778', 'Imran Khan', 'Peshawar');`,

            // Insert Appointment Data
            `INSERT INTO Appointment (ap_id, date, cause_of_visit, examiner, patient) VALUES
(1001, 1749021055, 'Fever and Sore Throat', 101, 1),
(1002, 1749021100, 'Routine Check-up', 102, 2),
(1003, 1749021150, 'Headache and Nausea', 103, 3),
(1004, 1749021200, 'Seasonal Allergies', 104, 4),
(1005, 1749021250, 'Follow-up for Flu', 101, 5);`,

// Insert Prescriptions into Appointments 
`INSERT INTO AppointmentPrescription (ap_id, pres_id) VALUES 
(1001, 201),
(1001, 202),
(1002, 203),
(1003, 202),
(1003, 203),
(1003, 204),
(1004, 204),
(1005, 202);`


        ];

        for (const q of queries) {
            await pool.query(q);
        }

        return json({ success: true, message: 'Tables created successfully' });

    } catch (error) {
        console.error('Setup failed:', error);
        return json({ error: 'Internal Server Error' }, { status: 500, message: error.code });
    }
}
