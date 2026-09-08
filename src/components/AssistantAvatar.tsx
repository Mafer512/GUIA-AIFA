type AssistantAvatarProps = {
  size?: 'mini' | 'small' | 'medium' | 'large'
  className?: string
}

export default function AssistantAvatar({
  size = 'small',
  className = '',
}: AssistantAvatarProps) {
  return (
    <span className={`assistant-avatar avatar-${size} ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 64 64" role="img">
        <path
          className="avatar-wing"
          d="M18 27 7 33l11 4m28-10 11 6-11 4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        <path
          className="avatar-face"
          d="M18 24a9 9 0 0 1 9-9h10a9 9 0 0 1 9 9v13a9 9 0 0 1-9 9H28l-8 5 2-8a9 9 0 0 1-4-7Z"
          fill="white"
        />
        <circle cx="27" cy="30" r="2.3" fill="currentColor" />
        <circle cx="38" cy="30" r="2.3" fill="currentColor" />
        <path d="M27 37c3 2.5 7 2.5 10 0" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
        <path d="M32 15V9" fill="none" stroke="white" strokeLinecap="round" strokeWidth="3" />
        <circle className="avatar-signal" cx="32" cy="7" r="3.4" fill="#ff8a19" />
      </svg>
    </span>
  )
}
