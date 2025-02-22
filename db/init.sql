-- Create database if not exists
CREATE DATABASE IF NOT EXISTS todos;
USE todos;

-- Create task table
CREATE TABLE IF NOT EXISTS task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    is_completed BOOLEAN DEFAULT FALSE
);

-- Add some sample tasks (optional)
INSERT INTO task (title, description) VALUES 
    ('Complete project documentation', 'Write detailed documentation for the todo app project'),
    ('Review code', 'Perform code review for recent changes'),
    ('Setup testing', 'Configure and write initial unit tests');