/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    startQuiz(subject: 'english' | 'math', mode: 'input' | 'choice4', total: number): void;
  }
}

Cypress.Commands.add('startQuiz', (subject: 'english' | 'math', mode: 'input' | 'choice4', total: number) => {
  cy.visit('/');
  
  // Select subject
  cy.get(`input[name="subject"][value="${subject}"]`).click();
  
  // Select mode
  cy.get(`input[name="mode"][value="${mode}"]`).click();
  
  // Select total
  cy.get('#total').select(total.toString());
  
  // Start quiz
  cy.get('button[type="submit"]').click();
});