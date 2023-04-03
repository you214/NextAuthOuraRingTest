import NextAuth from 'next-auth/next';
import { env } from 'process';
import GithubProvider from 'next-auth/providers/github';
import Discord from 'next-auth/providers/discord';
import { getToken } from 'next-auth/jwt';

export default NextAuth({
  providers: [
    {
      id: 'oura',
      name: 'oura',
      type: 'oauth',
      version: '2.0',
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      issuer: process.env.NEXT_PUBLIC_AUTH_ISSUER,
      idToken: false,
      authorization: {
        url: 'https://cloud.ouraring.com/oauth/authorize',
        params: {
          scope: 'email personal daily heartrate workout tag session ',
          response_type: 'code',
          redirect_uri: 'http://localhost:3000/api/auth/callback/oura',
        },
      },
      token: {
        url: 'https://api.ouraring.com/oauth/token',
        params: {
          garnt_type: 'authorization_code',
        },
      },
      userinfo: {
        url: 'https://api.ouraring.com/v1/userinfo',
        params: { token: getToken },
        //request: () => {},
      },
      accessTokenUrl: 'https://api.ouraring.com/oauth/token',
      requestTokenUrl: 'https://api.ouraring.com/oauth/token',
      callbackUrl: 'http://localhost:3000/api/auth/callback/oura',
      profile(profile) {
        return {
          id: 1,
          email: profile.email,
          ...profile,
        };
      },
    },
  ],
  secret: process.env.NEXTAUTH_PUBLIC_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      console.log(`token:${JSON.stringify(token)}`);
      if (account) {
        return {
          accessToken: account.accessToken,
          accessTokenExpires: Date.now() + account.expires_at * 1000,
          refreshToken: account.refresh_token,
        };
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
    },
    async session({ session, token }) {
      console.log('session');
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
    async signIn({ user, account, email, credentials }) {
      console.log('signed in');
      return true;
    },
  },
  debug: true,
});

async function refreshAccessToken(token) {
  try {
    const url =
      'https://api.ouraring.com/oauth/token?' +
      new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}
