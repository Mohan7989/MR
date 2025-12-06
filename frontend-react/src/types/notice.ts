export interface Notice {
  id: number;
  title: string;
  description: string;
  is_urgent: boolean;
  is_active: boolean;
  created_date: string;
  updated_date: string;
}

export interface Update {
  id: number;
  message: string;
  is_active: boolean;
  created_date: string;
  updated_date: string;
}