import { gateManifest } from '../../app/routes/gate/gate.slots.js'
import { vipManifest } from '../../app/routes/vip/vip.slots.js'
import { perksManifest } from '../../app/routes/perks/perks.slots.js'
import { accountManifest } from '../../app/routes/account/account.slots.js'

const sharedFeed = 'gateway_xyz'
const sharedVideo = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
const sharedDiscord = 'https://discord.com/invite/35mmdNVyEe'

function action(actionId, label, type, url = '') {
  return { actionId, label, type, url }
}

function videoItem(id, label, description, mediaUrl) {
  return { id, label, description, mediaUrl }
}

export const tenantContentDefaults = {
  pages: {
    gate: {
      pageKey: gateManifest.page,
      slots: {
        'GATE-01': {
          slotId: 'GATE-01',
          page: 'gate',
          label: 'Top Left Social Card',
          type: 'mediaEmbed',
          visible: true,
          title: 'Gateway Social Spotlight',
          body: 'Drop in a YouTube, Instagram, or external media link. The shell will render a clean preview and fall back gracefully when embeds are messy.',
          mediaUrl: sharedVideo,
          sourcePath: 'tenantContent.pages.gate.slots.GATE-01',
          actions: [action('ACT-GATE-WATCH', 'Watch', 'openVideo', sharedVideo)]
        },
        'GATE-02': {
          slotId: 'GATE-02',
          page: 'gate',
          label: 'Top Right Session Card',
          type: 'status',
          visible: true,
          title: 'Session Status',
          body: 'Use this card for gate notes, current campaign status, session details, or help text.',
          sourcePath: 'tenantContent.pages.gate.slots.GATE-02',
          actions: [action('ACT-GATE-DISCORD', 'Open Discord', 'openDiscord', sharedDiscord)]
        },
        'GATE-03': {
          slotId: 'GATE-03',
          page: 'gate',
          label: 'Bottom Left Editable Text Card',
          type: 'textBubble',
          visible: true,
          title: 'Editable Message',
          body: 'This is the clean proof of concept card. Admin controls this copy from slot data instead of page JSX.',
          sourcePath: 'tenantContent.pages.gate.slots.GATE-03',
          actions: [action('ACT-GATE-LEARN', 'Learn More', 'openExternal', 'https://gateway.xyz-labs.xyz')]
        },
        'GATE-04': {
          slotId: 'GATE-04',
          page: 'gate',
          label: 'Bottom Right Customer Login Card',
          type: 'login',
          visible: true,
          title: 'Existing customers can log in here',
          body: 'Simple visual mock login card unless auth is wired later.',
          sourcePath: 'tenantContent.pages.gate.slots.GATE-04',
          actions: [action('ACT-GATE-LOGIN', 'Login', 'login')]
        }
      }
    },
    vip: {
      pageKey: vipManifest.page,
      slots: {
        'VIP-01': {
          slotId: 'VIP-01',
          page: 'vip',
          label: 'Top Hero Editable Intro Box',
          type: 'textBubble',
          visible: true,
          title: 'VIP is where the brand feels alive',
          body: 'Replace hardcoded hero logic with an editable intro box that keeps visual rhythm without preserving legacy complexity.',
          sourcePath: 'tenantContent.pages.vip.slots.VIP-01',
          actions: [action('ACT-VIP-APPLY', 'Apply', 'openExternal', 'https://gateway.xyz-labs.xyz/vip')]
        },
        'VIP-02': {
          slotId: 'VIP-02',
          page: 'vip',
          label: 'Center Left X Feed Card',
          type: 'xFeed',
          visible: true,
          title: 'Feed Simulation',
          body: 'Accepts a feed handle or URL. Shows a simulated branded feed when a real embed is unnecessary.',
          feedHandle: sharedFeed,
          sourcePath: 'tenantContent.pages.vip.slots.VIP-02',
          actions: [action('ACT-VIP-FEED', 'Open Feed', 'openFeed', 'https://x.com/'+sharedFeed)]
        },
        'VIP-03': {
          slotId: 'VIP-03',
          page: 'vip',
          label: 'Center Right Editable Info Card',
          type: 'status',
          visible: true,
          title: 'Activity & Info',
          body: 'Use this slot for event status, tier notes, recent activity, or partner highlights.',
          sourcePath: 'tenantContent.pages.vip.slots.VIP-03',
          actions: [action('ACT-VIP-DISCORD', 'Discord', 'openDiscord', sharedDiscord)]
        },
        'VIP-04': {
          slotId: 'VIP-04',
          page: 'vip',
          label: 'Lower Left Party Board Text Bubbles',
          type: 'textBubble',
          visible: true,
          title: 'Party Board',
          body: 'Editable bulletin bubble for insider notes, announcements, or tonight’s event rundown.',
          sourcePath: 'tenantContent.pages.vip.slots.VIP-04',
          actions: [action('ACT-VIP-NEWS', 'News', 'openExternal', 'https://gateway.xyz-labs.xyz/news')]
        },
        'VIP-05': {
          slotId: 'VIP-05',
          page: 'vip',
          label: 'Lower Middle Branding Logo Card',
          type: 'logo',
          visible: true,
          title: 'Brand Slot',
          body: 'Upload a tenant logo or brand mark here. Falls back to text branding if no logo URL exists.',
          sourcePath: 'tenantContent.pages.vip.slots.VIP-05'
        },
        'VIP-06': {
          slotId: 'VIP-06',
          page: 'vip',
          label: 'Lower Right Posts Or Text Card',
          type: 'textBubble',
          visible: true,
          title: 'Posts',
          body: 'Secondary editable post card. Keeps the page easy to map and easy to edit.',
          sourcePath: 'tenantContent.pages.vip.slots.VIP-06',
          actions: [action('ACT-VIP-YT', 'Watch', 'openVideo', sharedVideo)]
        }
      }
    },
    perks: {
      pageKey: perksManifest.page,
      slots: {
        'PERKS-01': {
          slotId: 'PERKS-01',
          page: 'perks',
          label: 'Top Intro Editable Box',
          type: 'textBubble',
          visible: true,
          title: 'Perks are the why behind the gate',
          body: 'This shell keeps perks content editable and mapped while preserving existing tier routes for working examples like PayMe.',
          sourcePath: 'tenantContent.pages.perks.slots.PERKS-01'
        },
        'PERKS-02': {
          slotId: 'PERKS-02',
          page: 'perks',
          label: 'Tier 1 Welcome Or Info Card',
          type: 'status',
          visible: true,
          title: 'Tier 1 Welcome',
          body: 'Simple intro card for first-tier benefits, updates, or onboarding notes.',
          sourcePath: 'tenantContent.pages.perks.slots.PERKS-02',
          actions: [action('ACT-PERKS-T1', 'Open Tier 1', 'link', '/perks/tier1')]
        },
        'PERKS-03': {
          slotId: 'PERKS-03',
          page: 'perks',
          label: 'Tier 2 Exclusive Content Grid',
          type: 'videoGrid',
          visible: true,
          title: 'Welcome to the exclusive content area',
          body: 'Six mapped previews, each driven by config.',
          sourcePath: 'tenantContent.pages.perks.slots.PERKS-03',
          fallback: {
            items: [
              videoItem('PERKS-GRID-01', 'Drop 01', 'Quick teaser', sharedVideo),
              videoItem('PERKS-GRID-02', 'Drop 02', 'Partner spotlight', sharedVideo),
              videoItem('PERKS-GRID-03', 'Drop 03', 'Creator preview', sharedVideo),
              videoItem('PERKS-GRID-04', 'Drop 04', 'Announcement clip', sharedVideo),
              videoItem('PERKS-GRID-05', 'Drop 05', 'Event replay', sharedVideo),
              videoItem('PERKS-GRID-06', 'Drop 06', 'Bonus access', sharedVideo)
            ]
          }
        },
        'PERKS-04': {
          slotId: 'PERKS-04',
          page: 'perks',
          label: 'Tier 3 Billing Placeholder',
          type: 'placeholder',
          visible: true,
          title: 'Employee Access to Billing Area',
          body: 'Placeholder for PayMe invoicing.',
          sourcePath: 'tenantContent.pages.perks.slots.PERKS-04',
          actions: [action('ACT-PERKS-T3', 'Open Tier 3', 'link', '/perks/tier3')]
        },
        'PERKS-05': {
          slotId: 'PERKS-05',
          page: 'perks',
          label: 'Lower Support Text Or Branding Utility Card',
          type: 'textBubble',
          visible: true,
          title: 'Support & Utility',
          body: 'Use this slot for support copy, branding utility text, or extra perk guidance.',
          sourcePath: 'tenantContent.pages.perks.slots.PERKS-05',
          actions: [action('ACT-PERKS-DISCORD', 'Support', 'openDiscord', sharedDiscord)]
        }
      }
    },
    account: {
      pageKey: accountManifest.page,
      slots: {
        'ACCOUNT-01': {
          slotId: 'ACCOUNT-01',
          page: 'account',
          label: 'Editable Account Overview Card',
          type: 'textBubble',
          visible: true,
          title: 'Account Overview',
          body: 'High-level account summary driven from slot content instead of hardcoded account page sections.',
          sourcePath: 'tenantContent.pages.account.slots.ACCOUNT-01'
        },
        'ACCOUNT-02': {
          slotId: 'ACCOUNT-02',
          page: 'account',
          label: 'Status Session Utility Card',
          type: 'status',
          visible: true,
          title: 'Session Utility',
          body: 'Wallet state, session notes, utility reminders, or admin-controlled account status.',
          sourcePath: 'tenantContent.pages.account.slots.ACCOUNT-02'
        },
        'ACCOUNT-03': {
          slotId: 'ACCOUNT-03',
          page: 'account',
          label: 'YouTube Or Media Card',
          type: 'mediaEmbed',
          visible: true,
          title: 'Media',
          body: 'Reusable media slot with graceful preview fallback.',
          mediaUrl: sharedVideo,
          sourcePath: 'tenantContent.pages.account.slots.ACCOUNT-03'
        },
        'ACCOUNT-04': {
          slotId: 'ACCOUNT-04',
          page: 'account',
          label: 'X Or Social Card',
          type: 'xFeed',
          visible: true,
          title: 'Social',
          body: 'Reuse the same social link here if needed. Simplicity beats novelty.',
          feedHandle: sharedFeed,
          sourcePath: 'tenantContent.pages.account.slots.ACCOUNT-04'
        },
        'ACCOUNT-05': {
          slotId: 'ACCOUNT-05',
          page: 'account',
          label: 'Editable Notes Logo Or Text Card',
          type: 'logo',
          visible: true,
          title: 'Brand Notes',
          body: 'Text/brand fallback slot for notes, a logo, or account utility messaging.',
          sourcePath: 'tenantContent.pages.account.slots.ACCOUNT-05'
        }
      }
    }
  }
}
