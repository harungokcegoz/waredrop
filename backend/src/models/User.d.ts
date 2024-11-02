export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  profile_picture_url: string;
  google_id: string;
  created_at: Date;
  updated_at: Date;
}

export enum Roles {
  INFLUENCER = 'influencer',
  REGULAR = 'regular',
}
