import { getGreeting } from '../support/app.po';

describe('callcenter', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to callcenter!');
  });
});
