describe("ChatGPT Component", () => {
  beforeEach(() => {
    // Visit the login page
    cy.visit("http://localhost:3000");

    // Perform login
    cy.get("[data-cy=email]").type("admin@admin.com");
    cy.get("[data-cy=password]").type("123456");
    cy.get("[data-cy=login]").click();

    // Wait for redirection to Dashboard

    cy.url().should("include", "/Dashboard");
  });

  it("should ask a financial question and get a response", () => {
    cy.visit("/Dashboard"); // Replace with the correct path

    // Type the financial question
    cy.get('[data-cy="chatgpt-question"]').type(
      "What is the best way to save money?"
    );

    // Submit the form
    cy.get('[data-cy="chatgpt-submit"]').click();

    // Check if loading text appears
    cy.get('[data-cy="chatgpt-loading-text"]').should("be.visible");

    // Wait for the response
    cy.get('[data-cy="chatgpt-response"]', { timeout: 10000 }).should(
      "be.visible"
    );

    // Validate the response contains expected text (this will depend on your backend implementation)
    cy.get('[data-cy="chatgpt-response"]').should("contain.text", "Response:");
  });
});
