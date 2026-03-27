import { supabaseConfig } from "@/config/supabase-config";


export const getUserBookingsReport = async (userId: string) => {
	try {
		// properties required for the report
		
		const requiredProperties = {
			 totalBookings : 0,
			 totalTicketsPurchased : 0,
			 totalAmountSpent : 0,
			 upcomingBookings : 0,
			 pastBookings : 0
		}

		const { data, error } = await supabaseConfig
			.from('bookings')
			.select('*, events!event_id(date)')
			.eq('user_id', userId)

		if (error) {
			throw error;
		}

		data.forEach((booking) => {
			requiredProperties.totalBookings += 1;
			requiredProperties.totalTicketsPurchased += booking.tickets_count;
			requiredProperties.totalAmountSpent += booking.total_price;

			const eventDate = new Date(booking.events.date);
			const currentDate = new Date();

			if (eventDate > currentDate) {
				requiredProperties.upcomingBookings += 1;
			} else {
				requiredProperties.pastBookings += 1;
			}
		})	

		return requiredProperties;
	} catch (error) {
		throw error;
	}
}