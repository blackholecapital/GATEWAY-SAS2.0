import EditableTextBubble from './EditableTextBubble.jsx'
import MediaEmbedCard from './MediaEmbedCard.jsx'
import LoginCard from './LoginCard.jsx'
import LogoCard from './LogoCard.jsx'
import FeedCard from './FeedCard.jsx'
import VideoGridCard from './VideoGridCard.jsx'
import PlaceholderCard from './PlaceholderCard.jsx'
import StatusCard from './StatusCard.jsx'

export default function SlotRenderer({ slot, zone, debug = false, cfg }) {
  if (!slot || slot.visible === false) return null

  switch (slot.type) {
    case 'textBubble':
      return <EditableTextBubble slot={slot} zone={zone} debug={debug} />
    case 'mediaEmbed':
      return <MediaEmbedCard slot={slot} zone={zone} debug={debug} />
    case 'login':
      return <LoginCard slot={slot} zone={zone} debug={debug} />
    case 'logo':
      return <LogoCard slot={slot} zone={zone} debug={debug} cfg={cfg} />
    case 'xFeed':
      return <FeedCard slot={slot} zone={zone} debug={debug} />
    case 'videoGrid':
      return <VideoGridCard slot={slot} zone={zone} debug={debug} />
    case 'status':
      return <StatusCard slot={slot} zone={zone} debug={debug} />
    case 'placeholder':
    default:
      return <PlaceholderCard slot={slot} zone={zone} debug={debug} />
  }
}
