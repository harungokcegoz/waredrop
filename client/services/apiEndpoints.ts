const apiEndpoints = {
  // Auth
  googleLogin: () => "/auth/google",

  // Users
  getAllUsers: () => "/users",
  getUserById: (userId: number) => `/users/${userId}`,
  updateUser: (userId: number) => `/users/${userId}`,
  deleteUser: (userId: number) => `/users/${userId}`,
  getUserPosts: (userId: number) => `/users/${userId}/posts`,

  // Items
  getUserItems: (userId: number) => `/users/${userId}/items`,
  createItem: (userId: number) => `/users/${userId}/items`,
  getItemById: (userId: number, itemId: number) =>
    `/users/${userId}/items/${itemId}`,
  updateItem: (userId: number, itemId: number) =>
    `/users/${userId}/items/${itemId}`,
  deleteItem: (userId: number, itemId: number) =>
    `/users/${userId}/items/${itemId}`,

  // Outfits
  getUserOutfits: (userId: number) => `/users/${userId}/outfits`,
  createOutfit: (userId: number) => `/users/${userId}/outfits`,
  getOutfitById: (userId: number, outfitId: number) =>
    `/users/${userId}/outfits/${outfitId}`,
  updateOutfit: (userId: number, outfitId: number) =>
    `/users/${userId}/outfits/${outfitId}`,
  deleteOutfit: (userId: number, outfitId: number) =>
    `/users/${userId}/outfits/${outfitId}`,

  // Posts
  createPost: (userId: number) => `/users/${userId}/posts`,
  getPostById: (postId: number) => `/posts/${postId}`,
  likePost: (postId: number, userId: number) =>
    `/posts/${postId}/likes?user_id=${userId}`,
  deletePost: (userId: number, postId: number) =>
    `/users/${userId}/posts/${postId}`,
  getUserFeed: (userId: number, limit: number, offset: number) =>
    `/users/${userId}/feed?limit=${limit}&offset=${offset}`,

  // Follow
  followUser: (userId: number) => `/users/${userId}/follows`,
  unfollowUser: (userId: number, followedId: number) =>
    `/users/${userId}/follows/${followedId}`,
  getUserFollowers: (userId: number) => `/users/${userId}/followers`,
  getUserFollowing: (userId: number) => `/users/${userId}/following`,

  // Bookmark
  toggleBookmark: (userId: number, postId: number) =>
    `/users/${userId}/bookmarks/${postId}`,
  getBookmarks: (userId: number) => `/users/${userId}/bookmarks`,

  // User stats
  getUserStats: (userId: number) => `/users/${userId}/stats`,
};

export default apiEndpoints;
