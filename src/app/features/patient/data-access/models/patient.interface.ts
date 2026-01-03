

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
  };
  phoneNumber: string;
  nextAppointment: string;
  status: 'Active' | 'Inactive';
}
