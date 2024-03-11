/* 
This is a test file for the index.html file. 
It checks if the h1 title and button are present in the HTML file.

We can run the test by running the command 'npm test' or 'npx mocha test/testIndex.js' in the terminal.
*/

const assert = require('assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

describe('index', () => {
    it('should have a heading with the correct text', () => {
        const html = fs.readFileSync('./Client/index.html', 'utf-8');
        const dom = new JSDOM(html);
        const heading = dom.window.document.querySelector('h1');

        assert.strictEqual(heading.textContent, 'Buy and sell tickets.');
    });

    it('should have a button with the correct class', () => {
        const html = fs.readFileSync('./Client/index.html', 'utf-8');
        const dom = new JSDOM(html);
        const button = dom.window.document.querySelector('.button2');

        assert.ok(button);
    });
});