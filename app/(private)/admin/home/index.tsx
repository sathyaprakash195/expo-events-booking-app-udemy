import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Dashboard from "./_components/dashboard";
import Profile from "./_components/profile";
import Events from "./_components/events";
import Bookings from "./_components/bookings";
import { BottomNavigation } from "react-native-paper";
import { PRIMARY_COLOR } from "@/constants";

import { BackHandler, Alert } from "react-native";
import { useEffect } from "react";
import { useNavigation } from "expo-router";

const AdminHomescreen = () => {
	const navigation = useNavigation();
	const [index, setIndex] = React.useState(0);
	const routesArray = [
		{
			key: "dashboard",
			title: "Dashboard",
			focusedIcon: "view-dashboard",
			unfocusedIcon: "view-dashboard-outline"
		},
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
			key: "profile",
			title: "Profile",
			focusedIcon: "account",
			unfocusedIcon: "account-outline"
		}
	];

	const renderScene = BottomNavigation.SceneMap({
		dashboard: Dashboard,
		events: Events,
		bookings: Bookings,
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

export default AdminHomescreen;
