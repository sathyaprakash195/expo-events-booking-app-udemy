import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FlexBox from "@/components/ui/flexbox";
import CustomText from "@/components/ui/custom-text";
import { PRIMARY_COLOR } from "@/constants";
import { Divider } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import CustomButton from "@/components/ui/custom-button";
import CustomInput from "@/components/ui/custom-input";
import { Link, useRouter } from "expo-router";
import { registerUser } from "@/services/users";
import Toast from 'react-native-toast-message';

const RegisterScreen = () => {
	const [loading, setLoading] = React.useState(false);
	const router = useRouter();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});
	const onSubmit = async (data: any) => {
		try {
			setLoading(true);
			await registerUser(data);
			Toast.show({
				type: 'success',
				text1: 'Registration successful!',
				text2: 'You can now log in with your credentials.',
			});
			setTimeout(() => {
				router.push('/login');
			}, 1500);
		} catch (error: any) {
			Toast.show({
				type: 'error',
				text1: 'Registration failed',
				text2: error.message || 'An error occurred during registration.',
			});
			console.error("Registration error:", error);
		} finally {
			setLoading(false);
		}
	}
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
			<FlexBox flex={1}>
				<Image
					source={require("@/assets/images/auth-header.png")}
					style={{ width: "100%", height: 200, resizeMode: "cover" }}
				/>
				<FlexBox paddingHorizontal={25} gap={10}>
					<CustomText
						value="Create Account"
						fontColor={PRIMARY_COLOR}
						fontSize={26}
						fontWeight="bold"
					/>
					<CustomText
						value="Sign up to get started!"
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
					{/* Registration form goes here */}

					<Controller
						control={control}
						rules={{
							required: true,
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<CustomInput
								placeholder="Name"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								label="Name"
								errorMessage={errors.name ? "Name is required." : ""}
							/>
						)}
						name="name"
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
						>Register</CustomButton>
						<FlexBox flexDirection="row" justifyContent="center">
							<CustomText value="Already have an account? " />
							<Link
								href="/login"
								style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}
							>
								Login
							</Link>
						</FlexBox>
					</FlexBox>
				</FlexBox>
			</FlexBox>
		</SafeAreaView>
	);
};

export default RegisterScreen;
