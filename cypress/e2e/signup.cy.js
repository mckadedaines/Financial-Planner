describe('User Authentication', () => {
  const email = 'testuser@example.com';
  const password = 'Password123!';

  beforeEach(() => {
    // Mock the API response for the login request
    cy.intercept('POST', '**/accounts:signInWithPassword**', {
      statusCode: 200,
      body: {
        idToken: 'fake-id-token',
        email,
        refreshToken: 'fake-refresh-token',
        expiresIn: '3600',
        localId: 'fake-local-id'
      }
    }).as('loginRequest');

    cy.intercept('POST', '**/accounts:lookup**', {
      statusCode: 200,
      body: {
        users: [{
          localId: 'fake-local-id',
          email,
          emailVerified: true,
          displayName: '',
          providerUserInfo: []
        }]
      }
    }).as('userLookup');
  });

  it('should sign up a new user', () => {
    cy.signup(email, password);
    cy.url().should('include', '/');
  });

  it('should log in with the new user', () => {
    cy.visit('/');
    cy.get('[data-cy=email]').type(email);
    cy.get('[data-cy=password]').type(password);
    cy.get('[data-cy=login]').click();
    cy.wait('@loginRequest');
    cy.url().should('include', '/Dashboard');
  });
});
