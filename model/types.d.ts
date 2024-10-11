export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
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
  user_id: number;
  outfit_id: number;
  caption: string;
  likes: number;
  shares: number;
  bookmarks: number;
}
