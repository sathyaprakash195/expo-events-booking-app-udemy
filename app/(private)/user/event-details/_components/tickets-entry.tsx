import { View, Text } from 'react-native'
import React from 'react'
import { IEvent } from '@/interfaces'
import FlexBox from '@/components/ui/flexbox'
import CustomButton from '@/components/ui/custom-button'
import CustomText from '@/components/ui/custom-text'
import { PRIMARY_COLOR } from '@/constants'
import CustomInput from '@/components/ui/custom-input'
import { callSupabaseStripeBackend } from '@/services/payments'
import Toast from 'react-native-toast-message'
import { useStripe } from "@stripe/stripe-react-native";
import { useUsersStore } from '@/store/users-store'
import { createBooking } from '@/services/bookings'
import { useRouter } from 'expo-router'


interface TicketsEntryProps {
	event: IEvent
}
const TicketsEntry = ({ event }: TicketsEntryProps) => {
	const [ticketsCount, setTicketsCount] = React.useState("1")
	const [loading, setLoading] = React.useState(false)
	const router = useRouter()
	const { user } = useUsersStore()

	const { initPaymentSheet, presentPaymentSheet } = useStripe();

	const availableTickets = event ? event.total_tickets_count - (event.booked_tickets_count || 0) : 0

	const ticketCountNum = parseInt(ticketsCount) || 0
	const totalPrice = ticketCountNum * event.ticket_price

	const handleTicketCountChange = (value: string) => {
		// Allow only numeric input
		const numValue = parseInt(value) || 0
		// Ensure it doesn't exceed available tickets
		if (numValue <= availableTickets) {
			setTicketsCount(value)
		} else if (numValue > 0) {
			setTicketsCount(availableTickets.toString())
		}
	}

	const handleBooking = async () => {
		try {
			setLoading(true)
			const stripeBackendResponse = await callSupabaseStripeBackend(totalPrice) // Convert to cents

			// stripe frontend integration
			const data = stripeBackendResponse;
			const initResponse = await initPaymentSheet({
				paymentIntentClientSecret: data.clientSecret,
				merchantDisplayName: "Expo Events",
				customerId: data.customer,
				customerEphemeralKeySecret: data.ephemeralKey,
			});

			if (initResponse.error) {
				Toast.show({
					type: "error",
					text1: "Payment Failed",
					text2: initResponse.error.message,
				});
				return;
			}

			const presentResponse = await presentPaymentSheet();

			if (presentResponse.error) {
				Toast.show({
					type: "error",
					text1: "Payment Failed",
					text2: presentResponse.error.message,
				});
				return;
			}

			Toast.show({
				type: "success",
				text1: "Payment Successful",
				text2: "Your room has been booked successfully!",
			});


			// storing tickets in supabase
			const bookingPayload: any = {
				event_id: event.id,
				user_id: user?.id || '',
				tickets_count: ticketCountNum,
				total_price: totalPrice,
				payment_id: data.paymentIntentId,
				status: 'confirmed'
			}

			await createBooking(bookingPayload)

			Toast.show({
				type: "success",
				text1: "Booking Confirmed",
				text2: "Your tickets have been booked successfully!",
			});

			setTimeout(() => {
				router.push('/user/home')
			}, 1000)
		} catch (error) {
			Toast.show({
				type: 'error',
				text1: 'Booking Failed',
				text2: error instanceof Error ? error.message : 'An unexpected error occurred.',
			});
		} finally {
			setLoading(false)
		}
	}

	return (
		<FlexBox gap={20}>

			<FlexBox flexDirection="row" gap={20} marginVertical={20}>
				<FlexBox
					gap={8}
					flex={1}
					style={{
						backgroundColor: "#f5f5f5",
						padding: 15,
						borderRadius: 8
					}}
				>
					<CustomText value="Price per Ticket" fontSize={12} fontColor="#454545" />
					<CustomText
						value={`$${event.ticket_price}`}
						fontSize={20}
						fontWeight="bold"
						fontColor={PRIMARY_COLOR}
					/>
				</FlexBox>


				<FlexBox
					gap={8}
					flex={1}
					style={{
						backgroundColor: "#f5f5f5",
						padding: 15,
						borderRadius: 8
					}}
				>
					<CustomText value="Available Tickets" fontSize={12} fontColor="#414141" />
					<CustomText
						value={`${availableTickets}`}
						fontSize={20}
						fontWeight="bold"
						fontColor={availableTickets > 0 ? "#024304" : "#d32f2f"}
					/>
					<CustomText
						value={`of ${event.total_tickets_count}`}
						fontSize={11}
						fontColor="#383535"
					/>
				</FlexBox>
			</FlexBox>

			{/* Number of Tickets Input */}
			<CustomInput
				label="Number of Tickets"
				placeholder="Enter number of tickets"
				value={ticketsCount}
				onChangeText={handleTicketCountChange}
				keyboardType="numeric"
				editable={availableTickets > 0}
				error={false}
				errorMessage=""
			/>

			{/* Total Price Display */}
			{ticketCountNum > 0 && (
				<FlexBox
					style={{
						backgroundColor: "#e8f5e9",
						padding: 15,
						borderRadius: 8,
						borderLeftWidth: 4,
						borderLeftColor: PRIMARY_COLOR
					}}
					gap={8}
				>
					<FlexBox flexDirection="row" justifyContent="space-between" alignItems="center">
						<CustomText
							value={`${ticketCountNum} Ticket${ticketCountNum > 1 ? "s" : ""}`}
							fontSize={14}
							fontWeight="600"
							fontColor="#333"
						/>
						<CustomText
							value={`@ $${event.ticket_price} each`}
							fontSize={13}
							fontColor="#666"
						/>
					</FlexBox>
					<FlexBox
						flexDirection="row"
						justifyContent="space-between"
						alignItems="center"
						style={{
							borderTopWidth: 1,
							borderTopColor: "#ccc",

						}}

					>
						<CustomText
							value="Total Price"
							fontSize={14}
							fontWeight="bold"
							fontColor="#333"
						/>
						<CustomText
							value={`$${totalPrice.toFixed(2)}`}
							fontSize={20}
							fontWeight="bold"
							fontColor={PRIMARY_COLOR}
						/>
					</FlexBox>
				</FlexBox>
			)}

			{/* Book Tickets Button */}
			<CustomButton
				onPress={handleBooking}
				disabled={availableTickets === 0 || ticketCountNum === 0 || loading}
			>
				{availableTickets === 0 ? "Sold Out" : ticketCountNum === 0 ? "Enter Ticket Count" : `Book ${ticketCountNum} Ticket${ticketCountNum > 1 ? "s" : ""}`}
			</CustomButton>
		</FlexBox>
	)
}

export default TicketsEntry