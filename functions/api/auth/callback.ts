interface Env {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    const errorDesc = url.searchParams.get("error_description") || "Authorization was cancelled or failed.";
    return new Response(renderErrorPage(errorDesc), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }

  const clientId = context.env.GITHUB_CLIENT_ID || "Ov23liKRkzVePYAQkuOx";
  const clientSecret = context.env.GITHUB_CLIENT_SECRET;

  if (!clientSecret) {
    return new Response(
      renderErrorPage("GITHUB_CLIENT_SECRET environment variable is not configured in Cloudflare Pages."),
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "HK-CMS-Cloudflare-Worker"
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code
      })
    });

    const tokenData = await tokenRes.json() as Record<string, any>;

    if (!tokenData || tokenData.error || !tokenData.access_token) {
      const err = tokenData?.error_description || tokenData?.error || "Failed to exchange token with GitHub.";
      return new Response(renderErrorPage(err), {
        status: 401,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    const accessToken = tokenData.access_token;

    // Fetch user details from GitHub
    let username = "GitHub User";
    try {
      const userRes = await fetch("https://api.github.com/user", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "User-Agent": "HK-CMS-Cloudflare-Worker"
        }
      });
      if (userRes.ok) {
        const userData = await userRes.json() as { login?: string };
        if (userData.login) {
          username = userData.login;
        }
      }
    } catch {
      // Non-critical, fallback to default
    }

    return new Response(renderSuccessPage(accessToken, username), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  } catch (err: any) {
    return new Response(renderErrorPage(err?.message || "Internal server error occurred."), {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};

function renderSuccessPage(token: string, username: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connected to CMS Studio</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #0c0a09;
      color: #f5f5f4;
      text-align: center;
    }
    .card {
      background: #1c1917;
      border: 1px solid #292524;
      border-radius: 16px;
      padding: 32px 28px;
      max-width: 360px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .spinner {
      width: 28px;
      height: 28px;
      border: 3px solid rgba(255,255,255,0.1);
      border-top-color: #10b981;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h2 style="font-size: 1.1rem; margin: 0 0 6px; font-weight: 700;">Connected as @${username}</h2>
    <p style="font-size: 0.85rem; color: #a8a29e; margin: 0;">Returning to Admin CMS Studio...</p>
  </div>
  <script>
    try {
      localStorage.setItem('hk_gh_token', ${JSON.stringify(token)});
      localStorage.setItem('hk_gh_user', ${JSON.stringify(username)});
    } catch (e) {
      console.error(e);
    }
    setTimeout(function() {
      window.location.href = '/admin';
    }, 600);
  </script>
</body>
</html>`;
}

function renderErrorPage(message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Authentication Error</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #0c0a09;
      color: #f5f5f4;
      text-align: center;
      padding: 16px;
    }
    .card {
      background: #1c1917;
      border: 1px solid #7f1d1d;
      border-radius: 16px;
      padding: 32px 24px;
      max-width: 400px;
    }
    h2 { font-size: 1.1rem; color: #f87171; margin: 0 0 10px; }
    p { font-size: 0.85rem; color: #a8a29e; line-height: 1.5; margin: 0 0 20px; }
    a { display: inline-block; padding: 10px 20px; background: #292524; color: #fff; text-decoration: none; border-radius: 8px; font-size: 0.85rem; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Authentication Error</h2>
    <p>${message}</p>
    <a href="/admin">Return to Admin CMS</a>
  </div>
</body>
</html>`;
}
