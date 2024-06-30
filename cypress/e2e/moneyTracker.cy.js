describe("MoneyTracker Component", () => {
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

  it("should allow a user to fill out the form and submit it", () => {
    cy.get("[data-cy=bought-input]").type("Groceries");
    cy.get("[data-cy=money-spent-input]").clear().type("150");
    cy.get("[data-cy=category-select]").select("Food");
    cy.get("[data-cy=rating]")
      .click()
      .type("{leftarrow}{leftarrow}{leftarrow}{leftarrow}"); // adjust for your specific rating value
    cy.get("[data-cy=submit-button]").click();

    // Verify that the success message is shown
    cy.get("[data-cy=success-message]").should("be.visible");

    // Verify that the form fields are reset after submission
    cy.get("[data-cy=bought-input]").should("have.value", "");
    cy.get("[data-cy=money-spent-input]").should("have.value", "0");
    cy.get("[data-cy=category-select]").should("have.value", "");
    cy.get("[data-cy=rating] input:checked").should("not.exist");
  });

  it("should reset the form after submission", () => {
    cy.get("[data-cy=bought-input]").type("Groceries");
    cy.get("[data-cy=money-spent-input]").clear().type("150");
    cy.get("[data-cy=category-select]").select("Food");
    cy.get("[data-cy=rating]")
      .click()
      .type("{leftarrow}{leftarrow}{leftarrow}{leftarrow}"); // adjust for your specific rating value
    cy.get("[data-cy=submit-button]").click();

    // Verify that the success message is shown
    cy.get("[data-cy=success-message]").should("be.visible");

    // Verify that the form fields are reset after submission
    cy.get("[data-cy=bought-input]").should("have.value", "");
    cy.get("[data-cy=money-spent-input]").should("have.value", "0");
    cy.get("[data-cy=category-select]").should("have.value", "");
    cy.get("[data-cy=rating] input:checked").should("not.exist");
  });
});
