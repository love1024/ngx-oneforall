export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = error => {
      reject(error);
    };
  });
};

export const base64Encode = (value: string): string => {
  return btoa(value);
};

export const base64Decode = (value: string): string => {
  return atob(value);
};

export const base64UrlEncode = (value: string): string => {
  // encodeUriComponent is needed to handle special characters
  return base64Encode(encodeURIComponent(value))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const base64UrlDecode = (value: string): string => {
  return decodeURIComponent(base64Decode(value));
};
