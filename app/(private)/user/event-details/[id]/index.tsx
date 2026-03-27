import { View, KeyboardAvoidingView, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getEventById } from "@/services/events";
import { IEvent } from "@/interfaces";
import FlexBox from "@/components/ui/flexbox";
import CustomText from "@/components/ui/custom-text";
import Title from "@/components/ui/title";
import CustomButton from "@/components/ui/custom-button";
import { PRIMARY_COLOR } from "@/constants";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TicketsEntry from "../_components/tickets-entry";
import { StripeProvider } from "@stripe/stripe-react-native";

const EventDetails = () => {
	const { id } = useLocalSearchParams();
	const router = useRouter();
	const [event, setEvent] = useState<IEvent | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchEvent = async () => {
			try {
				setIsLoading(true);
				if (id) {
					const eventData = await getEventById(id as string);
					setEvent(eventData);
				}
			} catch (error: any) {
				Toast.show({
					type: "error",
					text1: "Failed to load event",
					text2: error.message || "Unable to fetch event data",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchEvent();
	}, [id]);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	if (isLoading) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
				<FlexBox flex={1} justifyContent="center" alignItems="center">
					<CustomText value="Loading event..." fontSize={16} fontColor="#666" />
				</FlexBox>
			</SafeAreaView>
		);
	}

	if (!event) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
				<FlexBox flex={1} justifyContent="center" alignItems="center">
					<CustomText
						value="Event not found"
						fontSize={16}
						fontColor="#d32f2f"
					/>
				</FlexBox>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior="padding"
				keyboardVerticalOffset={100}
			>
				<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
					{/* Event Image */}
					{event.image_url && (
						<Image
							source={{ uri: event.image_url }}
							style={{
								width: "100%",
								height: 250,
								resizeMode: "cover",
							}}
						/>
					)}

					{/* Content */}
					<FlexBox padding={20} gap={20}>
						{/* Event Name */}
						<CustomText
							value={event.name}
							fontSize={24}
							fontWeight="700"
							fontColor={PRIMARY_COLOR}
						/>

						{/* Date */}
						<FlexBox flexDirection="row" alignItems="center" gap={12}>
							<MaterialCommunityIcons
								name="calendar"
								size={24}
								color={PRIMARY_COLOR}
							/>
							<FlexBox gap={4}>
								<CustomText value="Date" fontSize={12} fontColor="#999" />
								<CustomText
									value={formatDate(event.date)}
									fontSize={14}
									fontWeight="600"
								/>
							</FlexBox>
						</FlexBox>

						{/* Time */}
						<FlexBox flexDirection="row" alignItems="center" gap={12}>
							<MaterialCommunityIcons
								name="clock-outline"
								size={24}
								color={PRIMARY_COLOR}
							/>
							<FlexBox gap={4}>
								<CustomText value="Time" fontSize={12} fontColor="#999" />
								<CustomText value={event.time} fontSize={14} fontWeight="600" />
							</FlexBox>
						</FlexBox>

						{/* Location */}
						<FlexBox flexDirection="row" alignItems="center" gap={12}>
							<MaterialCommunityIcons
								name="map-marker"
								size={24}
								color={PRIMARY_COLOR}
							/>
							<FlexBox gap={4} flex={1}>
								<CustomText value="Location" fontSize={12} fontColor="#999" />
								<CustomText
									value={event.location}
									fontSize={14}
									fontWeight="600"
								/>
							</FlexBox>
						</FlexBox>

						{/* Organizer */}
						<FlexBox flexDirection="row" alignItems="center" gap={12}>
							<MaterialCommunityIcons
								name="account"
								size={24}
								color={PRIMARY_COLOR}
							/>
							<FlexBox gap={4} flex={1}>
								<CustomText value="Organizer" fontSize={12} fontColor="#999" />
								<CustomText
									value={event.organizer}
									fontSize={14}
									fontWeight="600"
								/>
							</FlexBox>
						</FlexBox>

						{/* Description */}
						<FlexBox gap={8}>
							<CustomText
								value="Description"
								fontSize={14}
								fontWeight="600"
								fontColor="#333"
							/>
							<CustomText
								value={event.description}
								fontSize={13}
								fontColor="#666"
							/>
						</FlexBox>

						{/* Price and Availability Row */}
						<StripeProvider
							publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
						>
							<TicketsEntry event={event} />
						</StripeProvider>

					</FlexBox>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default EventDetails;
