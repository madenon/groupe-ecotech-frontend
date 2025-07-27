
export const platformShareUrls = {
  whatsapp: (url) => `https://wa.me/?text=${encodeURIComponent(url)}`,
  facebook: (url) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  linkedin: (url) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,
  email: (url) =>
    `mailto:?subject=Je voulais partager ce post avec toi&body=${encodeURIComponent(
      url
    )}`,
};
