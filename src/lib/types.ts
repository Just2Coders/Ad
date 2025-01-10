export interface Ad {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description?: string;
  price?: number;
  video_url: string;
  thumbnail: string;
  created_at: string;
}

export interface ViewedAd {
  id: string;
  user_id: string;
  ad_id: string;
  viewed_at: string;
  verification_code: string;
  is_valid: boolean;
}

export interface AdQuota {
  user_id: string;
  ads_created: number;
  last_reset_at: string;
}
