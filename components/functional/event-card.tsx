import React from "react";
import { TouchableOpacity, Image, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import FlexBox from "@/components/ui/flexbox";
import CustomText from "@/components/ui/custom-text";
import { PRIMARY_COLOR } from "@/constants";
import { IEvent } from "@/interfaces";
import Toast from "react-native-toast-message";
import { deleteEvent } from "@/services/events";
import { Divider } from "react-native-paper";

interface EventCardProps {
	event: IEvent;
	onEdit?: (event: IEvent) => void;
	onDelete?: () => void;
	showActions?: boolean;
}

const EventCard = ({ event, onEdit, onDelete, showActions = true }: EventCardProps) => {
	const router = useRouter();
	const [isDeleting, setIsDeleting] = React.useState(false);

	const handleCardPress = () => {
		if (!showActions) {
			router.push(`/user/event-details/${event.id}`);
		}
	};

	const handleDelete = () => {
		Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
			{ text: "Cancel", onPress: () => { }, style: "cancel" },
			{
				text: "Delete",
				onPress: async () => {
					try {
						setIsDeleting(true);
						await deleteEvent(event.id);
						Toast.show({ type: "success", text1: "Event deleted successfully!" });
						onDelete?.();
					} catch (error) {
						Toast.show({ type: "error", text1: "Failed to delete event" });
					} finally {
						setIsDeleting(false);
					}
				},
				style: "destructive",
			},
		]);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	};

	const availableTickets = event.total_tickets_count - (event.booked_tickets_count || 0);

	return (
		<TouchableOpacity
			onPress={handleCardPress}
			disabled={showActions}
			activeOpacity={showActions ? 1 : 0.7}
		>
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
				{/* Event Image */}
				{event.image_url && (
					<Image
						source={{ uri: event.image_url }}
						style={{
							width: "100%",
							height: 180,
							resizeMode: "cover",
						}}
					/>
				)}

				{/* Event Details */}
				<FlexBox padding={15} gap={10}>
					{/* Event Name */}
					<CustomText
						value={event.name}
						fontSize={18}
						fontWeight="700"
						fontColor={PRIMARY_COLOR}
					/>

					{/* Date and Time */}
					<FlexBox flexDirection="row" alignItems="center" gap={8}>
						<MaterialCommunityIcons
							name="calendar-outline"
							size={16}
							color={PRIMARY_COLOR}
						/>
						<CustomText
							value={`${formatDate(event.date)} • ${event.time}`}
							fontSize={13}
							fontColor="#666"
						/>
					</FlexBox>

					{/* Location */}
					<FlexBox flexDirection="row" alignItems="center" gap={8}>
						<MaterialCommunityIcons
							name="map-marker-outline"
							size={16}
							color={PRIMARY_COLOR}
						/>
						<CustomText
							value={event.location}
							fontSize={13}
							fontColor="#666"
						/>
					</FlexBox>

					<Divider style={{ marginVertical: 10, borderWidth: 1, borderColor: "#eee" }} />

					{/* Price, Available and Action Buttons Row */}
					<FlexBox flexDirection="row" justifyContent={showActions ? "space-between" : "flex-start"} alignItems="center" marginVertical={10}>
						{/* Left Side: Price and Available */}
						<FlexBox flexDirection="row" gap={20}>
							<FlexBox gap={4}>
								<CustomText
									value="Price"
									fontSize={12}
									fontColor="#999"
								/>
								<CustomText
									value={`$${event.ticket_price}`}
									fontSize={14}
									fontWeight="600"
									fontColor={PRIMARY_COLOR}
								/>
							</FlexBox>
							<FlexBox gap={4}>
								<CustomText
									value="Available"
									fontSize={12}
									fontColor="#999"
								/>
								<CustomText
									value={`${availableTickets}/${event.total_tickets_count}`}
									fontSize={14}
									fontWeight="600"
									fontColor="#666"
								/>
							</FlexBox>
						</FlexBox>

						{/* Right Side: Action Buttons - Only show if showActions is true */}
						{showActions && (
							<FlexBox flexDirection="row" gap={8}>
								<TouchableOpacity
									onPress={() => onEdit?.(event)}
									style={{
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: PRIMARY_COLOR,
										paddingVertical: 8,
										paddingHorizontal: 12,
										borderRadius: 8,
									}}
								>
									<MaterialCommunityIcons
										name="pencil"
										size={18}
										color="#fff"
									/>
								</TouchableOpacity>

								<TouchableOpacity
									onPress={handleDelete}
									disabled={isDeleting}
									style={{
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: "#ffebee",
										paddingVertical: 8,
										paddingHorizontal: 12,
										borderRadius: 8,
										opacity: isDeleting ? 0.5 : 1,
									}}
								>
									<MaterialCommunityIcons
										name="trash-can-outline"
										size={18}
										color="#d32f2f"
									/>
								</TouchableOpacity>
							</FlexBox>
						)}
					</FlexBox>
				</FlexBox>
			</FlexBox>
		</TouchableOpacity>
	);
};

export default EventCard;
