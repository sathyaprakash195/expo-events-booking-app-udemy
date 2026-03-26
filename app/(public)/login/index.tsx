import {
	View,
	Text,
	Image,
	KeyboardAvoidingView,
	ScrollView,
	BackHandler,
	Alert,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FlexBox from "@/components/ui/flexbox";
import CustomText from "@/components/ui/custom-text";
import { PRIMARY_COLOR, UserRoles } from "@/constants";
import { Divider } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import CustomButton from "@/components/ui/custom-button";
import CustomInput from "@/components/ui/custom-input";
import CustomDropdown from "@/components/ui/custom-dropdown";
import { Link, useNavigation, useRouter } from "expo-router";
import { loginUser } from "@/services/users";
import Toast from "react-native-toast-message";
import { useUsersStore } from "@/store/users-store";



const LoginScreen = () => {
	const [loading, setLoading] = React.useState(false);
	const navigation = useNavigation()
	const { setUser } = useUsersStore();
	const router = useRouter();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			role: "",
			email: "",
			password: "",
		},
	});
	const onSubmit = async (data: any) => {
		try {
			setLoading(true);
			const response = await loginUser(data);
			setUser(response.user);
			Toast.show({
				type: "success",
				text1: "Login successful!",
				text2: "Welcome back!",
			});
			setTimeout(() => {
				if (data.role === "user") {
					router.push("/user/home");
				} else {
					router.push("/admin/home");
				}
			}, 1500);
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Login failed",
				text2: error.message || "An error occurred during login.",
			});
			console.error("Login error:", error);
		} finally {
			setLoading(false);
		}
	};


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
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={"padding"}
				keyboardVerticalOffset={100}
			>
				<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
					<FlexBox flex={1}>
						<Image
							source={require("@/assets/images/auth-header.png")}
							style={{ width: "100%", height: 200, resizeMode: "cover" }}
						/>
						<FlexBox paddingHorizontal={25} gap={10}>
							<CustomText
								value="Login"
								fontColor={PRIMARY_COLOR}
								fontSize={26}
								fontWeight="bold"
							/>
							<CustomText
								value="Sign in to your account!"
								fontColor="#666"
								fontSize={16}
							/>

							<Divider
								style={{
									marginVertical: 5,
									borderWidth: 1,
									borderColor: "#ccc",
								}}
							/>
							{/* Login form goes here */}

							<Controller
								control={control}
								rules={{
									required: true,
								}}
								render={({ field: { onChange, value } }) => (
									<CustomDropdown
										label="Role"
										options={UserRoles}
										value={value}
										onValueChange={onChange}
										error={!!errors.role}
										errorMessage={errors.role ? "Role is required." : ""}
									/>
								)}
								name="role"
							/>

							<Controller
								control={control}
								rules={{
									required: true,
									pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
								}}
								render={({ field: { onChange, onBlur, value } }) => (
									<CustomInput
										placeholder="Email"
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
										label="Email"
										errorMessage={
											errors.email
												? errors.email.type === "pattern"
													? "Invalid email format."
													: "Email is required."
												: ""
										}
									/>
								)}
								name="email"
							/>

							<Controller
								control={control}
								rules={{
									required: true,
									minLength: 6,
								}}
								render={({ field: { onChange, onBlur, value } }) => (
									<CustomInput
										placeholder="Password"
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
										label="Password"
										errorMessage={
											errors.password
												? errors.password.type === "minLength"
													? "Password must be at least 6 characters."
													: "Password is required."
												: ""
										}
										secureTextEntry
									/>
								)}
								name="password"
							/>

							<FlexBox marginVertical={25} gap={10}>
								<CustomButton
									onPress={() => handleSubmit(onSubmit)()}
									disabled={loading}
								>
									Login
								</CustomButton>
								<FlexBox flexDirection="row" justifyContent="center">
									<CustomText value="Don't have an account? " />
									<Link
										href="/register"
										style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}
									>
										Register
									</Link>
								</FlexBox>
							</FlexBox>
						</FlexBox>
					</FlexBox>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default LoginScreen;
