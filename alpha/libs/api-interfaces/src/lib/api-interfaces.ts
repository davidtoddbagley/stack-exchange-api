export interface Message {
  message: string;
}

export interface StackExchangeResponse {
  error_id?: number;
  items: any[];
  has_more: boolean;
  quota_max: number;
  quota_remaining: number;
}

export interface User {
  accept_rate: number;
  account_id: number;
  badge_counts: UserBadgeCounts;
  creation_date: number;
  display_name: string;
  is_employee: boolean;
  last_access_date: number;
  last_modified_date: number;
  link: string;
  location: string;
  profile_image: string;
  reputation: number;
  reputation_change_day: number;
  reputation_change_month: number;
  reputation_change_quarter: number;
  reputation_change_week: number;
  reputation_change_year: number;
  user_id: number;
  user_type: string;
  website_url: string;
}

export interface UserOwner {
  display_name: string;
  link: string;
  profile_image: string;
  reputation: number;
  user_id: number;
  user_type: string;
}

export interface UserQuestions {
  answer_count: number;
  content_license: string;
  creation_date: number;
  is_answered: boolean;
  last_activity_date: number;
  last_edit_date: number;
  link: string;
  owner: UserOwner;
  question_id: number;
  score: number;
  tags: string[];
  title: string;
  view_count: number;
}

export interface UserBadgeCounts {
  bronze: number;
  gold: number;
  silver: number;
}
