export const isNotEmpty = (query) => query !== undefined && query !== "" && query !== null;

export const isAnInteger = (content) => isNotEmpty(content) && /^\d+$/.test(content);

export const capitaliseFirstLetter = (name) => name?.charAt(0).toUpperCase() + name?.slice(1);
  