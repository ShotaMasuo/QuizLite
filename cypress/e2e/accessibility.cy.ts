describe('QuizLite Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should be navigable with keyboard only', () => {
    // Tab through home page elements
    cy.get('body').tab();
    cy.focused().should('have.attr', 'id', 'userName');
    
    // Tab to subject radio buttons
    cy.focused().tab();
    cy.focused().should('have.attr', 'value', 'english');
    
    cy.focused().tab();
    cy.focused().should('have.attr', 'value', 'math');
    
    // Tab to mode radio buttons
    cy.focused().tab();
    cy.focused().should('have.attr', 'value', 'input');
    
    cy.focused().tab();
    cy.focused().should('have.attr', 'value', 'choice4');
    
    // Tab to select and submit
    cy.focused().tab();
    cy.focused().should('have.attr', 'id', 'total');
    
    cy.focused().tab();
    cy.focused().should('have.attr', 'type', 'submit');
    
    // Submit with Enter
    cy.focused().type('{enter}');
    cy.url().should('include', '/quiz');
  });

  it('should have proper ARIA labels', () => {
    // Check form aria-label
    cy.get('form[aria-label="クイズ設定フォーム"]').should('exist');
    
    // Check fieldsets and legends
    cy.get('fieldset').should('have.length', 2);
    cy.get('legend').first().should('contain', '科目を選択');
    cy.get('legend').last().should('contain', '回答形式を選択');
    
    // Start quiz
    cy.startQuiz('english', 'choice4', 3);
    
    // Check quiz page ARIA
    cy.get('[role="progressbar"]').should('exist');
    cy.get('[role="progressbar"]').should('have.attr', 'aria-valuenow');
    cy.get('[role="progressbar"]').should('have.attr', 'aria-valuemin', '0');
    cy.get('[role="progressbar"]').should('have.attr', 'aria-valuemax', '100');
    
    // Check question card
    cy.get('[role="group"]').should('exist');
    cy.get('[role="radiogroup"]').should('exist');
    cy.get('.choice-button').first().should('have.attr', 'aria-pressed');
  });

  it('should have visible focus indicators', () => {
    // Check focus styles on form elements
    cy.get('#userName').focus();
    cy.focused().should('have.css', 'outline-style').and('not.eq', 'none');
    
    cy.get('input[name="subject"][value="english"]').focus();
    cy.focused().should('have.css', 'outline-style').and('not.eq', 'none');
    
    cy.get('button[type="submit"]').focus();
    cy.focused().should('have.css', 'box-shadow').and('include', 'rgba');
  });

  it('should work with screen reader labels', () => {
    // Start quiz
    cy.startQuiz('math', 'input', 3);
    
    // Check for screen reader only labels
    cy.get('.visually-hidden').should('exist');
    cy.get('label[for="answer-input"]').should('contain', '回答を入力');
    
    // Answer a question
    cy.get('#answer-input').type('5');
    cy.get('.submit-answer-button').click();
    
    // Continue to result
    cy.get('#answer-input').type('10');
    cy.get('.submit-answer-button').click();
    cy.get('#answer-input').type('15');
    cy.get('.submit-answer-button').click();
    
    // Check result page regions
    cy.get('[role="region"][aria-label="スコア"]').should('exist');
  });
});