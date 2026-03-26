import React, { useCallback, useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import FlexBox from "@/components/ui/flexbox";
import Title from "@/components/ui/title";
import EventCard from "@/components/functional/event-card";
import { getAllUpcomingEvents } from "@/services/events";
import { IEvent } from "@/interfaces";
import Toast from "react-native-toast-message";
import CustomText from "@/components/ui/custom-text";
import { useFocusEffect } from "expo-router";

const Events = () => {
	const [events, setEvents] = useState<IEvent[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const fetchEvents = async () => {
		try {
			setIsLoading(true);
			const data = await getAllUpcomingEvents();
			setEvents(data);
		} catch (error) {
			Toast.show({ type: "error", text1: "Failed to fetch events" });
		} finally {
			setIsLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchEvents();
		}, [])
	);

	return (
		<FlexBox flex={1} paddingHorizontal={20} paddingVertical={20}>
			{/* Header */}
			<FlexBox marginVertical={15}>
				<Title title="Events" caption="Explore upcoming events" />
			</FlexBox>

			{/* Events List */}
			<ScrollView
				style={{ flex: 1 }}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={isLoading} onRefresh={fetchEvents} />
				}
			>
				{events.length > 0 ? (
					<FlexBox gap={8}>
						{events.map((event) => (
							<EventCard
								key={event.id}
								event={event}
								showActions={false}
							/>
						))}
					</FlexBox>
				) : (
					<FlexBox
						flex={1}
						justifyContent="center"
						alignItems="center"
						minHeight={300}
					>
						<CustomText
							value="No upcoming events available"
							fontSize={14}
							fontColor="#999"
						/>
					</FlexBox>
				)}
			</ScrollView>
		</FlexBox>
	);
};

export default Events;
