export const byData = (data: string) => cy.getInput(`[data-cy="${data}"]`);
export const byId = (id: string) => cy.getInput(id);
export const getH1 = () => cy.get('h1');
