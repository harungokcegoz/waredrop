import { Outfit } from './Outfit';
import { User } from './User';
import { Item } from './Item';

export interface Post {
  id: number;
  user: User;
  outfit_id: number;
  likes_count: number;
  bookmarks_count: number;
  shares_count: number;
  outfit: Outfit & { items: Item[] };
  created_at?: Date;
  updated_at?: Date;
  shared_post_id?: number;
  is_liked?: boolean;
  is_bookmarked?: boolean;
  is_user_following?: boolean;
}
