export interface ClientProfileAvatarPreset {
  id: string;
  label: string;
  url: string;
}

/**
 * Official client-supplied profile image options for the Grace & Goodwill Client Portal
 * ("Choose a profile image").
 */
export const CLIENT_PROFILE_AVATAR_PRESETS: ClientProfileAvatarPreset[] = [
  {
    id: 'dog',
    label: 'Dog',
    url: '/assets/aistudio/WhatsApp_Image_2026-10-19_at_11.30.31_PM_e4a4c977.jpeg',
  },
  {
    id: 'flowers',
    label: 'Flowers',
    url: '/assets/aistudio/WhatsApp_Image_2026-10-19_at_11.30.23_PM_e8273dc1.jpeg',
  },
  {
    id: 'afternoon-tea',
    label: 'Afternoon tea',
    url: '/assets/aistudio/WhatsApp_Image_2026-10-19_at_11.30.43_PM_64d96456.jpeg',
  },
  {
    id: 'full-moon',
    label: 'Full moon',
    url: '/assets/aistudio/WhatsApp_Image_2026-10-19_at_11.30.31_PM__1__1dcef06d.jpeg',
  },
  {
    id: 'starry-sky',
    label: 'Starry sky',
    url: '/assets/aistudio/WhatsApp_Image_2026-10-19_at_11.30.36_PM_5fe7450d.jpeg',
  },
  {
    id: 'forest',
    label: 'Forest',
    url: '/assets/aistudio/WhatsApp_Image_2026-10-19_at_11.30.36_PM__1__2184c878.jpeg',
  },
  {
    id: 'bird',
    label: 'Bird',
    url: '/assets/aistudio/WhatsApp_Image_2026-10-19_at_11.30.37_PM__1__9ebc2891.jpeg',
  },
  {
    id: 'giraffe',
    label: 'Giraffe',
    url: '/assets/aistudio/WhatsApp_Image_2026-10-19_at_11.30.37_PM_68812844.jpeg',
  },
  {
    id: 'the-queen',
    label: 'The Queen',
    url: '/assets/aistudio/WhatsApp_Image_2026-10-19_at_11.30.37_PM__3__fc9a18e3.jpeg',
  },
  {
    id: 'elvis',
    label: 'Elvis',
    url: '/assets/aistudio/WhatsApp_Image_2026-10-19_at_11.30.37_PM__2__f3921809.jpeg',
  },
];

export const DEFAULT_MARGARET_AVATAR =
  'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&auto=format&fit=crop&q=80';

export const DEFAULT_ELEANOR_THOMAS_AVATAR =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80';
