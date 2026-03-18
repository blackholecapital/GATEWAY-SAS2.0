# Image-to-File Mapping Key (Account, Perks, VIP, Gate/Home)

This key maps each yellow marker from your reference screenshots to the corresponding UI text area and source location in the codebase.

## 1) ACCOUNT page (`/default/account`)

Source: `src/routes/Account.jsx`

| Marker | UI text area in screenshot | File mapping |
|---|---|---|
| `aaa` | Hero badge: `Account` | `accountBadges` fallback render in hero kicker (`['Account','Rewards','Referrals']`) |
| `bbb` | Hero badge: `Rewards` | `accountBadges` fallback render in hero kicker |
| `ccc` | Hero badge: `Referrals` | `accountBadges` fallback render in hero kicker |
| `ddddd` | Hero title (`Your member dashboard ...`) | `accountHeroTitle` |
| `eeeee` | Hero subtitle line under title | `accountHeroSubtitle` |
| `fffff` | Bottom-left card title (`*** QUICK ACTIONS ***`) | `cfg?.pages?.account?.quickActions?.title` |
| `gggggg` | Quick action 1 title (`Complete missions`) | `quickActions`/`fallbackQuickActions[0].title` |
| `hhhhhh` | Quick action 1 body | `quickActions`/`fallbackQuickActions[0].body` |
| `iiiii` | Quick action 2 title (`Portfolio inspector`) | `quickActions`/`fallbackQuickActions[1].title` |
| `jjjjjj` | Quick action 2 body | `quickActions`/`fallbackQuickActions[1].body` |
| `kkkk` | Quick action CTA pill (`EngageFi`) | `quickActions`/`fallbackQuickActions[0].cta` |
| `lll` | Quick action CTA pill (`Open`) | `quickActions`/`fallbackQuickActions[1].cta` |
| `mmmmmmm` | Bottom-middle card title (`*** SOCIAL ACCOUNTS ***`) | `cfg?.pages?.account?.socialsPanel?.title` |
| `nnnnn` | Social row 1 title (`Follow on X`) | `socialItems`/`fallbackSocials[0].title` |
| `oooooo` | Social row 1 body | `socialItems`/`fallbackSocials[0].body` |
| `pppppp` | Social row 2 title (`YouTube`) | `socialItems`/`fallbackSocials[1].title` |
| `qqqqqq` | Social row 2 body | `socialItems`/`fallbackSocials[1].body` |
| `rrrrr` | Social row 3 title (`Discord support`) | `socialItems`/`fallbackSocials[2].title` |
| `sssss` | Social row 3 body | `socialItems`/`fallbackSocials[2].body` |
| `ttt` | Social row 1 CTA pill (`Open`) | `socialItems`/`fallbackSocials[0].cta` |
| `uuu` | Social row 2 CTA pill (`Watch`) | `socialItems`/`fallbackSocials[1].cta` |
| `vvv` | Social row 3 CTA pill (`Join`) | `socialItems`/`fallbackSocials[2].cta` |
| `wwww` | Bottom-right card title (`*** ACCOUNT NOTES ***`) | `cfg?.pages?.account?.notes?.title` |

## 2) PERKS page (`/default/perks`)

Source: `src/routes/Perks.jsx`

