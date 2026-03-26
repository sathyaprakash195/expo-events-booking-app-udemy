import React from "react";
import { View } from "react-native";
import FlexBox from "@/components/ui/flexbox";
import CustomText from "@/components/ui/custom-text";
import Title from "@/components/ui/title";
import { PRIMARY_COLOR } from "@/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomButton from "@/components/ui/custom-button";
import { useUsersStore } from "@/store/users-store";
import { logoutUser } from "@/services/users";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

const Profile = () => {
	const user = useUsersStore((state) => state.user);
	const { setUser } = useUsersStore();
	const router = useRouter();
	const [loading, setLoading] = React.useState(false);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const getInitial = (name: string) => {
		return name ? name.charAt(0).toUpperCase() : "U";
	};

	const formatRole = (role: string) => {
		return role.charAt(0).toUpperCase() + role.slice(1).toUpperCase();
	};

	const handleLogout = async () => {
		try {
			setLoading(true);
			await logoutUser();
			setUser(null);
			Toast.show({
				type: "success",
				text1: "Logged out successfully",
				text2: "See you next time!",
			});
			setTimeout(() => {
				router.push("/login");
			}, 1500);
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Logout failed",
				text2: error.message || "An error occurred during logout.",
			});
			console.error("Logout error:", error);
		} finally {
			setLoading(false);
		}
	};

	if (!user) {
		return (
			<FlexBox flex={1} paddingHorizontal={20} paddingVertical={20} justifyContent="center" alignItems="center">
				<CustomText
					value="No user data available"
					fontSize={16}
					fontColor="#666"
				/>
			</FlexBox>
		);
	}

	return (
		<FlexBox flex={1} paddingHorizontal={20} paddingVertical={20}>
			<Title title="Profile" />

			{/* Avatar Section */}
			<FlexBox
				alignItems="center"
				gap={15}
				marginVertical={30}
			>
				<View
					style={{
						width: 80,
						height: 80,
						borderRadius: 40,
						backgroundColor: PRIMARY_COLOR,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<CustomText
						value={getInitial(user.name)}
						fontSize={36}
						fontWeight="bold"
						fontColor="#fff"
					/>
				</View>

				<FlexBox alignItems="center" gap={5}>
					<CustomText
						value={user.name}
						fontSize={20}
						fontWeight="bold"
					/>
					<CustomText
						value={formatRole(user.role)}
						fontSize={12}
						fontColor="#666"
					/>
				</FlexBox>
			</FlexBox>

			{/* Email Section */}
			<FlexBox
				flexDirection="row"
				alignItems="center"
				gap={15}
				paddingVertical={15}
				style={{
					borderBottomWidth: 1,
					borderBottomColor: "#eee",
				}}
			>
				<MaterialCommunityIcons
					name="email"
					size={24}
					color={PRIMARY_COLOR}
				/>
				<FlexBox flex={1}>
					<CustomText
						value="Email"
						fontSize={12}
						fontColor="#666"
					/>
					<CustomText
						value={user.email}
						fontSize={14}
						fontWeight="bold"
					/>
				</FlexBox>
			</FlexBox>

			{/* Joined Section */}
			<FlexBox
				flexDirection="row"
				alignItems="center"
				gap={15}
				paddingVertical={15}
				style={{
					borderBottomWidth: 1,
					borderBottomColor: "#eee",
				}}
			>
				<MaterialCommunityIcons
					name="calendar"
					size={24}
					color={PRIMARY_COLOR}
				/>
				<FlexBox flex={1}>
					<CustomText
						value="Joined"
						fontSize={12}
						fontColor="#666"
					/>
					<CustomText
						value={formatDate(user.created_at)}
						fontSize={14}
						fontWeight="bold"
					/>
				</FlexBox>
			</FlexBox>

			{/* Logout Button */}
			<FlexBox marginVertical={40}>
				<CustomButton
					onPress={handleLogout}
					disabled={loading}
				>
					Logout
				</CustomButton>
			</FlexBox>
		</FlexBox>
	);
};

export default Profile;
