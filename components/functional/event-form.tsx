import React from "react";
import {
	View,
	ScrollView,
	KeyboardAvoidingView,
	Image,
	TouchableOpacity,
	Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import FlexBox from "@/components/ui/flexbox";
import CustomText from "@/components/ui/custom-text";
import CustomInput from "@/components/ui/custom-input";
import CustomButton from "@/components/ui/custom-button";
import CustomDatePicker from "@/components/ui/custom-date-picker";
import CustomDropdown from "@/components/ui/custom-dropdown";
import Title from "@/components/ui/title";
import { PRIMARY_COLOR } from "@/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IEvent } from "@/interfaces";
import Toast from "react-native-toast-message";
import { createEvent, uploadEventImage, updateEvent } from "@/services/events";
import { useRouter } from "expo-router";

interface EventFormProps {
	formType: "add" | "edit";
	event?: IEvent;
}

const EventForm: React.FC<EventFormProps> = ({
	formType,
	event,
}) => {
	const router = useRouter();
	const submitButtonText = formType === "add" ? "Create Event" : "Update Event";
	const [isLoading, setIsLoading] = React.useState(false);
	const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

	const statusOptions = [
		{ label: "Upcoming", value: "upcoming" },
		{ label: "Completed", value: "completed" },
	];

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			name: "",
			description: "",
			date: "",
			time: "",
			location: "",
			organizer: "",
			ticket_price: "",
			total_tickets_count: "",
			status: "upcoming",
		},
	});

	// Pre-fill form data when editing
	React.useEffect(() => {
		if (formType === "edit" && event) {
			reset({
				name: event.name,
				description: event.description,
				date: event.date,
				time: event.time,
				location: event.location,
				organizer: event.organizer,
				ticket_price: event.ticket_price.toString(),
				total_tickets_count: event.total_tickets_count.toString(),
				status: event.status,
			});
			// Set existing image
			if (event.image_url) {
				setSelectedImage(event.image_url);
			}
		}
	}, [formType, event, reset]);

	const pickImage = async () => {
		try {
			// Request media library permissions
			const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (!permissionResult.granted) {
				Alert.alert(
					"Permission required",
					"Permission to access the media library is required."
				);
				return;
			}

			// Launch image library picker
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ["images"],
				allowsEditing: true,
				aspect: [16, 9],
				quality: 1,
			});

			if (!result.canceled) {
				setSelectedImage(result.assets[0].uri);
			}
		} catch (error) {
			Alert.alert("Error", "Failed to pick image. Please try again.");
			console.error("Image picker error:", error);
		}
	};

	const changeImage = async () => {
		await pickImage();
	};

	const handleFormSubmit = async (data: any) => {
		try {
			setIsLoading(true);

			let imageUrl = "";

			if (formType === "add") {
				// ADD MODE: Upload new image
				if (selectedImage) {
					imageUrl = await uploadEventImage(selectedImage);
				}

				// Create event with the data and image URL
				await createEvent({
					name: data.name,
					description: data.description,
					date: data.date,
					time: data.time,
					location: data.location,
					organizer: data.organizer,
					ticket_price: parseFloat(data.ticket_price),
					total_tickets_count: parseInt(data.total_tickets_count),
					status: data.status,
					image_url: imageUrl,
				});

				Toast.show({
					type: "success",
					text1: "Event created successfully!",
					text2: "Your event has been created.",
				});
			} else {
				// EDIT MODE: Update event
				if (!event) throw new Error("Event data not found");

				// Only upload new image if it was changed (not a URL from selectedImage)
				if (selectedImage && !selectedImage.startsWith("http")) {
					imageUrl = await uploadEventImage(selectedImage);
				} else if (selectedImage && selectedImage.startsWith("http")) {
					// Keep existing image
					imageUrl = selectedImage;
				}

				await updateEvent(event.id, {
					name: data.name,
					description: data.description,
					date: data.date,
					time: data.time,
					location: data.location,
					organizer: data.organizer,
					ticket_price: parseFloat(data.ticket_price),
					total_tickets_count: parseInt(data.total_tickets_count),
					status: data.status,
					image_url: imageUrl,
				});

				Toast.show({
					type: "success",
					text1: "Event updated successfully!",
					text2: "Your event has been updated.",
				});
			}

			setTimeout(() => {
				router.push("/admin/home");
			}, 1500);
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Submission failed",
				text2: error.message || "An error occurred during submission.",
			});
			console.error("Form submission error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<FlexBox paddingVertical={20} gap={15}>


			{/* Image Picker Section */}
			<FlexBox gap={10}>
				<CustomText value="Event Image" fontSize={16} fontWeight="bold" />
				{selectedImage ? (
					<FlexBox gap={10}>
						<Image
							source={{ uri: selectedImage }}
							style={{
								width: "100%",
								height: 200,
								borderRadius: 8,
								backgroundColor: "#f0f0f0",
							}}
						/>
						<TouchableOpacity
							onPress={changeImage}
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								gap: 8,
								paddingVertical: 10,
								paddingHorizontal: 15,
								borderRadius: 8,
								borderWidth: 1,
								borderColor: PRIMARY_COLOR,
							}}
							activeOpacity={0.7}
						>
							<MaterialCommunityIcons
								name="image-edit"
								size={20}
								color={PRIMARY_COLOR}
							/>
							<CustomText
								value="Change Image"
								fontSize={14}
								fontColor={PRIMARY_COLOR}
								fontWeight="bold"
							/>
						</TouchableOpacity>
					</FlexBox>
				) : (
					<TouchableOpacity
						onPress={pickImage}
						style={{
							width: "100%",
							height: 150,
							borderRadius: 8,
							borderWidth: 2,
							borderStyle: "dashed",
							borderColor: PRIMARY_COLOR,
							backgroundColor: "#f9f5ff",
							justifyContent: "center",
							alignItems: "center",
							gap: 8,
						}}
						activeOpacity={0.7}
					>
						<FlexBox alignItems="center" gap={8}>
							<MaterialCommunityIcons
								name="image-plus"
								size={40}
								color={PRIMARY_COLOR}
							/>
							<CustomText
								value="Select Event Image"
								fontSize={14}
								fontColor={PRIMARY_COLOR}
								fontWeight="bold"
								textAlign="center"
							/>
							<CustomText
								value="Tap to browse from gallery"
								fontSize={12}
								fontColor="#999"
								textAlign="center"
							/>
						</FlexBox>
					</TouchableOpacity>
				)}
			</FlexBox>

			<Controller
				control={control}
				rules={{
					required: "Event name is required",
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<CustomInput
						placeholder="Event Name"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						label="Event Name"
						error={!!errors.name}
						errorMessage={errors.name?.message || ""}
					/>
				)}
				name="name"
			/>

			<Controller
				control={control}
				rules={{
					required: "Description is required",
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<CustomInput
						placeholder="Event Description"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						label="Description"
						multiline
						numberOfLines={4}
						error={!!errors.description}
						errorMessage={errors.description?.message || ""}
					/>
				)}
				name="description"
			/>

			<Controller
				control={control}
				rules={{
					required: "Date is required",
				}}
				render={({ field: { onChange, value } }) => (
					<CustomDatePicker
						label="Event Date"
						value={value}
						onDateChange={onChange}
						error={!!errors.date}
						errorMessage={errors.date?.message || ""}
					/>
				)}
				name="date"
			/>

			<Controller
				control={control}
				rules={{
					required: "Time is required",
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<CustomInput
						placeholder="HH:mm"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						label="Event Time"
						error={!!errors.time}
						errorMessage={errors.time?.message || ""}
					/>
				)}
				name="time"
			/>

			<Controller
				control={control}
				rules={{
					required: "Location is required",
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<CustomInput
						placeholder="Event Location"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						label="Location"
						error={!!errors.location}
						errorMessage={errors.location?.message || ""}
					/>
				)}
				name="location"
			/>

			<Controller
				control={control}
				rules={{
					required: "Organizer name is required",
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<CustomInput
						placeholder="Organizer Name"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						label="Organizer"
						error={!!errors.organizer}
						errorMessage={errors.organizer?.message || ""}
					/>
				)}
				name="organizer"
			/>

			<Controller
				control={control}
				rules={{
					required: "Ticket price is required",
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<CustomInput
						placeholder="0.00"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						label="Ticket Price"
						keyboardType="decimal-pad"
						error={!!errors.ticket_price}
						errorMessage={errors.ticket_price?.message || ""}
					/>
				)}
				name="ticket_price"
			/>

			<Controller
				control={control}
				rules={{
					required: "Total tickets count is required",
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<CustomInput
						placeholder="100"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						label="Total Tickets"
						keyboardType="number-pad"
						error={!!errors.total_tickets_count}
						errorMessage={errors.total_tickets_count?.message || ""}
					/>
				)}
				name="total_tickets_count"
			/>

			<Controller
				control={control}
				rules={{
					required: "Status is required",
				}}
				render={({ field: { onChange, value } }) => (
					<CustomDropdown
						label="Event Status"
						options={statusOptions}
						value={value}
						onValueChange={onChange}
						error={!!errors.status}
						errorMessage={errors.status ? "Status is required" : ""}
					/>
				)}
				name="status"
			/>

			<FlexBox marginVertical={25} gap={10}>
				<CustomButton
					onPress={() => handleSubmit(handleFormSubmit)()}
					disabled={isLoading}
				>
					{submitButtonText}
				</CustomButton>
			</FlexBox>
		</FlexBox>
	);
};

export default EventForm;