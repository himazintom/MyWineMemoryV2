// Mock Firebase first
jest.mock('../firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  Timestamp: {
    fromDate: jest.fn((date) => ({ toDate: () => date })),
  },
}));

import { wineMasterService } from '../wineMasterService';

describe('WineMasterService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be importable', () => {
    expect(wineMasterService).toBeDefined();
  });

  it('should have expected methods', () => {
    expect(typeof wineMasterService.getWineMaster).toBe('function');
    expect(typeof wineMasterService.createOrFindWineMaster).toBe('function');
    expect(typeof wineMasterService.searchWineMasters).toBe('function');
  });
});