describe('TechShop App Navigation', () => {

  it('loads the Home Page', () => {
    cy.visit('http://localhost:8080/');
    cy.contains('Latest Products'); //
    cy.wait(1000);
  });

  it('navigates to Cart page', () => {
    cy.visit('http://localhost:8080/');
    cy.get('a').contains('Cart').click();
    cy.url().should('include', '/cart');
    cy.contains('Shopping Cart');
  });

  it('navigates to Login page', () => {
    cy.visit('http://localhost:8080/');
    cy.get('a').contains('Sign In').click();
    cy.url().should('include', '/login');
    cy.contains('Sign In');
  });

  it('navigates from Login to Register page', () => {
  cy.visit('http://localhost:8080/login');
  cy.contains('New Customer?').should('be.visible');
  cy.contains('Register').click({ force: true });
  cy.url().should('include', '/register');
  cy.contains('Sign Up');
});


});
