Cypress.Commands.add('signup', (email, password) => {
    cy.visit('/NewUser');
    cy.get('[data-cy=email]').type(email);
    cy.get('[data-cy=password]').type(password);
    cy.get('[data-cy=submit]').click();
  });
  
  Cypress.Commands.add('loginAndWaitForDashboard', (email, password) => {
    cy.visit('/');
    cy.get('[data-cy=email]').type(email);
    cy.get('[data-cy=password]').type(password);
    cy.get('[data-cy=login]').click();
  
    // Wait for the login request to complete
    cy.wait('@loginRequest');
  
    // Wait for an element on the dashboard page to be visible
    cy.get('[data-cy=dashboard-element]', { timeout: 10000 }).should('be.visible');
  });
  