| Marker | UI text area in screenshot | File mapping |
|---|---|---|
| `aaa` | Hero badge: `Perks` | `heroBadges` fallback (`['Perks','Tier rules','Gated actions']`) |
| `bbb` | Hero badge: `Tier rules` | `heroBadges` fallback |
| `ccc` | Hero badge: `Gated actions` | `heroBadges` fallback |
| `ddddd` | Hero title (`Perks are the "why" behind the gate ...`) | `perksHeroTitle` |
| `eeeee` | Hero subtitle under title | `perksHeroSubtitle` |
| `fffff` | Top callout 1 title (`Want points + quests?`) | `topLinks`/`fallbackTopLinks[0].label` |
| `ggggg` | Top callout 1 body | `topLinks`/`fallbackTopLinks[0].desc` |
| `hhhhh` | Top callout 2 title (`Need support?`) | `topLinks`/`fallbackTopLinks[1].label` |
| `iiiii` | Top callout 2 body | `topLinks`/`fallbackTopLinks[1].desc` |
| `jjjjj` | Top callout 1 CTA pill (`EngageFi`) | `topLinks`/`fallbackTopLinks[0].cta` |
| `kkkkkk` | Top callout 2 CTA pill (`Discord`) | `topLinks`/`fallbackTopLinks[1].cta` |
| `lllll` | Bottom-left card title (`*** POINTS MARKETPLACE ***`) | `cfg?.pages?.perks?.marketplace?.title` |
| `mmmmmmmm` | Marketplace card subtitle (`Example items ...`) | static subtitle text in marketplace panel |
| `nnnnn` | Marketplace item 1 title (`VIP Pass`) | `marketplaceItems`/`fallbackMarketplaceItems[0].title` |
| `oooooo` | Marketplace item 1 body | `marketplaceItems`/`fallbackMarketplaceItems[0].body` |
| `pppppp` | Marketplace item 2 title (`Merch Coupon`) | `marketplaceItems`/`fallbackMarketplaceItems[1].title` |
| `qqqqqq` | Marketplace item 2 body | `marketplaceItems`/`fallbackMarketplaceItems[1].body` |
| `rrrrr` | Marketplace item 3 title (`Priority support token`) | `marketplaceItems`/`fallbackMarketplaceItems[2].title` |
| `sssss` | Marketplace item 3 body | `marketplaceItems`/`fallbackMarketplaceItems[2].body` |
| `ttttt` | Bottom-right card title (`*** FEATURED CAMPAIGNS ***`) | `cfg?.pages?.perks?.campaigns?.title` |
| `uuuuuu` | Campaigns card subtitle (`Perks can drive engagement...`) | static subtitle text in campaigns panel |
| `vvvvvv` | Campaign 1 title (`Follow on X`) | `campaignItems`/`fallbackCampaignItems[0].title` |
| `wwwwww` | Campaign 1 body | `campaignItems`/`fallbackCampaignItems[0].body` |
| `xxxxxxx` | Campaign 2 title (`Watch a demo`) | `campaignItems`/`fallbackCampaignItems[1].title` |
| `yyyyyyyy` | Campaign 2 body | `campaignItems`/`fallbackCampaignItems[1].body` |
| `zzzzzzz` | Campaign 3 title (`Referral link`) | `campaignItems`/`fallbackCampaignItems[2].title` |
| `11111` | Campaign 3 body | `campaignItems`/`fallbackCampaignItems[2].body` |
| `222` | Campaign 1 CTA (`Open X`) | `campaignItems`/`fallbackCampaignItems[0].ctaLabel` |
| `333` | Campaign 2 CTA (`Watch`) | `campaignItems`/`fallbackCampaignItems[1].ctaLabel` |
| `444` | Campaign 3 CTA/badge (`Coming soon`) | `campaignItems`/`fallbackCampaignItems[2].ctaLabel` |

## 3) VIP page (`/default/vip`)

Source: `src/routes/vip.jsx`

