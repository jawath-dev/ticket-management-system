USE ticket_management;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE ticket_status_history;
TRUNCATE TABLE ticket_comments;
TRUNCATE TABLE tickets;
TRUNCATE TABLE customers;
TRUNCATE TABLE users;
TRUNCATE TABLE categories;

SET FOREIGN_KEY_CHECKS = 1;

-- Categories
INSERT INTO categories (name) VALUES
('Technical'),
('Billing'),
('Account'),
('General');

-- Users (Support Agents)
INSERT INTO users (name, email, role) VALUES
('Mohamed Rizwan', 'mohamed.rizwan@gmail.com', 'agent'),
('Fathima Sara', 'fathima.sara@gmail.com', 'agent'),
('Mohamed Irfan', 'mohamed.irfan@gmail.com', 'agent');

-- Customers
INSERT INTO customers (name, email, phone) VALUES
('Mohamed Rusdi', 'mohamed.rusdi@gmail.com', '+94771234567'),
('Ahamed Nazeer', 'ahamed.nazeer@gmail.com', '+94762345678'),
('Mohamed Rilwan', 'mohamed.rilwan@gmail.com', '+94753456789'),
('Mohamed Sajeeth', 'mohamed.sajeeth@gmail.com', '+94724567890'),
('Mohamed Fahim', 'mohamed.fahim@gmail.com', '+94775678901'),
('Mohamed Farik', 'mohamed.farik@gmail.com', '+94766789012'),
('Fathima Fahima', 'fathima.fahima@gmail.com', '+94757890123');

-- Set tickets table to start IDs from 1001
ALTER TABLE tickets AUTO_INCREMENT = 1001;

