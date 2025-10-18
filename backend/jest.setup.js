// Setup file for Jest
jest.setTimeout(30000);

// Mock console.log to keep test output clean
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
};