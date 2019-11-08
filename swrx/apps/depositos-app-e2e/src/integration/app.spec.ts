import { getGreeting } from '../support/app.po';

describe('depositos-app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to depositos-app!');
  });
});
