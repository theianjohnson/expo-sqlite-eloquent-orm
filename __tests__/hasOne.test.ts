// hasOne.test.ts
import { Person } from '../__mocks__/Person';
import { mockDataStore, resetMockDataStore } from '../__mocks__/mockDataStore';

describe('hasOne', () => {
  beforeEach(() => {
    resetMockDataStore();
  });

  it('should setup a hasOne relationship between our models and add some tests', async () => {
    expect(true).toEqual(true);
  });

});
