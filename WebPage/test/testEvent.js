/* 
This is a test file for the event.html file. 

We can run the test by running the command 'npm test' or 'npx mocha test/testEvent.js' in the terminal.
*/

const assert = require('assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

describe('event', () => {
    it('should have a heading with the correct text', () => {
        const html = fs.readFileSync('./Client/event.html', 'utf-8');
        const dom = new JSDOM(html);
        const heading = dom.window.document.querySelector('h5');

        assert.strictEqual(heading.textContent, 'Event Title');
    });

    it('should have a date and time', () => {
        const html = fs.readFileSync('./Client/event.html', 'utf-8');
        const dom = new JSDOM(html);
        const cardTexts = dom.window.document.querySelectorAll('.card-text');
        const date = cardTexts[0];

        assert.ok(date.textContent, 'March 15, 2024 • 7:00 PM - 10:00 PM');
    });

    it('should have a location', () => {
        const html = fs.readFileSync('./Client/event.html', 'utf-8');
        const dom = new JSDOM(html);
        const cardTexts = dom.window.document.querySelectorAll('.card-text');
        const location = cardTexts[1];
    
        assert.ok(location.textContent, 'UBCO, Kelowna BC, Canada');
    });

    it('should have a location', () => {
        const html = fs.readFileSync('./Client/event.html', 'utf-8');
        const dom = new JSDOM(html);
        const cardTexts = dom.window.document.querySelectorAll('.card-text');
        const desc = cardTexts[2];
    
        assert.ok(desc.textContent, 'Description');
    });
    
    it('should have a location', () => {
        const html = fs.readFileSync('./Client/event.html', 'utf-8');
        const dom = new JSDOM(html);
        const cardTexts = dom.window.document.querySelectorAll('.card-text');
        const price = cardTexts[3];
    
        assert.ok(price.textContent, 'Price: $20.00');
    });

    it('should have a button with the correct class', () => {
        const html = fs.readFileSync('./Client/event.html', 'utf-8');
        const dom = new JSDOM(html);
        const button = dom.window.document.querySelector('.btn');

        assert.ok(button);
    });
});