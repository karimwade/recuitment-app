export interface Application {
  id: number;
  type: 'NEW' | 'RENEWAL';
  status: 'IN_PROGRESS' | 'ACCEPTED' | 'REJECTED';
  cvPath?: string;
  degreePath?: string;
  coverLetterPath?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  announcement: {
    id: number;
    title: string;
    academicYear: {
      year: string;
    };
  };
}

export interface Announcement {
  id: number;
  title: string;
  description: string;
  active: boolean;
  createdAt: string;
  academicYear: {
    id: number;
    year: string;
  };
}

export interface AcademicYear {
  id: number;
  year: string;
  active: boolean;
  createdAt: string;
}