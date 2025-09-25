describe('QuizLite Smoke Test', () => {
  it('should complete a basic quiz flow', () => {
    // Visit home page
    cy.visit('/');
    
    // Verify home page elements
    cy.contains('h1', 'QuizLite').should('be.visible');
    cy.contains('楽しく学べるクイズアプリ').should('be.visible');
    
    // Fill in the form
    cy.get('input[name="subject"][value="math"]').click();
    cy.get('input[name="mode"][value="input"]').click();
    cy.get('#total').select('3');
    
    // Start quiz
    cy.get('button[type="submit"]').click();
    
    // Verify we're on the quiz page
    cy.url().should('include', '/quiz');
    cy.get('.progress-bar').should('be.visible');
    
    // Answer first question
    cy.get('#answer-input').type('5');
    cy.get('.submit-answer-button').click();
    
    // Answer second question
    cy.get('#answer-input').should('have.value', '');
    cy.get('#answer-input').type('10');
    cy.get('.submit-answer-button').click();
    
    // Answer third question
    cy.get('#answer-input').should('have.value', '');
    cy.get('#answer-input').type('15');
    cy.get('.submit-answer-button').click();
    
    // Verify we're on the result page
    cy.url().should('include', '/result');
    cy.contains('クイズ終了！').should('be.visible');
    
    // Check result elements
    cy.get('.score-display').should('be.visible');
    cy.get('.retry-button').should('be.visible');
    
    // Go back to home
    cy.get('.retry-button').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});