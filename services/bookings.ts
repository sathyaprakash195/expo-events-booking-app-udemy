import { supabaseConfig } from "@/config/supabase-config";
import { IBooking } from "@/interfaces";

export const createBooking = async (payload: Partial<IBooking>) => {
  try {
    await supabaseConfig.from("bookings").insert(payload);

    // incremement booked tickets count in events table
    const eventResponse = await supabaseConfig
      .from("events")
      .select("booked_tickets_count")
      .eq("id", payload.event_id)
      .single();
    const bookedTicketsCount = eventResponse.data?.booked_tickets_count || 0;

    await supabaseConfig
      .from("events")
      .update({
        booked_tickets_count: bookedTicketsCount + (payload.tickets_count || 0),
      })
      .eq("id", payload.event_id);
    return true;
  } catch (error) {
    throw error;
  }
};

export const getUserBookings = async (userId: string) => {
	try {
		const { data, error } = await supabaseConfig
			.from('bookings')
			.select(`
				*,
				events!event_id(*)
			`)
			.eq('user_id', userId)

		if (error) {
			throw error;
		}

		return data;
	} catch (error) {
		 throw error;
	}
}

export const cancelBooking = async (bookingId: string, eventId: string, ticketsCount: number) => {
	try {
		// Update booking status to cancelled
		const { error: updateError } = await supabaseConfig
			.from('bookings')
			.update({ status: 'cancelled' })
			.eq('id', bookingId)

		if (updateError) {
			throw updateError;
		}

		// Decrement booked tickets count in events table
		const eventResponse = await supabaseConfig
			.from('events')
			.select('booked_tickets_count')
			.eq('id', eventId)
			.single()

		const bookedTicketsCount = eventResponse.data?.booked_tickets_count || 0;

		await supabaseConfig
			.from('events')
			.update({
				booked_tickets_count: Math.max(0, bookedTicketsCount - ticketsCount),
			})
			.eq('id', eventId)

		return true;
	} catch (error) {
		throw error;
	}
}