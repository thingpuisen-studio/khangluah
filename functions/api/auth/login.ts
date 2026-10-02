interface Env {
  GITHUB_CLIENT_ID?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const clientId = context.env.GITHUB_CLIENT_ID || "Ov23liELdAzmQwnCaqaO";
  const url = new URL(context.request.url);
  const redirectUri = `${url.origin}/api/auth/callback`;
  const state = crypto.randomUUID();

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

  return Response.redirect(githubAuthUrl, 302);
};
