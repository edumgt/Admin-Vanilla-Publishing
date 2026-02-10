const DEFAULT_AUTH_REDIRECT = 'login.html';
const DEFAULT_APP_REDIRECT = 'system.html';
const FAVORITE_KEY = 'favorite-1st';
const TOKEN_KEY = 'token';

const normalizeFavoritePath = (rawValue) => {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (typeof parsed === 'string' && parsed.trim()) {
      return parsed;
    }

    if (parsed && typeof parsed.url === 'string' && parsed.url.trim()) {
      return parsed.url;
    }
  } catch (_error) {
    if (typeof rawValue === 'string' && rawValue.trim()) {
      return rawValue;
    }
  }

  return null;
};

export const resolveInitialRoute = (storage) => {
  const token = storage.getItem(TOKEN_KEY);

  if (!token) {
    return DEFAULT_AUTH_REDIRECT;
  }

  const favoritePath = normalizeFavoritePath(storage.getItem(FAVORITE_KEY));

  return favoritePath ?? DEFAULT_APP_REDIRECT;
};
