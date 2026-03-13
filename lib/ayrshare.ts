const BASE = 'https://app.ayrshare.com/api'
const KEY  = () => process.env.AYRSHARE_API_KEY ?? ''

export async function ayrshareGet(path: string) {
  const r = await fetch(`${BASE}${path}`, { headers: { Authorization: `Bearer ${KEY()}` } })
  return r.json()
}

export async function ayrsharePost(path: string, body: object, profileKey?: string) {
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${KEY()}`,
    'Content-Type':  'application/json',
  }
  if (profileKey) headers['Profile-Key'] = profileKey
  const r = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: JSON.stringify(body) })
  return r.json()
}

export async function ayrsharePut(path: string, body: object) {
  const r = await fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${KEY()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return r.json()
}

// Create an Ayrshare sub-profile for a PostPilot user
export async function createUserProfile(userId: string, email: string) {
  const data = await ayrsharePost('/profiles/profile', {
    title:           `postpilot_${userId.slice(0, 8)}`,
    email,
    disableCreatorProfile: false,
  })
  return data.profileKey as string | undefined
}

// Get the hosted URL for a user to connect their social accounts
export async function getSocialConnectUrl(profileKey: string, redirectUrl: string) {
  const data = await ayrsharePost('/profiles/generateJWT', {
    profileKey,
    display: {
      socialMediaPlatforms: ['twitter', 'linkedin', 'instagram', 'facebook'],
    },
    redirectUri: redirectUrl,
  })
  return data.url as string | undefined
}

// Post content to platforms on behalf of a user
export async function postToSocials(
  profileKey: string,
  content: string,
  platforms: string[],
  mediaUrls?: string[]
) {
  return ayrsharePost('/post', {
    post:      content,
    platforms: platforms.map(p => p === 'twitter' ? 'twitter' : p),
    ...(mediaUrls?.length ? { mediaUrls } : {}),
  }, profileKey)
}

// Get connected social accounts for a user profile
export async function getConnectedAccounts(profileKey: string) {
  const data = await ayrshareGet(`/profiles/profile/${profileKey}`)
  return (data.activeSocialAccounts ?? []) as string[]
}
