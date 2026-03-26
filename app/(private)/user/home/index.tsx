import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Events from "./_components/events";
import Bookings from "./_components/bookings";
import Report from "./_components/report";
import Profile from "./_components/profile";
import { BottomNavigation } from "react-native-paper";
import { PRIMARY_COLOR } from "@/constants";

import { BackHandler, Alert } from "react-native";
import { useEffect } from "react";
import { useNavigation } from "expo-router";

const UserHomescreen = () => {
	const navigation = useNavigation();
	const [index, setIndex] = React.useState(0);
	const routesArray = [
		{
			key: "events",
			title: "Events",
			focusedIcon: "calendar",
			unfocusedIcon: "calendar-outline"
		},
		{
			key: "bookings",
			title: "Bookings",
			focusedIcon: "ticket-confirmation",
			unfocusedIcon: "ticket-confirmation-outline"
		},
		{
			key: "report",
			title: "Report",
			focusedIcon: "file-chart",
			unfocusedIcon: "file-chart-outline"
		},
		{
			key: "profile",
			title: "Profile",
			focusedIcon: "account",
			unfocusedIcon: "account-outline"
		}
	];

	const renderScene = BottomNavigation.SceneMap({
		events: Events,
		bookings: Bookings,
		report: Report,
		profile: Profile
	});

	useEffect(() => {

		const backAction = BackHandler.addEventListener("hardwareBackPress", () => {

			if (navigation.isFocused()) {
				Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
					{
						text: "Cancel",
						onPress: () => null,
						style: "cancel",
					},
					{ text: "YES", onPress: () => BackHandler.exitApp() },
				]);
				return true;
			}
			return false;

		})

		return () => backAction.remove();


	}, [navigation]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
			<BottomNavigation
				navigationState={{ index, routes: routesArray }}
				onIndexChange={setIndex}
				renderScene={renderScene}
				shifting
				activeColor={PRIMARY_COLOR}
				barStyle={{ backgroundColor: "#f4eeee", borderTopColor: "#ddd", borderTopWidth: 1 }}
			/>
		</SafeAreaView>
	);
};

export default UserHomescreen;