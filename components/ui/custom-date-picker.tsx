import React, { useState } from "react";
import { Platform, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput } from "react-native-paper";
import CustomText from "./custom-text";
import FlexBox from "./flexbox";
import dayjs from "dayjs";

interface CustomDatePickerProps {
  label: string;
  value: string;
  onDateChange: (date: string) => void;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onDateChange,
  error = false,
  errorMessage = "",
  placeholder = "Select a date",
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(value ? new Date(value) : new Date());

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
      onDateChange(formattedDate);
    }
  };

  const displayValue = value
    ? dayjs(value).format("MMM DD, YYYY")
    : placeholder;

  return (
    <FlexBox>
      <CustomText value={label} fontSize={16} fontWeight="bold" />
      <TouchableOpacity onPress={() => setShowPicker(true)} activeOpacity={0.7}>
        <TextInput
          value={displayValue}
          placeholder={placeholder}
          editable={false}
          style={{
            borderRadius: 4,
            backgroundColor: "#fff",
          }}
          mode="outlined"
          pointerEvents="none"
        />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {error && (
        <CustomText value={errorMessage} fontSize={12} fontColor="red" />
      )}
    </FlexBox>
  );
};

export default CustomDatePicker;
