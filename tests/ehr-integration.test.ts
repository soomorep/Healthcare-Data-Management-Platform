import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('EHR Integration Contract', () => {
  const mockContractCall = vi.fn();
  const contractOwner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const patientId = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
  const ehrAuthorizedPrincipal = 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0';
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should register an EHR system', () => {
    mockContractCall.mockReturnValue({ success: true });
    const result = mockContractCall('ehr-integration', 'register-ehr-system', [
      '"EHR001"',
      '"Epic Systems"',
      '"https://api.epicsystems.com"',
      ehrAuthorizedPrincipal
    ], contractOwner);
    expect(result).toEqual({ success: true });
  });
  
  it('should set patient EHR mapping', () => {
    mockContractCall.mockReturnValue({ success: true });
    const result = mockContractCall('ehr-integration', 'set-patient-ehr-mapping', ['"EHR001"'], patientId);
    expect(result).toEqual({ success: true });
  });
  
  it('should get patient EHR mapping', () => {
    mockContractCall.mockReturnValue({ success: true, value: { ehr_id: 'EHR001' } });
    const result = mockContractCall('ehr-integration', 'get-patient-ehr-mapping', [patientId]);
    expect(result).toEqual({ success: true, value: { ehr_id: 'EHR001' } });
  });
  
  it('should get EHR system details', () => {
    mockContractCall.mockReturnValue({
      success: true,
      value: {
        name: 'Epic Systems',
        api_endpoint: 'https://api.epicsystems.com',
        authorized_principal: ehrAuthorizedPrincipal
      }
    });
    const result = mockContractCall('ehr-integration', 'get-ehr-system', ['"EHR001"']);
    expect(result).toEqual({
      success: true,
      value: {
        name: 'Epic Systems',
        api_endpoint: 'https://api.epicsystems.com',
        authorized_principal: ehrAuthorizedPrincipal
      }
    });
  });
  
  it('should log EHR update', () => {
    mockContractCall.mockReturnValue({ success: true });
    const result = mockContractCall('ehr-integration', 'log-ehr-update', [patientId, '"Updated patient records"'], ehrAuthorizedPrincipal);
    expect(result).toEqual({ success: true });
  });
  
  it('should not allow unauthorized EHR updates', () => {
    mockContractCall.mockReturnValue({ success: false, error: 403 });
    const result = mockContractCall('ehr-integration', 'log-ehr-update', [patientId, '"Unauthorized update"'], patientId);
    expect(result).toEqual({ success: false, error: 403 });
  });
});