-- Tickets
INSERT INTO tickets (subject, description, customer_id, agent_id, category_id, priority, status, due_date, created_at) VALUES
('Unable to login', 'Customer cannot access account after password reset', 1, 1, 1, 'HIGH', 'OPEN', DATE_ADD(NOW(), INTERVAL 24 HOUR), NOW()),
('Payment failure', 'Credit card payment declined multiple times', 2, 2, 2, 'URGENT', 'IN_PROGRESS', DATE_ADD(NOW(), INTERVAL 8 HOUR), NOW()),
('Account upgrade request', 'Customer wants to upgrade to premium plan', 3, 1, 3, 'LOW', 'RESOLVED', DATE_ADD(NOW(), INTERVAL 72 HOUR), NOW()),
('App crashing on startup', 'Mobile app crashes immediately after opening', 4, 3, 1, 'HIGH', 'OPEN', DATE_ADD(NOW(), INTERVAL 24 HOUR), NOW()),
('Refund not received', 'Refund requested 10 days ago, not credited yet', 5, 2, 2, 'MEDIUM', 'WAITING_FOR_CUSTOMER', DATE_ADD(NOW(), INTERVAL 48 HOUR), NOW()),
('Cannot update profile', 'Error when saving profile changes', 1, NULL, 1, 'LOW', 'OPEN', DATE_ADD(NOW(), INTERVAL 72 HOUR), NOW()),
('Duplicate charge', 'Charged twice for same order', 2, 1, 2, 'URGENT', 'OPEN', DATE_ADD(NOW(), INTERVAL 8 HOUR), NOW()),
('Feature request - dark mode', 'Customer requesting dark mode option', 3, NULL, 4, 'LOW', 'OPEN', DATE_ADD(NOW(), INTERVAL 72 HOUR), NOW()),
('Two-factor auth not working', 'OTP not received on registered mobile', 4, 3, 1, 'HIGH', 'IN_PROGRESS', DATE_ADD(NOW(), INTERVAL 24 HOUR), NOW()),
('Billing address wrong', 'Need to update billing address on invoice', 5, 2, 2, 'MEDIUM', 'RESOLVED', DATE_ADD(NOW(), INTERVAL 48 HOUR), NOW()),
('Account locked', 'Account locked after multiple failed attempts', 1, 1, 3, 'HIGH', 'OPEN', DATE_ADD(NOW(), INTERVAL 24 HOUR), NOW()),
('Slow app performance', 'App takes long time to load dashboard', 2, 3, 1, 'MEDIUM', 'IN_PROGRESS', DATE_ADD(NOW(), INTERVAL 48 HOUR), NOW()),
('Subscription cancellation', 'Customer wants to cancel subscription', 3, 2, 3, 'LOW', 'WAITING_FOR_CUSTOMER', DATE_ADD(NOW(), INTERVAL 72 HOUR), NOW()),
('Invoice not generated', 'Monthly invoice missing for last billing cycle', 4, 1, 2, 'MEDIUM', 'OPEN', DATE_ADD(NOW(), INTERVAL 48 HOUR), NOW()),
('General inquiry', 'Question about service coverage areas', 5, NULL, 4, 'LOW', 'OPEN', DATE_ADD(NOW(), INTERVAL 72 HOUR), NOW()),
('Data export issue', 'Exported CSV file has missing columns', 1, 3, 1, 'MEDIUM', 'IN_PROGRESS', DATE_ADD(NOW(), INTERVAL 48 HOUR), NOW()),
('Urgent security concern', 'Suspicious login activity detected', 2, 1, 1, 'URGENT', 'OPEN', DATE_ADD(NOW(), INTERVAL 8 HOUR), NOW()),
('Password reset email missing', 'Reset link email not received', 3, 2, 1, 'HIGH', 'RESOLVED', DATE_ADD(NOW(), INTERVAL 24 HOUR), NOW()),
('Plan comparison query', 'Customer wants to compare pricing plans', 4, NULL, 4, 'LOW', 'OPEN', DATE_ADD(NOW(), INTERVAL 72 HOUR), NOW()),
('Old resolved ticket', 'Sample closed ticket for testing', 5, 1, 3, 'MEDIUM', 'CLOSED', DATE_ADD(NOW(), INTERVAL 48 HOUR), NOW()),
('Notification settings broken', 'Push notifications not working on Android', 6, 2, 1, 'MEDIUM', 'OPEN', DATE_ADD(NOW(), INTERVAL 48 HOUR), NOW()),
('Wrong item delivered', 'Received different product than ordered', 7, 3, 4, 'HIGH', 'IN_PROGRESS', DATE_ADD(NOW(), INTERVAL 24 HOUR), NOW()),
('Cannot download invoice PDF', 'PDF download link returns 404 error', 6, NULL, 2, 'LOW', 'OPEN', DATE_ADD(NOW(), INTERVAL 72 HOUR), NOW()),
('Multiple login attempts blocked', 'Account temporarily locked for security', 7, 1, 3, 'URGENT', 'OPEN', DATE_ADD(NOW(), INTERVAL 8 HOUR), NOW()),
('API integration query', 'Need documentation for REST API access', 1, 2, 1, 'LOW', 'WAITING_FOR_CUSTOMER', DATE_ADD(NOW(), INTERVAL 72 HOUR), NOW()),
('Mobile app UI glitch', 'Buttons overlapping on smaller screens', 2, 3, 1, 'MEDIUM', 'RESOLVED', DATE_ADD(NOW(), INTERVAL 48 HOUR), NOW()),
('Coupon code not applying', 'Discount code shows invalid at checkout', 3, NULL, 2, 'MEDIUM', 'OPEN', DATE_ADD(NOW(), INTERVAL 48 HOUR), NOW()),
('Change email address', 'Customer wants to update registered email', 4, 1, 3, 'LOW', 'IN_PROGRESS', DATE_ADD(NOW(), INTERVAL 72 HOUR), NOW()),
('Server timeout errors', 'Getting 504 errors during peak hours', 5, 2, 1, 'URGENT', 'OPEN', DATE_ADD(NOW(), INTERVAL 8 HOUR), NOW()),
('Feedback on new feature', 'General feedback about recent app update', 6, NULL, 4, 'LOW', 'CLOSED', DATE_ADD(NOW(), INTERVAL 72 HOUR), NOW());

-- Make a few tickets overdue for testing
UPDATE tickets SET due_date = DATE_SUB(NOW(), INTERVAL 5 HOUR) WHERE id = 1001;
UPDATE tickets SET due_date = DATE_SUB(NOW(), INTERVAL 2 DAY) WHERE id = 1004;
UPDATE tickets SET due_date = DATE_SUB(NOW(), INTERVAL 1 DAY) WHERE id = 1021;

-- Make one ticket "closing soon" (due in 1 hour) to test SLA warning
UPDATE tickets SET due_date = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = 1002;

-- Sample comments
INSERT INTO ticket_comments (ticket_id, user_id, comment) VALUES
(1001, 1, 'Checking the account settings now'),
(1001, 2, 'Password reset link has been resent to the customer'),
(1002, 2, 'Contacted the payment gateway support team'),
(1004, 3, 'Unable to reproduce the crash, requesting more details from customer'),
(1009, 3, 'OTP service was down, issue has been escalated');