

export interface PaginationEvent {
  rows: number; // Number of rows per page
  page: number; // Current page number (0-based)
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  assignedDentist: {
    name: string;
    avatar?: string;
  } | null;
  phoneNumber: string;
  nextAppointment: string;
  status: 'Active' | 'Inactive';
  // Additional fields for profile
  address?: string;
  email?: string;
  referredBy?: string;
  // Medical & Dental History
  reasonForVisit?: string;
  medicalConditions?: string;
  allergies?: string;
  currentMedications?: string;
  dentalHistory?: string;
  // Insurance Information
  insuranceProvider?: string;
  policyNumber?: string;
}
