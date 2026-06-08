export type Gender = 'male' | 'female' | 'other'
export type LookingFor = 'male' | 'female' | 'both'
export type DatingGoal =
  | 'Серьезные отношения'
  | 'Свидания'
  | 'Просто общение'
  | 'Новые друзья'
  | 'Отношения на одну ночь'
  | 'Семья и дети'
  | 'Путешествия'
  | 'Совместная аренда'
  | 'Переписка'
  | 'Без обязательств'

export type ZodiacSign =
  | 'Овен' | 'Телец' | 'Близнецы' | 'Рак'
  | 'Лев' | 'Дева' | 'Весы' | 'Скорпион'
  | 'Стрелец' | 'Козерог' | 'Водолей' | 'Рыбы'

export type CircadianRhythm = 'lark' | 'owl' | 'flexible'
export type AttachmentStyle = 'secure' | 'anxious' | 'avoidant'

export interface UserProfile {
  id: number
  name: string
  age: number
  img: string
  hint?: string
  online: boolean
  distance: number
  match: number
  city: string
  zodiac: ZodiacSign
  interests: string[]
  bio: string
  height: number
  goal: DatingGoal
  gender: Gender
  lookingFor: LookingFor
  superLikes: number
  boost: {
    boostedUntil: string | null
  }
  circadian: CircadianRhythm
}

export interface GroupSubgroup {
  id: number
  name_ru: string
  name_en: string
  members: number
  online: number
  href?: string
}

export interface GroupCategory {
  id: string
  name_ru: string
  name_en: string
  icon: string
  img: string
  hint: string
  subgroups: GroupSubgroup[]
}

export interface TopWeekItem {
  id: string
  name_ru: string
  name_en: string
  members: number
  img: string
}

export interface MatchDialogUser {
  id: number
  name: string
  age: number
  img: string
  online: boolean
  distance: number
  match: number
  city: string
  zodiac: ZodiacSign
  interests: string[]
  bio: string
}

export interface NotificationItem {
  id: string
  type: 'like' | 'visit' | 'match' | 'message'
  userId: number
  userName: string
  userImg: string
  timestamp: string
  read: boolean
}

export interface Message {
  id: string
  chatId: string
  senderId: number
  text: string
  createdAt: string
  replyTo?: string
}

export interface Chat {
  id: string
  participants: number[]
  lastMessage?: Message
  unread: number
}

export interface AdminUser {
  id: number
  name: string
  email: string
  age: number
  city: string
  gender: Gender
  registeredAt: string
  status: 'active' | 'blocked' | 'banned'
  reports: number
  premium: boolean
}

export interface AdminReport {
  id: number
  reporterId: number
  reportedUserId: number
  reason: string
  description: string
  createdAt: string
  status: 'pending' | 'resolved' | 'dismissed'
}

export interface AdminCampaign {
  id: number
  name: string
  type: 'email' | 'push'
  status: 'draft' | 'scheduled' | 'sent'
  scheduledAt?: string
  sentAt?: string
  recipients: number
}

export interface TitleMetadata {
  id: string
  name_en: string
  name_ru: string
  icon: string
  description_en: string
  description_ru: string
  color?: string
}

export type FeatureFlagKey =
  | 'showPremium'
  | 'enableVoiceCalls'
  | 'enableVideoCalls'
  | 'enableGroups'
  | 'enableContest'
  | 'showAds'
  | 'enableAutosearch'

export interface FeatureFlags {
  showPremium: boolean
  enableVoiceCalls: boolean
  enableVideoCalls: boolean
  enableGroups: boolean
  enableContest: boolean
  showAds: boolean
  enableAutosearch: boolean
}

export type ThemeMode = 'light' | 'dark' | 'system'

export type Language = 'RU' | 'EN'

export interface AuthState {
  user: {
    id: number
    name: string
    email: string
    avatar: string
  } | null
  token: string | null
  isLoading: boolean
  error: string | null
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
