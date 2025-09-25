describe('QuizLite Full Flow Test', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should complete English input quiz with perfect score', () => {
    // Start English input quiz
    cy.startQuiz('english', 'input', 5);
    
    // Wait for quiz to load
    cy.get('.question-card').should('be.visible');
    
    // Answer all questions (we'll simulate knowing all answers)
    for (let i = 0; i < 5; i++) {
      // Get the question text to determine answer
      cy.get('.question-text').then(($el) => {
        const text = $el.text();
        let answer = 'test'; // default answer
        
        // Simple mapping for testing
        if (text.includes('apple')) answer = 'りんご';
        if (text.includes('book')) answer = '本';
        if (text.includes('cat')) answer = '猫';
        if (text.includes('dog')) answer = '犬';
        if (text.includes('fish')) answer = '魚';
        
        cy.get('#answer-input').type(answer);
        cy.get('.submit-answer-button').click();
      });
      
      // Wait for next question or result
      if (i < 4) {
        cy.get('#answer-input').should('have.value', '');
      }
    }
    
    // Verify result page
    cy.url().should('include', '/result');
    cy.get('.score-percentage').should('contain', '%');
    cy.get('.result-message').should('be.visible');
  });

  it('should complete English 4-choice quiz', () => {
    // Start English 4-choice quiz
    cy.startQuiz('english', 'choice4', 3);
    
    // Answer questions by selecting choices
    for (let i = 0; i < 3; i++) {
      cy.get('.choice-button').first().click();
      cy.wait(600); // Wait for transition
    }
    
    // Verify result page
    cy.url().should('include', '/result');
    cy.get('.mistakes-section').should('exist');
  });

  it('should handle user name input', () => {
    // Enter user name
    cy.get('#userName').type('テスト太郎');
    
    // Complete quiz setup
    cy.get('input[name="subject"][value="math"]').click();
    cy.get('#total').select('3');
    cy.get('button[type="submit"]').click();
    
    // Answer questions
    for (let i = 0; i < 3; i++) {
      cy.get('#answer-input').type(`${i + 1}`);
      cy.get('.submit-answer-button').click();
    }
    
    // Verify name appears in result
    cy.contains('テスト太郎さんの結果').should('be.visible');
  });

  it('should show wrong answers in result', () => {
    cy.startQuiz('math', 'input', 3);
    
    // Answer all questions incorrectly
    for (let i = 0; i < 3; i++) {
      cy.get('#answer-input').type('wrong');
      cy.get('.submit-answer-button').click();
    }
    
    // Verify mistakes section
    cy.get('.mistakes-section').should('be.visible');
    cy.get('.mistake-item').should('have.length', 3);
    cy.get('.user-answer.wrong').should('have.length', 3);
    cy.get('.correct-answer').should('have.length', 3);
  });
});