import { supabaseConfig } from "@/config/supabase-config";
import { IEvent } from "@/interfaces";

export const createEvent = async (payload: Partial<IEvent>) => {
  const { data, error } = await supabaseConfig
    .from("events")
    .insert(payload)
    .select("*")
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true,
  };
};

export const getAllEvents = async () => {
  const { data, error } = await supabaseConfig.from("events").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data as IEvent[];
};

export const getEventById = async (id: string) => {
  const { data, error } = await supabaseConfig
    .from("events")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data as IEvent;
};

export const updateEvent = async (id: string, payload: Partial<IEvent>) => {
  const { data, error } = await supabaseConfig
    .from("events")
    .update(payload)
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true,
  };
};

export const deleteEvent = async (id: string) => {
  const { data, error } = await supabaseConfig
    .from("events")
    .delete()
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true,
  };
};

export const uploadEventImage = async (selectedImage: string) => {
  try {
    const file = await fetch(selectedImage);
    const blob = await file.blob();

    const arrayBuffer = new Response(blob).arrayBuffer();

    const fileName = `event_${Date.now()}.jpg`;

    const { data, error } = await supabaseConfig.storage
      .from("main")
      .upload(fileName, await arrayBuffer, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data: publicURLData } = await supabaseConfig.storage
      .from("main")
      .getPublicUrl(fileName);

    return publicURLData.publicUrl;
  } catch (error) {
    throw new Error("Failed to upload image. Please try again.");
  }
};

export const getAllUpcomingEvents = async () => {
  const { data, error } = await supabaseConfig
    .from("events")
    .select("*")
    .eq("status", "upcoming");

  if (error) {
    throw new Error(error.message);
  }
  return data as IEvent[];
};
