export const getFirstLetter = (str) => {
  if (!str) return "";

  return str.split("")[0].toUpperCase();
};

export const capitalizeFirstLetter = (str) => {
  if (!str) return "";

  return `${str.split("")[0].toUpperCase()}${str.slice(1)}`;
};
