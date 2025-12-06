-- Sample data for testing
USE mrca_students_hub;

-- Sample Materials
INSERT INTO materials (title, subject, `group`, semester, year, material_type, file_url, status) VALUES
('5th Semester Economics Question Paper 2024', 'Economics', 'B.A', '5th', '2024', 'Question Paper', 'https://example.com/files/eco_qp_2024.pdf', 'approved'),
('3rd Semester Physics Lab Manual', 'Physics', 'B.Sc', '3rd', '2023', 'Lab Material', 'https://example.com/files/physics_lab.pdf', 'approved'),
('6th Semester Accounts Notes', 'Accounts', 'B.Com', '6th', '2024', 'Notes', 'https://example.com/files/accounts_notes.pdf', 'pending');

-- Sample Notices
INSERT INTO notices (title, description, is_urgent, is_active) VALUES
('Internal exams postponed', 'Due to holiday, internal exams are postponed to next week.', TRUE, TRUE),
('Internship registration deadline', 'Last date for internship registration is 20-10-2025.', FALSE, TRUE),
('Lab manual submission', 'Submit lab manuals before semester exams start.', FALSE, TRUE);

-- Sample Updates
INSERT INTO updates (message, is_active) VALUES
('📚 New 5th semester question papers uploaded', TRUE),
('📅 October 2025 exam timetable released', TRUE),
('💼 New internship opportunities added', TRUE);

-- Sample Exam Timetable
INSERT INTO exam_timetables (title, subtitle, batch, schedule) VALUES
('III B.A., B.Sc., B.Com & B.B.A. Degree FIFTH SEMESTER - END (Supplementary) 20-22 Series',
 'Examinations OCTOBER 2025',
 '10 A.M. to 12.30 P.M.',
 '[{"date": "28-10-2025", "day": "Tuesday", "ba_subject": "Economics - VII (Banking)", "bsc_subject": "Mathematics - VI", "bcom_subject": "Management Accounting", "bba_subject": "Global HR Management"},
  {"date": "29-10-2025", "day": "Wednesday", "ba_subject": "History - VII", "bsc_subject": "Physics - VI", "bcom_subject": "Business Law", "bba_subject": "Marketing Strategy"}]');

-- Sample Slider Images
INSERT INTO slider_images (image_url, `order`, is_active) VALUES
('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop', 0, TRUE),
('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=600&fit=crop', 1, TRUE);