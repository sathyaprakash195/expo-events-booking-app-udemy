import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FlexBox from "@/components/ui/flexbox";
import CustomText from "@/components/ui/custom-text";
import { PRIMARY_COLOR } from "@/constants";
import { Icon } from "react-native-paper";
import CustomButton from "@/components/ui/custom-button";
import { useRouter } from "expo-router";

const topThrreeFeatures = [
	{
		text: "Discover Events: Explore a wide range of events happening around you.",
		icon: "calendar",
	},
	{
		text: "Stay Updated: Get real-time notifications about upcoming events.",
		icon: "bell",
	},
	{
		text: "Easy Registration: Register for events with just a few taps.",
		icon: "check",
	},
];

const WelcomeScreen = () => {
	const router = useRouter();
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<FlexBox
				alignItems="center"
				flex={1}
				paddingHorizontal={25}
				paddingVertical={30}
				gap={20}
			>
				<Image
					source={require("@/assets/images/icon.png")}
					style={{ width: 100, height: 100, alignSelf: "center" }}
				/>
				<CustomText
					value="Expo Events"
					fontSize={30}
					fontWeight="bold"
					fontColor={PRIMARY_COLOR}
					textAlign="center"
				/>
				{/* underline */}
				<View
					style={{
						height: 5,
						backgroundColor: PRIMARY_COLOR,
						width: 100,
					}}
				></View>

				<CustomText
					value="Discover and attend events around you with ease. Stay updated on the latest happenings and never miss out on exciting opportunities."
					fontSize={16}
					fontColor="#555"
					textAlign="center"
				/>

				<FlexBox gap={15} marginVertical={20} paddingHorizontal={15}>
					{topThrreeFeatures.map((feature, index) => (
						<FlexBox
							style={{
								padding: 15,
								borderWidth: 1,
								borderColor: "#ddd",
								borderRadius: 10,
								backgroundColor: "#f9f9f9",
								overflow: "hidden",
							}}
							key={index}
							flexDirection="row"
							alignItems="center"
							gap={15}
						>
							<Icon source={feature.icon} size={24} color={PRIMARY_COLOR} />
							<CustomText value={feature.text} fontSize={14} fontColor="#555" />
						</FlexBox>
					))}
				</FlexBox>

				<CustomButton
					onPress={() => {
						router.push("/register")
					}}
				>

					Get Started
				</CustomButton>

				<CustomButton
					onPress={() => {
						router.push("/login")
					}}
					mode="outlined">Sign In</CustomButton>
			</FlexBox>
		</SafeAreaView>
	);
};

export default WelcomeScreen;
