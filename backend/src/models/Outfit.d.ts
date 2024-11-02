import { Item } from './Item';

export interface Outfit {
  id: number;
  user_id: number;
  name: string;
  tags: string[]; 
  items?: Item[];
  created_at?: Date;
  updated_at?: Date;
}