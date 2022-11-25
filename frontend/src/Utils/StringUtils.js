export const isNotEmpty = (query) => query !== undefined && query !== "" && query !== null;

export const isAnInteger = (content) => isNotEmpty(content) && /^\d+$/.test(content);