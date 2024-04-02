const { JSDOM } = require('jsdom');
const assert = require('assert');

describe('Contact Form', function() {
  let dom;

  beforeEach(function() {
    // Create a new JSDOM instance
    dom = new JSDOM(`
    `, { url: 'http://localhost/contactUs' });
  });

  it('should submit the form with valid data', function() {
    const window = dom.window;
    const document = window.document;

    // Simulate user input
    document.getElementById('firstName').value = 'Kyle';
    document.getElementById('lastName').value = 'McLeod';
    document.getElementById('email').value = 'myEmail@gmail.com';
    document.getElementById('subject').value = 'Test Subject';
    document.getElementById('message').value = 'Test Message';

    // Trigger form submission
    document.getElementById('contactForm').dispatchEvent(new window.Event('submit'));

    // Check if the form was submitted
    assert.strictEqual(window.location.href, 'http://localhost/submitContactForm');
  });

  it('should not submit the form with empty fields', function() {
    const window = dom.window;
    const document = window.document;

    // Trigger form submission
    document.getElementById('contactForm').dispatchEvent(new window.Event('submit'));

    // Check if the form was not submitted
    assert.strictEqual(window.location.href, 'http://localhost/contactUs');
  });
});
