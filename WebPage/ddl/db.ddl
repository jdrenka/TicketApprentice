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
    userID INTEGER,
    username VARCHAR(50),
    password VARCHAR(50),
    email VARCHAR(255),
    PRIMARY KEY (userID)
);

CREATE TABLE eventInfo (
    eventID INTEGER,
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
