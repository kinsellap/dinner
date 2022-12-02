export const getMimeType = (data_url) => (data_url.match(/^data:([^;]+);/) || '')[1];
