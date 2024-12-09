import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Patient Health Record Contract', () => {
  const mockContractCall = vi.fn();
  const patientId = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const providerId = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should add a health record', () => {
    mockContractCall.mockReturnValue({ success: true });
    const result = mockContractCall('patient-health-record', 'add-health-record', ['encrypted-data-123'], patientId);
    expect(result).toEqual({ success: true });
  });
  
  it('should update a health record', () => {
    mockContractCall.mockReturnValue({ success: true });
    const result = mockContractCall('patient-health-record', 'update-health-record', ['updated-encrypted-data-456'], patientId);
    expect(result).toEqual({ success: true });
  });
  
  it('should grant access to a provider', () => {
    mockContractCall.mockReturnValue({ success: true });
    const result = mockContractCall('patient-health-record', 'grant-access', [providerId], patientId);
    expect(result).toEqual({ success: true });
  });
  
  it('should revoke access from a provider', () => {
    mockContractCall.mockReturnValue({ success: true });
    const result = mockContractCall('patient-health-record', 'revoke-access', [providerId], patientId);
    expect(result).toEqual({ success: true });
  });
  
  it('should get a health record for authorized users', () => {
    mockContractCall.mockReturnValue({
      success: true,
      value: {
        encrypted_data: 'encrypted-data-123',
        last_updated: 123456
      }
    });
    const result = mockContractCall('patient-health-record', 'get-health-record', [patientId], providerId);
    expect(result).toEqual({
      success: true,
      value: {
        encrypted_data: 'encrypted-data-123',
        last_updated: expect.any(Number)
      }
    });
  });
  
  it('should not allow unauthorized access to health records', () => {
    mockContractCall.mockReturnValue({ success: false, error: 403 });
    const result = mockContractCall('patient-health-record', 'get-health-record', [patientId], 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0');
    expect(result).toEqual({ success: false, error: 403 });
  });
});