| Marker | UI text area in screenshot | File mapping |
|---|---|---|
| `aaa` | Hero badge: `VIP lounge` | static badge in hero kicker |
| `bbb` | Hero badge: `Tier {me?.tier}` | static badge in hero kicker |
| `cc` | Hero badge: `Session cookie` | static badge in hero kicker |
| `ddddd` | Hero title (`VIP IS WHERE THE BRAND FEELS ALIVE`) | `vipHeroTitle` |
| `eeeee` | Hero subtitle under title | `vipHeroSubtitle` |
| `fffff` | Callout 1 title (`Announcement`) | `ann1.title` fallback |
| `ggggg` | Callout 1 body | `ann1.body` fallback |
| `hhhhh` | Callout 2 title (`Meetup`) | `ann2.title` fallback |
| `iiiii` | Callout 2 body | `ann2.body` fallback |
| `jjj` | Callout 1 status badge (`LIVE`) | static callout badge |
| `kkk` | Callout 2 status badge (`RSVP`) | static callout badge |
| `uuuuu` | Right hero panel title (`*** QUICK LINKS ***`) | static card title |
| `mmmmmm` | Quick link row 1 subtitle | `vipQuickLinks[0].desc` fallback |
| `nnnnn` | Quick link row 2 title (`YouTube`) | `vipQuickLinks[1].label` fallback |
| `ooooooo` | Quick link row 2 subtitle | `vipQuickLinks[1].desc` fallback |
| `pppppp` | Quick link row 3 title (`Support desk`) | `vipQuickLinks[2].label` fallback |
| `qqqqqqq` | Quick link row 3 subtitle | `vipQuickLinks[2].desc` fallback |
| `rrr` | Quick link row 1 CTA (`Open`) | `vipQuickLinks[0].cta` fallback |
| `ssss` | Quick link CTA area (`Watch`/`Discord`) | `vipQuickLinks[*].cta` fallback |
| `vvvvvv` | Lower-left card title (`Party Board`) | `cfg?.pages?.vip?.partyBoard?.title` |
| `wwwwww` | Lower-left card subtitle | static subtitle under party board title |
| `xxxxxx` | Party row title (`🔥 Drop of the week`) | `partyItems[0].title` fallback |
| `yyyyyy` | Party row body | `partyItems[0].body` fallback |
| `zzzzzz` | Lower-middle card title (`Announcements Board`) | `cfg?.pages?.vip?.announcementsBoard?.title` |
| `11111111` | Announcement board row title (`🎟️ Event`) | `boardItems[0].title` fallback |
| `222222222e3333` | Announcement board row body | `boardItems[0].body` fallback |
| `333333` | Lower-right card title (`Post to VIP Feed`) | `cfg?.pages?.vip?.postWidget?.title` |
| `4444` | Lower-right card subtitle | static subtitle under post widget title |
| `55555` | Post widget pinned title (`Pinned vibe`) | `cfg?.pages?.vip?.postWidget?.pinnedTitle` |
| `66666` | Post widget pinned body | `cfg?.pages?.vip?.postWidget?.pinnedBody` |
| `77777` | Button (`View on X`) | static link button |
| `8888` | Button (`Watch demo`) | static link button |

## 4) GATE page (`/default/gate`, implemented by Home Desktop)

You were correct: the Gate page is implemented from the Home route on desktop.

Primary source: `src/routes/HomeDesktop.jsx` (via `src/routes/Home.jsx`)

| Marker | UI text area in screenshot | File mapping |
|---|---|---|
| `aaa` | Hero badge with brand name (`Gateway`) | `cfg?.brand?.name || 'Gateway'` |
| `bbb` | Hero badge (`Unlocks the power of Web-3`) | static badge |
| `ccc` | Hero badge (`No passwords`) | static badge |
| `dddddd` | Hero title (`Gateway is your member entry layer...`) | `gateHeroTitle` |
| `eeeee` | Hero subtitle paragraph | `gateHeroSubtitle` |
| `fffff` | Quick link row 1 title (`Follow us on X`) | `gateQuickLinks[0].label` fallback |
| `ggggg` | Quick link row 1 subtitle | `gateQuickLinks[0].desc` fallback |
| `hhhhh` | Quick link row 2 title (`YouTube walkthroughs`) | `gateQuickLinks[1].label` fallback |
| `iiiii` | Quick link row 2 subtitle | `gateQuickLinks[1].desc` fallback |
| `jjjjjj` | Quick link row 3 title (`Social missions`) | `gateQuickLinks[2].label` fallback |
| `kkkkkk` | Quick link row 3 subtitle | `gateQuickLinks[2].desc` fallback |
| `lllll` | Support callout title (`Need support?`) | static support callout title |
| `mmmmm` | Support callout subtitle | static support callout subtitle |
| `nnnn` | CTA pill row 1 (`Open X`) | quick link CTA fallback |
| `oooo` | CTA pill row 3 (`Open`) | quick link CTA fallback |
| `pppp` | CTA support row (`Discord`) | static support callout CTA |
| `qqqq` | Right panel title (`*** SESSION STATUS ***`) | static card title |
| `rrrrr` | Window 1 title (`Web 3 Tools`) | static `win-title` |
| `sssss` | Window 1 body | static `win-body` |
| `ttttt` | Window 2 title (`Gateway unlocks the power of Web-3`) | static `win-title` |
| `uuuuu` | Window 2 body | static `win-body` |
| `vvvvvv` | Lower-left card title (`(Tennant) title`) | static card title |
| `wwwwww` | Lower-left card subtitle (`Sign a short message ...`) | static card subtitle |

---

## Route/File cross-reference summary

- **Account page** → `src/routes/Account.jsx`
- **Perks page** → `src/routes/Perks.jsx`
- **VIP page** → `src/routes/vip.jsx`
- **Gate page** (`/default/gate`) → `src/routes/Home.jsx` selecting `src/routes/HomeDesktop.jsx`
