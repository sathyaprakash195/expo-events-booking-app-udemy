import React, { useCallback, useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import FlexBox from "@/components/ui/flexbox";
import Title from "@/components/ui/title";
import BookingCard from "@/components/functional/booking-card";
import { getUserBookings } from "@/services/bookings";
import Toast from "react-native-toast-message";
import CustomText from "@/components/ui/custom-text";
import { useFocusEffect } from "expo-router";
import { useUsersStore } from "@/store/users-store";

const Bookings = () => {
	const [bookings, setBookings] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useUsersStore();

	const fetchBookings = async () => {
		try {
			setIsLoading(true);
			if (!user?.id) return;
			const data = await getUserBookings(user.id);
			setBookings(data || []);
		} catch (error) {
			Toast.show({ type: "error", text1: "Failed to fetch bookings" });
		} finally {
			setIsLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchBookings();
		}, [user?.id])
	);

	return (
		<FlexBox flex={1} paddingHorizontal={20} paddingVertical={20}>
			{/* Header */}
			<FlexBox marginVertical={15}>
				<Title title="Bookings" caption="Your confirmed bookings" />
			</FlexBox>

			{/* Bookings List */}
			<ScrollView
				style={{ flex: 1 }}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={isLoading} onRefresh={fetchBookings} />
				}
			>
				{bookings.length > 0 ? (
					<FlexBox gap={8}>
						{bookings.map((booking) => (
							<BookingCard
								key={booking.id}
								booking={booking}
								onCancel={fetchBookings}
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
							value="No bookings yet"
							fontSize={14}
							fontColor="#999"
						/>
					</FlexBox>
				)}
			</ScrollView>
		</FlexBox>
	);
};

export default Bookings;
