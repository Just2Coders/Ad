import { supabase } from "./supabase";
import { Ad, ViewedAd, AdQuota } from "./types";

export async function getAds() {
  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Ad[];
}

export async function createAd(ad: Omit<Ad, "id" | "user_id" | "created_at">) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("ads")
    .insert([{ ...ad, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data as Ad;
}

export async function getViewedAds(userId: string) {
  const { data, error } = await supabase
    .from("viewed_ads")
    .select("*")
    .eq("user_id", userId)
    .eq("is_valid", true);

  if (error) throw error;
  return data as ViewedAd[];
}

export async function markAdAsViewed(adId: string, verificationCode: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("viewed_ads")
    .insert([
      {
        ad_id: adId,
        verification_code: verificationCode,
        user_id: user.id,
        is_valid: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as ViewedAd;
}

export async function getUserQuota(userId: string) {
  const { data, error } = await supabase
    .from("ad_quotas")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    // Si no existe, crear uno nuevo
    if (error.code === "PGRST116") {
      const { data: newQuota, error: createError } = await supabase
        .from("ad_quotas")
        .insert([{ user_id: userId, ads_created: 0 }])
        .select()
        .single();

      if (createError) throw createError;
      return newQuota as AdQuota;
    }
    throw error;
  }
  return data as AdQuota;
}

export async function incrementUserAdsCreated(userId: string) {
  // Primero intentamos obtener la cuota actual
  const { data: quota, error: quotaError } = await supabase
    .from("ad_quotas")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (quotaError) {
    // Si no existe la cuota, la creamos
    if (quotaError.code === "PGRST116") {
      const { data, error } = await supabase
        .from("ad_quotas")
        .insert([{ user_id: userId, ads_created: 1 }])
        .select()
        .single();

      if (error) throw error;
      return data as AdQuota;
    }
    throw quotaError;
  }

  // Si existe la cuota, la incrementamos
  const { data, error } = await supabase
    .from("ad_quotas")
    .update({ ads_created: (quota.ads_created || 0) + 1 })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as AdQuota;
}

export async function resetUserQuota(userId: string) {
  const { data, error } = await supabase
    .from("ad_quotas")
    .update({
      ads_created: 0,
      last_reset_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as AdQuota;
}
