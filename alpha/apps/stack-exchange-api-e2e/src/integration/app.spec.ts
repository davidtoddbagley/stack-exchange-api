import { byData, getH1 } from '../support/app.po';

describe('stack-exchange-api', () => {
  beforeEach(() => cy.visit('/'));

  it('should display H1 title', () => {
    getH1().contains('stack-exchange-api');
  });

  it('should display Request Answers button', () => {
    byData('btn-q1');
  });

  it('should display Spinner when API Call is in progress', () => {
    byData('btn-q1').click();
    byData('btn-spin');
  });
});
