import React, { useCallback, useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import FlexBox from "@/components/ui/flexbox";
import Title from "@/components/ui/title";
import ReportCard from "@/components/functional/report-card";
import { getUserBookingsReport } from "@/services/reports";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "expo-router";
import { useUsersStore } from "@/store/users-store";

interface ReportData {
	totalBookings: number;
	totalTicketsPurchased: number;
	totalAmountSpent: number;
	upcomingBookings: number;
	pastBookings: number;
}

const Report = () => {
	const [report, setReport] = useState<ReportData | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useUsersStore();

	const fetchReport = async () => {
		try {
			setIsLoading(true);
			if (!user?.id) return;
			const data = await getUserBookingsReport(user.id);
			setReport(data);
		} catch (error) {
			Toast.show({ type: "error", text1: "Failed to fetch report" });
		} finally {
			setIsLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchReport();
		}, [user?.id])
	);

	return (
		<FlexBox flex={1} paddingHorizontal={20} paddingVertical={20}>
			{/* Header */}
			<FlexBox marginVertical={15}>
				<Title title="Report" caption="Your booking statistics" />
			</FlexBox>

			{/* Report Cards */}
			<ScrollView
				style={{ flex: 1 }}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={isLoading} onRefresh={fetchReport} />
				}
			>
				{report ? (
					<FlexBox gap={12}>
						<ReportCard
							icon="calendar-check"
							title="Total Bookings"
							value={report.totalBookings}
							caption="All time bookings"
							color="#2196F3"
						/>

						<ReportCard
							icon="receipt-text-outline"
							title="Total Tickets Purchased"
							value={report.totalTicketsPurchased}
							caption="Across all bookings"
							color="#4CAF50"
						/>

						<ReportCard
							icon="currency-usd"
							title="Total Amount Spent"
							value={`$${report.totalAmountSpent.toFixed(2)}`}
							caption="Total investment"
							color="#FF9800"
						/>

						<ReportCard
							icon="calendar-arrow-right"
							title="Upcoming Bookings"
							value={report.upcomingBookings}
							caption="Events to attend"
							color="#2196F3"
						/>

						<ReportCard
							icon="calendar-check-outline"
							title="Past Bookings"
							value={report.pastBookings}
							caption="Attended events"
							color="#9C27B0"
						/>
					</FlexBox>
				) : null}
			</ScrollView>
		</FlexBox>
	);
};

export default Report;
