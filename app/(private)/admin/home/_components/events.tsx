import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, RefreshControl } from "react-native";
import FlexBox from "@/components/ui/flexbox";
import Title from "@/components/ui/title";
import CustomButton from "@/components/ui/custom-button";
import { useRouter, useFocusEffect, RelativePathString } from "expo-router";
import EventCard from "@/components/functional/event-card";
import { getAllEvents } from "@/services/events";
import { IEvent } from "@/interfaces";
import Toast from "react-native-toast-message";
import CustomText from "@/components/ui/custom-text";

const Events = () => {
	const router = useRouter();
	const [events, setEvents] = useState<IEvent[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const fetchEvents = async () => {
		try {
			setIsLoading(true);
			const data = await getAllEvents();
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

	const handleEdit = (event: IEvent) => {
		router.push({
			pathname: `/admin/edit-event/${event.id}` as RelativePathString,
		});
	};

	const handleDeleteSuccess = () => {
		fetchEvents();
	};

	return (
		<FlexBox flex={1} paddingHorizontal={20} paddingVertical={20}>
			{/* Header */}
			<FlexBox
				alignItems="center"
				justifyContent="space-between"
				flexDirection="row"
				marginVertical={15}
			>
				<Title title="Events" />
				<CustomButton
					minWidth
					onPress={() => {
						router.push("/admin/add-event");
					}}
				>
					+
				</CustomButton>
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
								onEdit={handleEdit}
								onDelete={handleDeleteSuccess}
								showActions={true}
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
							value="No events found. Create one to get started!"
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
