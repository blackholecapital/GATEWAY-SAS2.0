# Gateway: VIP Access Layer (gateway.mktmaker)

Tokenless sign-in (SIWE-style) + optional gating (allowlist / ERC20 balance / NFT ownership) + VIP members area + perks + admin toggles.

## Quick start

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Env vars

### Frontend (Vite)

Create `.env`:

```bash
VITE_WC_PROJECT_ID=YOUR_WALLETCONNECT_PROJECT_ID
VITE_APP_NAME=Gateway
VITE_DEFAULT_CHAIN_ID=1
```

### Server (Cloudflare Pages Functions)

Set these in Cloudflare Pages → Settings → Environment variables:

Required:
- `WG_SESSION_SECRET` (JWT HMAC secret)
- `WG_ADMIN_ADDRESSES` (comma-separated lowercase addresses)
- `WG_BASE_URL` (e.g. `https://gateway.yourdomain.com`) used in the signed message domain/uri

Recommended:
- `WG_COOKIE_SECURE=true` (use `true` in production)

Optional (needed for ERC20/NFT gating):
- `WG_RPC_URLS` JSON string map of RPC URLs, example:
  ```json
  { "1": "https://eth-mainnet.g.alchemy.com/v2/...", "8453": "https://mainnet.base.org" }
  ```

Optional KV binding:
- Bind a KV namespace as `WG_KV` (otherwise dev uses in-memory fallback)

## Routes

Public:
- `/` Gate / landing
- `/denied` Access denied page
- `/legal` Terms placeholder

Protected (requires valid `wg_session` httpOnly cookie):
- `/vip` VIP Home
- `/perks` Perks (tier-gated)
- `/account` Account

Admin (requires signed-in + address in `WG_ADMIN_ADDRESSES`):
- `/admin`

## Gate modes

Admin-selectable (stored in config):
- `SIGN_ONLY` → tier 1
- `ALLOWLIST` → tier 2 if address is in allowlist
- `ERC20_BALANCE` → tier 2 if `balanceOf(address) >= minBalance`
- `NFT_OWNERSHIP` → tier 3 if owns NFT (ERC721 or ERC1155)
- `COMBO_ANY` → passes if any enabled checks pass (tier is highest passed)
- `COMBO_ALL` → passes only if all enabled checks pass (tier 3)

Notes:
- Blocklist is always enforced first.
- ERC20 decimals are assumed **18** for v1 simplicity.

## Cloudflare Pages deploy notes

- This repo is Cloudflare Pages compatible.
- Functions live under `functions/api/*` and map to `/api/*`.
- Public gate summary: `GET /api/config`
- Member recent activity: `GET /api/activity`
- SPA routing is enabled via `_redirects` (also in `public/_redirects`).

## Mobile WalletConnect reliability

- Uses **RainbowKit + wagmi + WalletConnect v2**
- Uses the default RainbowKit connect flow (no custom connector picker), which supports mobile deep linking.

## Repo tree

```text
gateway.mktmaker/
  functions/
    api/
      _util.js
      nonce.js
      verify.js
      me.js
      logout.js
      admin/
        _admin.js
        config.js
        metrics.js
        logs.js
  public/
    _redirects
  src/
    App.jsx
    main.jsx
    components/
      Navbar.jsx
      StatusBubble.jsx
      GateCard.jsx
      VipIdentityCard.jsx
      PerkCard.jsx
      ProtectedRoute.jsx
      admin/
        AdminConfigPanel.jsx
        AllowlistEditor.jsx
        LogsTable.jsx
    hooks/
      useAuth.js
      useAdmin.js
    lib/
      api.js
      chains.js
      format.js
    routes/
      Home.jsx
      Vip.jsx
      Perks.jsx
      Account.jsx
      Admin.jsx
      Denied.jsx
      Legal.jsx
    styles/
      theme.css
      Page.css
      Navbar.css
      GateCard.css
      StatusBubble.css
      Vip.css
      Perks.css
      Admin.css
  _redirects
  index.html
  package.json
  vite.config.js
  README.md
  TEMPLATE_REPORT.txt

```
