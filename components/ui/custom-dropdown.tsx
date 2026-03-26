import React from "react";
import { Dropdown } from "react-native-paper-dropdown";
import FlexBox from "./flexbox";
import CustomText from "./custom-text";

interface CustomDropdownProps {
  label: string;
  errorMessage?: string;
  error: boolean;
  options: { label: string; value: any }[];
  value: any;
  onValueChange: (value: any) => void;
}

const CustomDropdown = (props: CustomDropdownProps) => {
  const { label, error, errorMessage, options, value, onValueChange } = props;

  return (
    <FlexBox style={{ backgroundColor: "#fff" }}>
      <CustomText value={label} fontSize={16} fontWeight="bold" />
      <Dropdown
        mode="outlined"
        options={options}
        value={value}
        onSelect={onValueChange}
        menuContentStyle={{
          backgroundColor: "#fff",
        }}
        hideMenuHeader
      />
      {error && (
        <CustomText value={errorMessage || ""} fontSize={12} fontColor="red" />
      )}
    </FlexBox>
  );
};

export default CustomDropdown;
