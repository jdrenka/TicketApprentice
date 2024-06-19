## TicketApprentice - COSC 310 Group Project

Our project is an event ticketing software that allows event organizers to easily sell tickets online. Users on our page can create and customize events, as well as browse events close to their location. Event organizers have the ability to include key information such as event date, time, description, location and ticket price. Each event listed by an event organizer will go through a verification process by an admin. The system will have a secure payment gateway so users can feel confident while making a transaction. The user-centric design will provide easy navigation and a seamless experience.. 

## How to run the application
1) Download node.js - [Download here](https://nodejs.org/en).
2) Clone GitHub repository to IDE (VS Code) - [How to clone here](https://learn.microsoft.com/en-us/azure/developer/javascript/how-to/with-visual-studio-code/clone-github-repository?tabs=activity-bar).
3) Locate **package.json** file in the VS code file explorer and Right Click -> Open in Integrated Terminal and type ```npm install``` to install dependencies.
4) Locate **app.js** file in the VS code file explorer and Right Click -> Open in Integrated Terminal and type ```node app.js```.
5) Console should prompt "Server running on port 3000". To access webpage, type ```localhost:3000``` into your web browser.


## Database connection
1. Install MySQL workbench.
2. Use MySQL Workbench to connect to the database using the credentials in the Discord server.



## User Requirements
- Login / logout
- Transfer tickets between users
- Purchase ticket(s)
- Choose seats
- Ticket receipt sent to email
- Share event link to others via social media
- Filter events based on date, location or price
- Use coupon codes
- Refer other users
- Profile page with customer details
- Payment
- Leave reviews on events
- Help page/customer support
- Refund and exchange options

## Functional Requirements
- Users will have the ability to search/sort for events by name, location, activity type and/or ticket price.
- The system will provide a list of events matching search criteria.
- Users will be able to add or remove tickets to their shopping cart; including multiple tickets and tickets from different events.
- Users will be able to choose their preferences such as seats (depending on event type) when choosing tickets.
- The system will validate availability and execute transactions.
- Users will have the ability to add, remove, or modify payment information.
- Upon purchase, an email will be sent to the user's registered email with an order summary.
- Users will also have the ability to apply to become an event organizer
- Event organizers will be able to propose events which are then reviewed by an admin.
- Event organizers will be able to adjust event information such as number of tickets, price of tickets, date, name of event, etc.
- Event organizers will then confirm and publish their event on the platform.


## Non-Functional Requirements
- System will be able to handle a large amount of users at one time without slowing down the system a significant amount.
- System will have secure payment processing that keeps event organizers and users information safe.
- The system will be scalable and will be designed so it can handle more transactions in the future.
- The system will work flawlessly on popular web browsers like Chrome, FireFox, Safari etc.
- The system will be compatible with mobile phones.
- The system will comply with data protection and privacy regulations.
- The system uptime will be kept up at least 99.9% of the time.
- System will be reliable with minimal downtime and backups will be kept in case of data loss.

  
## Group Members
- Kyle McLeod
- Justin Drenka
- Maximilian Bigwood
- Kussh Satija
- Dominick Pasutto
  
## Built Using
- Node.js
- HTML/CSS/Bootstrap
- Javascript
- MySQL Database 
- ExpressJS
