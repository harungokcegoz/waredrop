export interface Item {
  id: number;
  user_id: number;
  name: string;
  category: string;
  color?: string;
  image_url?: string;
  brand?: string;
  price?: number;
  commercial_link?: string;
  created_at?: Date;
  updated_at?: Date;
}