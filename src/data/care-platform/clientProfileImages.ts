export interface ClientProfileAvatarPreset {
  id: string;
  label: string;
  url: string;
}

/**
 * Curated profile image options for the Grace & Goodwill Client Portal ("Choose a profile image").
 * Structured in a single list so client-supplied artwork can replace or extend these presets cleanly.
 */
export const CLIENT_PROFILE_AVATAR_PRESETS: ClientProfileAvatarPreset[] = [
  {
    id: 'dog',
    label: 'Dog',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 'flowers',
    label: 'Flowers',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 'mountains',
    label: 'Mountains',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 'full-moon',
    label: 'Full moon',
    url: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 'sea',
    label: 'Sea',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 'starry-sky',
    label: 'Starry sky',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 'forest',
    label: 'Forest',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 'bird',
    label: 'Bird',
    url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 'giraffe',
    label: 'Giraffe',
    url: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 'abstract-art',
    label: 'Abstract art',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=320&auto=format&fit=crop&q=80',
  },
];

export const DEFAULT_MARGARET_AVATAR =
  'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&auto=format&fit=crop&q=80';

export const DEFAULT_ELEANOR_THOMAS_AVATAR =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80';
