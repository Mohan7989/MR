export interface ScheduleEntry {
  date: string;
  day: string;
  ba_subject: string;
  bsc_subject: string;
  bcom_subject: string;
  bba_subject: string;
}

export interface ExamTimetable {
  id: number;
  title: string;
  subtitle: string;
  batch: string;
  schedule: ScheduleEntry[];
  scheduleJson?: string;
  is_active: boolean;
  created_date: string;
  updated_date: string;
}

export interface SliderImage {
  id: number;
  image_url: string;
  order: number;
  is_active: boolean;
  created_date: string;
  updated_date: string;
}

export interface AppSetting {
  id: number;
  setting_key: string;
  setting_value: string;
  is_enabled: boolean;
  created_date: string;
  updated_date: string;
}