import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, Alert } from "react-native";
import FlexBox from "@/components/ui/flexbox";
import CustomText from "@/components/ui/custom-text";
import { PRIMARY_COLOR } from "@/constants";
import { Divider } from "react-native-paper";
import Toast from "react-native-toast-message";
import { cancelBooking } from "@/services/bookings";

interface BookingCardProps {
	booking: any;
	onCancel?: () => void;
}

const BookingCard = ({ booking, onCancel }: BookingCardProps) => {
	const event = booking.events;
	const statusColor =
		booking.status === "confirmed" ? "#4CAF50" : "#FF6B6B";
	const [isCancelling, setIsCancelling] = React.useState(false);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const handleCancel = () => {
		Alert.alert(
			"Cancel Booking",
			"Are you sure you want to cancel this booking?",
			[
				{ text: "Keep Booking", onPress: () => { }, style: "cancel" },
				{
					text: "Cancel Booking",
					onPress: async () => {
						try {
							setIsCancelling(true);
							await cancelBooking(booking.id, event.id, booking.tickets_count);
							Toast.show({
								type: "success",
								text1: "Booking cancelled successfully!",
							});
							onCancel?.();
						} catch (error) {
							Toast.show({ type: "error", text1: "Failed to cancel booking" });
						} finally {
							setIsCancelling(false);
						}
					},
					style: "destructive",
				},
			]
		);
	};



	return (
		<FlexBox
			backgroundColor="#fff"
			marginVertical={8}
			style={{
				borderRadius: 12,
				overflow: "hidden",
				borderColor: "#d4cece",
				borderWidth: 1,
			}}
		>
			{/* Booking Details */}
			<FlexBox padding={15} gap={12}>
				{/* Event Name */}
				<CustomText
					value={event?.name || "Event"}
					fontSize={16}
					fontWeight="700"
					fontColor={PRIMARY_COLOR}
				/>

				{/* Date and Time */}
				<FlexBox flexDirection="row" alignItems="center" gap={8}>
					<MaterialCommunityIcons
						name="calendar-outline"
						size={16}
						color="#333"
					/>
					<CustomText
						value={`${formatDate(event?.date)} at ${event?.time}`}
						fontSize={12}
						fontColor="#333"
					/>
				</FlexBox>

				{/* Location */}
				<FlexBox flexDirection="row" alignItems="center" gap={8}>
					<MaterialCommunityIcons
						name="map-marker-outline"
						size={16}
						color="#333"
					/>
					<CustomText
						value={event?.location || "Location"}
						fontSize={12}
						fontColor="#333"
					/>
				</FlexBox>

				{/* Divider */}
				<Divider />

				{/* Booking Info Row */}
				<FlexBox flexDirection="row" justifyContent="space-between">
					<FlexBox flex={1}>
						<CustomText
							value="Tickets Booked"
							fontSize={11}
							fontColor="#555"
						/>
						<CustomText
							value={`${booking.tickets_count}`}
							fontSize={14}
							fontWeight="600"
							fontColor={PRIMARY_COLOR}
						/>
					</FlexBox>

					<FlexBox flex={1}>
						<CustomText
							value="Total Price"
							fontSize={11}
							fontColor="#555"
						/>
						<CustomText
							value={`$${booking.total_price.toFixed(2)}`}
							fontSize={14}
							fontWeight="600"
							fontColor={PRIMARY_COLOR}
						/>
					</FlexBox>

					<FlexBox flex={1} alignItems="flex-end">
						<CustomText
							value="Status"
							fontSize={11}
							fontColor="#555"
						/>
						<CustomText
							value={booking.status.toUpperCase()}
							fontSize={14}
							fontWeight="700"
							fontColor={statusColor}
						/>
					</FlexBox>
				</FlexBox>

				{/* Booking Date */}
				<FlexBox alignItems="flex-end">
					<CustomText
						value={`Booked on ${formatDate(booking.created_at)}`}
						fontSize={10}
						fontColor="#666"
					/>
				</FlexBox>

				{/* Cancel Button - Only show if booking is confirmed */}
				{booking.status === "confirmed" && (
					<FlexBox marginVertical={8}>
						<TouchableOpacity
							onPress={handleCancel}
							disabled={isCancelling}
							activeOpacity={0.7}
						>
							<FlexBox
								paddingVertical={10}
								alignItems="center"
								style={{
									borderTopWidth: 1,
									borderTopColor: "#f0f0f0",
									marginTop: 8,
									paddingTop: 12,
								}}
							>
								<CustomText
									value={isCancelling ? "Cancelling..." : "Cancel Booking"}
									fontSize={12}
									fontWeight="600"
									fontColor="#FF6B6B"
								/>
							</FlexBox>
						</TouchableOpacity>
					</FlexBox>
				)}
			</FlexBox>
		</FlexBox>
	);
};

export default BookingCard;
