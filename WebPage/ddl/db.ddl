CREATE DATABASE IF NOT EXISTS AlphaBrainsDB;

USE AlphaBrainsDB;


-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS administrator;
DROP TABLE IF EXISTS eventOrganizer;
DROP TABLE IF EXISTS ticket;
DROP TABLE IF EXISTS orderSummary;
DROP TABLE IF EXISTS eventInfo;
DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS message;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;


-- Create table statements

CREATE TABLE person (
    userID INTEGER AUTO_INCREMENT UNIQUE,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    address VARCHAR(255),
    city VARCHAR(255),
    country VARCHAR(255),
    zipCode VARCHAR(255),
    province VARCHAR(255),
    organizer BOOLEAN NOT NULL DEFAULT FALSE,
    admin BOOLEAN NOT NULL DEFAULT FALSE,  -- Must be hard coded. 
    PRIMARY KEY (userID)
);

CREATE TABLE eventInfo (
    eventID INTEGER AUTO_INCREMENT,
    eventTitle VARCHAR(255),
    eventDate DATE,
    address VARCHAR(255),
    coverPhoto VARCHAR(255),
    description VARCHAR(500),
    ticketPrice DECIMAL(10,2),
    numTickets INTEGER,
    categoryID INTEGER,
    PRIMARY KEY (eventID)
);

CREATE TABLE eventQueue (
    queueID INTEGER AUTO_INCREMENT,
    eventTitle VARCHAR(255),
    coverPhoto VARCHAR(255),
    eventDate DATE,
    address VARCHAR(255),
    description VARCHAR(500),
    ticketPrice DECIMAL(10,2),
    numTickets INTEGER,
    categoryID INTEGER,
    submissionTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewStatus ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    PRIMARY KEY (queueID)
);

CREATE TABLE ticket (
    ticketID INTEGER,
    eventID INTEGER,
    PRIMARY KEY (ticketID),
    FOREIGN KEY (eventID) REFERENCES eventInfo(eventID)
);

CREATE TABLE orderSummary (
    orderID INTEGER,
    userID INTEGER,
    orderDate DATE,
    orderTotal DECIMAL(10,2),
    PRIMARY KEY (orderID),
    FOREIGN KEY (userID) REFERENCES person(userID)
);

CREATE TABLE payment (
    paymentID INTEGER,
    orderID INTEGER,
    userID INTEGER,
    paymentTotal DECIMAL(10,2),
    paymentDate DATE,
    PRIMARY KEY (paymentID),
    FOREIGN KEY (orderID) REFERENCES orderSummary(orderID),
    FOREIGN KEY (userID) REFERENCES person(userID)
);

CREATE TABLE administrator (
    adminID INTEGER,
    PRIMARY KEY (adminID)
);

CREATE TABLE eventOrganizer (
    organizerID INTEGER,
    address VARCHAR(255),
    birthdate DATE,
    phoneNumber VARCHAR(20),
    PRIMARY KEY (organizerID)
);

CREATE TABLE category (
    categoryID INTEGER AUTO_INCREMENT,
    categoryName VARCHAR(50),
    categoryCoverPhoto VARCHAR(255),
    PRIMARY KEY (categoryID)
);

CREATE TABLE message (
    messageID INTEGER AUTO_INCREMENT,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    emailAddress VARCHAR(255),
    subject VARCHAR(255),
    message VARCHAR(10000),
    PRIMARY KEY (messageID)
);

-- ================ Add insert statements below here ================


-- Categories
INSERT INTO category (categoryName, categoryCoverPhoto) VALUES ('Concerts', 'https://storage.cloud.google.com/alphabrains/categoryCoverPhoto/concert.jpg');
INSERT INTO category (categoryName, categoryCoverPhoto) VALUES ('Sports', 'https://storage.cloud.google.com/alphabrains/categoryCoverPhoto/sports.jpg');
INSERT INTO category (categoryName, categoryCoverPhoto) VALUES ('Fitness', 'https://storage.cloud.google.com/alphabrains/categoryCoverPhoto/fitness.jpg');
INSERT INTO category (categoryName, categoryCoverPhoto) VALUES ('Tech', 'https://storage.cloud.google.com/alphabrains/categoryCoverPhoto/tech.jpg');
INSERT INTO category (categoryName, categoryCoverPhoto) VALUES ('Comedy', 'https://storage.cloud.google.com/alphabrains/categoryCoverPhoto/comedy.jpg');
INSERT INTO category (categoryName, categoryCoverPhoto) VALUES ('Art', 'https://storage.cloud.google.com/alphabrains/categoryCoverPhoto/art.jpg');

-- Events
INSERT INTO eventInfo (eventTitle, eventDate, address, coverPhoto, description, ticketPrice, numTickets, categoryID)
VALUES 
    ('Concert 2024', '2024-05-15', '123 Main St', 'https://storage.cloud.google.com/alphabrains/eventCoverPhoto/concert.jpg', 'Experience the thrill of live music with our spectacular Concert 2024. Join us for an unforgettable evening filled with mesmerizing performances by top artists from around the globe. Don\'t miss this opportunity to immerse yourself in the magic of music!', 25.00, 500, 1),
    ('Festival Extravaganza', '2024-06-20', '456 Oak St', 'https://storage.cloud.google.com/alphabrains/eventCoverPhoto/festival.jpg', 'Indulge in a celebration of culture, art, and cuisine at our Festival Extravaganza. Join us for a day of vibrant festivities, delicious food, and captivating performances. With something for everyone, it\'s an event you won\'t want to miss!', 30.00, 800, 1),
    ('Comedy Night', '2024-07-10', '789 Maple Ave', 'https://storage.cloud.google.com/alphabrains/eventCoverPhoto/comedy.jpg', 'Prepare to burst into laughter at our hilarious Comedy Night. Sit back and enjoy side-splitting performances by some of the funniest comedians in the industry. Get ready for an evening of non-stop entertainment and laughter!', 20.00, 300, 5),
    ('Art Exhibition', '2024-08-05', '101 Pine Ln', 'https://storage.cloud.google.com/alphabrains/eventCoverPhoto/art.jpg', 'Embark on a journey of creativity and inspiration at our Art Exhibition. Immerse yourself in a world of colors, shapes, and emotions as you explore stunning artworks created by talented artists. It\'s an artistic experience like no other!', 15.00, 200, 6),
    ('Tech Conference', '2024-09-15', '202 Tech Blvd', 'https://storage.cloud.google.com/alphabrains/eventCoverPhoto/tech.jpg', 'Stay ahead of the curve at our cutting-edge Tech Conference. Join industry experts and thought leaders as they share insights, innovations, and strategies shaping the future of technology. Get ready to elevate your tech game!', 50.00, 400, 4),
    ('Fitness Challenge', '2024-10-08', '303 Wellness St', 'https://storage.cloud.google.com/alphabrains/eventCoverPhoto/fitness.jpg', 'Push your limits and break a sweat at our exhilarating Fitness Challenge. Whether you\'re a fitness enthusiast or just starting your journey, this event is designed to motivate and inspire you to achieve your fitness goals. Get ready to challenge yourself and unleash your inner athlete!', 10.00, 100, 3);

