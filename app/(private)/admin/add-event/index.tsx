import { View, Text, KeyboardAvoidingView, ScrollView } from 'react-native'
import React from 'react'
import Title from '@/components/ui/title'
import EventForm from '@/components/functional/event-form'
import { SafeAreaView } from 'react-native-safe-area-context'

const AddEventScreen = () => {
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
						<Title title="Add Event"
							caption='Create a new event by filling out the form below.'
						/>
						<EventForm formType="add" />
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

export default AddEventScreen