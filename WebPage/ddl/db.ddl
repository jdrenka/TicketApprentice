CREATE DATABASE IF NOT EXISTS AlphaBrainsDB;

USE AlphaBrainsDB;


DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS administrator;
DROP TABLE IF EXISTS eventOrganizer;
DROP TABLE IF EXISTS ticket;
DROP TABLE IF EXISTS orderSummary;
DROP TABLE IF EXISTS eventInfo;
DROP TABLE IF EXISTS person;

-- Create table statements

CREATE TABLE person (
    userID INTEGER AUTO_INCREMENT,
    username VARCHAR(50),
    password VARCHAR(255),
    email VARCHAR(255),
    organizer BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (userID)
);

CREATE TABLE eventInfo (
    eventID INTEGER AUTO_INCREMENT,
    eventTitle VARCHAR(255),
    eventDate DATE,
    address VARCHAR(255),
    coverPhoto BLOB,
    description VARCHAR(500),
    ticketPrice DECIMAL(10,2),
    numTickets INTEGER,
    PRIMARY KEY (eventID)
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

-- Add insert statements below here

INSERT INTO eventInfo (eventTitle, eventDate, address, coverPhoto, description, ticketPrice, numTickets)
VALUES 
    ('Concert 2024', '2024-05-15', '123 Main St', NULL, 'A fantastic musical event', 25.00, 500),
    ('Festival Extravaganza', '2024-06-20', '456 Oak St', NULL, 'Celebrate with music and food', 30.00, 800),
    ('Comedy Night', '2024-07-10', '789 Maple Ave', NULL, 'Laugh out loud with top comedians', 20.00, 300),
    ('Art Exhibition', '2024-08-05', '101 Pine Ln', NULL, 'Explore creativity through art', 15.00, 200),
    ('Tech Conference', '2024-09-15', '202 Tech Blvd', NULL, 'Stay updated with the latest tech trends', 50.00, 400),
    ('Fitness Challenge', '2024-10-08', '303 Wellness St', NULL, 'Get active and fit together', 10.00, 100);