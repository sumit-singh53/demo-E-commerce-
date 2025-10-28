describe('ecom site', () => {
  it('loads home page', () => {
    cy.visit('/');
    cy.contains('Cart').should('exist');
  });
});
