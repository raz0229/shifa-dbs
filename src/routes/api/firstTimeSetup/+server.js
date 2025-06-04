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
    doc_id INT PRIMARY KEY,
    name TEXT,
    fee INT
);`,

            // Create Prescription Table
            `CREATE TABLE Prescription (
    pres_id INT PRIMARY KEY,
    name TEXT,
    fee INT
);`,

            // Create Patient Table
            `CREATE TABLE Patient (
    id INT PRIMARY KEY,
    sex CHAR(1),
    phone TEXT,
    name TEXT,
    city TEXT
);`,

            // Create Appointment Table
            `CREATE TABLE Appointment (
    ap_id INT PRIMARY KEY,
    date INT,
    cause_of_visit TEXT,
    examiner INT,
    prescription INT,
    patient INT,
    FOREIGN KEY (examiner) REFERENCES Doctor(doc_id),
    FOREIGN KEY (prescription) REFERENCES Prescription(pres_id),
    FOREIGN KEY (patient) REFERENCES Patient(id) ON DELETE CASCADE
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
            `INSERT INTO Appointment (ap_id, date, cause_of_visit, examiner, prescription, patient) VALUES
(1001, 1749021055, 'Fever and Sore Throat', 101, 201, 1),
(1002, 1749021100, 'Routine Check-up', 102, 203, 2),
(1003, 1749021150, 'Headache and Nausea', 103, 202, 3),
(1004, 1749021200, 'Seasonal Allergies', 104, 204, 4),
(1005, 1749021250, 'Follow-up for Flu', 101, 201, 5);`
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
