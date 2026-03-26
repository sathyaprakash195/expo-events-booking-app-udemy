import React from "react";
import { Button, ButtonProps } from "react-native-paper";

interface CustomButtonProps extends ButtonProps {
  minWidth?: boolean;
  height?: number;
}

const CustomButton = (props: CustomButtonProps) => {
  const { style, ...rest } = props;
  return (
    <Button
      {...rest}
      style={{
        height: props.height || 55,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        marginTop: 5,
        width: !props.minWidth ? "100%" : undefined,
      }}
      mode={props.mode || "contained"}
    >
      {props.children}
    </Button>
  );
};

export default CustomButton;
