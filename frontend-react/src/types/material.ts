export type MaterialGroup = 'B.A' | 'B.Sc' | 'B.Com' | 'B.B.A' | 'All';
export type MaterialSemester = '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th';
export type MaterialType = 'Question Paper' | 'Notes' | 'Lab Material' | 'Internship' | 'Other';
export type MaterialStatus = 'pending' | 'approved' | 'rejected';

export interface Material {
  id: number;
  title: string;
  subject: string;
  group: MaterialGroup;
  semester: MaterialSemester;
  year: string;
  material_type: MaterialType;
  file_url: string;
  status: MaterialStatus;
  downloads: number;
  created_date: string;
  updated_date: string;
}

export interface MaterialFilters {
  semester: string;
  group: string;
  material_type: string;
  year: string;
}