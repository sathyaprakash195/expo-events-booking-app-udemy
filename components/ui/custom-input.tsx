import React from "react";
import { TextInput, TextInputProps } from "react-native-paper";
import FlexBox from "./flexbox";
import CustomText from "./custom-text";

interface CustomInputProps extends TextInputProps {
  label: string;
  errorMessage: string;
}

const CustomInput = (props: CustomInputProps) => {
  const { error, label, ...restProps } = props;
  return (
    <FlexBox>
      <CustomText value={label} fontSize={16} fontWeight="bold" />
      <TextInput
        {...restProps}
        style={{
          borderRadius: 4,
          backgroundColor: "#fff",
          paddingVertical: props.multiline ? 10 : 0,
          width: "100%",
        }}
        mode="outlined"
      />
      {props.error && (
        <CustomText value={props.errorMessage} fontSize={12} fontColor="red" />
      )}
    </FlexBox>
  );
};

export default CustomInput;
