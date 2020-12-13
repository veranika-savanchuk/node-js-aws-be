export const isEmpty = <T>(obj: T) => {
  return Object.keys(obj || {}).length <= 0;
};
