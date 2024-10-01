const apiEndpoints = {
  // Auth
  googleLogin: () => "/auth/google",

  // Users
  getAllUsers: () => "/users",
  getUserById: (userId: number) => `/users/${userId}`,
  updateUser: (userId: number) => `/users/${userId}`,
  deleteUser: (userId: number) => `/users/${userId}`,

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
  likePost: (postId: number) => `/posts/${postId}/like`,
  unlikePost: (postId: number) => `/posts/${postId}/unlike`,
  deletePost: (userId: number, postId: number) =>
    `/users/${userId}/posts/${postId}`,
};

export default apiEndpoints;
