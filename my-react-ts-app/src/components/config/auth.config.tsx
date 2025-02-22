export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
export const GOOGLE_REDIRECT_URI = `${process.env.REACT_APP_API_URL}/accounts.google.com/o/oauth2/auth`;
export const LINKEDIN_CLIENT_ID = process.env.REACT_APP_LINKEDIN_CLIENT_ID || '';
export const LINKEDIN_REDIRECT_URI = `${process.env.REACT_APP_API_URL}/auth/linkedin/callback`;