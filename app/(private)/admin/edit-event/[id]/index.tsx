import { View, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Title from '@/components/ui/title'
import EventForm from '@/components/functional/event-form'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import { getEventById } from '@/services/events'
import { IEvent } from '@/interfaces'
import CustomText from '@/components/ui/custom-text'
import FlexBox from '@/components/ui/flexbox'
import Toast from 'react-native-toast-message'

const EditEventScreen = () => {
	const { id } = useLocalSearchParams()
	const [event, setEvent] = useState<IEvent | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchEvent = async () => {
			try {
				setIsLoading(true)
				if (id) {
					const eventData = await getEventById(id as string)
					setEvent(eventData)
				}
			} catch (error: any) {
				Toast.show({
					type: "error",
					text1: "Failed to load event",
					text2: error.message || "Unable to fetch event data"
				})
			} finally {
				setIsLoading(false)
			}
		}

		fetchEvent()
	}, [id])

	if (isLoading) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
				<FlexBox flex={1} justifyContent="center" alignItems="center">
					<CustomText value="Loading event..." fontSize={16} fontColor="#666" />
				</FlexBox>
			</SafeAreaView>
		)
	}

	if (!event) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
				<FlexBox flex={1} justifyContent="center" alignItems="center">
					<CustomText value="Event not found" fontSize={16} fontColor="#d32f2f" />
				</FlexBox>
			</SafeAreaView>
		)
	}

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#fff" }}
		>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior="padding"
				keyboardVerticalOffset={100}
			>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1, padding: 20 }}
				>
					<View>
						<Title title="Edit Event"
							caption='Update the event details below.'
						/>
						<EventForm formType="edit" event={event} />
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

export default EditEventScreen