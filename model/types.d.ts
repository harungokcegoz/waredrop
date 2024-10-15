export interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  profile_picture_url: string;
  role: string;
  userStats: UserStats;
}

export interface UserStats {
  totalLikes: number;
  totalBookmarks: number;
  totalShares: number;
  totalPosts: number;
  followingCount: number;
  followersCount: number;
}

export interface Item {
  id: number;
  user_id: number;
  name: string;
  category: string;
  color: string;
  image_url: string;
  brand: string;
  price: number;
  commercial_link?: string;
}

export interface Outfit {
  id: number;
  user_id: number;
  name: string;
  tags: string[];
  items: Item[];
}

export interface Post {
  id: number;
  outfit_id: number;
  caption: string;
  likes_count: number;
  shares_count: number;
  bookmarks_count: number;
  user: User;
  outfit: Outfit;
  isLiked: boolean;
  isBookmarked: boolean;
}
