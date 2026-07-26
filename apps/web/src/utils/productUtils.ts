export const getProductImage = (item: any, index = 0): string | null => {
  if (item?.images && Array.isArray(item.images) && item.images.length > index && item.images[index]) {
    return item.images[index];
  }
  if (index === 0 && item?.image) return item.image;
  if (index === 0 && item?.imageUrl) return item.imageUrl;
  return null;
};
