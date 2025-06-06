import { auth } from "$lib/config/firebaseapp";
import { onAuthStateChanged } from "firebase/auth"

export const TOP_CITIES_QUERY = `SELECT p.city, COUNT(p.id) AS patient_count, (COUNT(p.id) * 100.0 / (SELECT COUNT(*) FROM Patient)) AS percentage FROM Patient AS p GROUP BY p.city ORDER BY patient_count DESC LIMIT 5;`;

export const TOP_CAUSE_OF_VISITS_QUERY = `(SELECT cause_of_visit, COUNT(*) AS visit_count FROM Appointment GROUP BY cause_of_visit ORDER BY visit_count DESC LIMIT 3) UNION ALL (SELECT 'Others' AS cause_of_visit, SUM(t.visit_count) AS visit_count FROM (SELECT cause_of_visit, COUNT(*) AS visit_count FROM Appointment GROUP BY cause_of_visit) AS t WHERE t.cause_of_visit NOT IN (SELECT sq.cause_of_visit FROM (SELECT cause_of_visit FROM Appointment GROUP BY cause_of_visit ORDER BY COUNT(*) DESC LIMIT 3) AS sq)) ORDER BY CASE WHEN cause_of_visit = 'Others' THEN 1 ELSE 0 END, visit_count DESC;`;

export const PAST_WEEK_APPOINTMENTS_QUERY = `SELECT DATE_FORMAT(FROM_UNIXTIME(date), '%Y-%m-%d') AS appointment_day, COUNT(*) AS appointment_count FROM Appointment WHERE date >= UNIX_TIMESTAMP(CURDATE() - INTERVAL 6 DAY) GROUP BY appointment_day ORDER BY appointment_day ASC;`;

export const LIST_ALL_PATIENTS_QUERY = `SELECT P.id, P.name, P.sex, P.phone, P.city, COUNT(A.ap_id) AS total_appointments FROM Patient AS P LEFT JOIN Appointment AS A ON P.id = A.patient GROUP BY P.id, P.name, P.sex, P.phone, P.city ORDER BY P.name;`

export const LIST_ALL_APPOINTMENTS_QUERY = `SELECT A.ap_id, FROM_UNIXTIME(A.date) AS date, A.cause_of_visit AS cause, D.name AS doctor, D.doc_id as doc_id, D.fee AS fee, P.name AS patient, P.phone AS phone, P.city AS city, GROUP_CONCAT(Pr.name SEPARATOR ', ') AS prescription, SUM(Pr.fee) AS bill FROM Appointment AS A JOIN Doctor AS D ON A.examiner = D.doc_id JOIN Patient AS P ON A.patient = P.id LEFT JOIN AppointmentPrescription AS AP ON A.ap_id = AP.ap_id LEFT JOIN Prescription AS Pr ON AP.pres_id = Pr.pres_id GROUP BY A.ap_id, A.date, A.cause_of_visit, D.name, P.name ORDER BY A.date DESC`;

export const LIST_ALL_DOCTORS_QUERY = `SELECT * FROM Doctor`;

export const isSignedIn = async () => {
  return new Promise(async resolve => {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve({ user })
      } else {
        resolve(null);
      }

    });
  })
}

export const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

export const cities = ["Faisalabad", "Lahore", "Karachi", "Islamabad", "Peshawar", "Burewala", "Others"];