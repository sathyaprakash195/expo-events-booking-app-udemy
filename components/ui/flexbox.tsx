import React from "react";
import { View, ViewProps, ViewStyle } from "react-native";

export interface FlexBoxProps extends ViewProps {
  children?: React.ReactNode;

  // Flex
  flex?: number;
  flexDirection?: ViewStyle["flexDirection"];
  flexWrap?: ViewStyle["flexWrap"];
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: ViewStyle["flexBasis"];

  // Alignment
  justifyContent?: ViewStyle["justifyContent"];
  alignItems?: ViewStyle["alignItems"];
  alignContent?: ViewStyle["alignContent"];

  // Gap (RN 0.71+)
  gap?: number;
  rowGap?: number;
  columnGap?: number;

  // Size
  width?: ViewStyle["width"];
  height?: ViewStyle["height"];
  minWidth?: ViewStyle["minWidth"];
  minHeight?: ViewStyle["minHeight"];
  maxWidth?: ViewStyle["maxWidth"];
  maxHeight?: ViewStyle["maxHeight"];

  // Spacing
  padding?: ViewStyle["padding"];
  paddingHorizontal?: ViewStyle["paddingHorizontal"];
  paddingVertical?: ViewStyle["paddingVertical"];
  margin?: ViewStyle["margin"];
  marginHorizontal?: ViewStyle["marginHorizontal"];
  marginVertical?: ViewStyle["marginVertical"];

  // colors
  backgroundColor?: ViewStyle["backgroundColor"];

  // Extra
  style?: ViewStyle;
}

const FlexBox = ({
  children,

  // Flex
  flex,
  flexDirection = "column",
  flexWrap = "nowrap",
  flexGrow,
  flexShrink,
  flexBasis,

  // Alignment
  justifyContent = "flex-start",
  alignItems = "stretch",
  alignContent,

  // Gap (RN 0.71+)
  gap = 5,
  rowGap,
  columnGap,

  // Size
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,

  // Spacing
  padding,
  paddingHorizontal,
  paddingVertical,
  margin,
  marginHorizontal,
  marginVertical,

  // colors
  backgroundColor,

  // Extra styles
  style,

  ...rest
}: FlexBoxProps) => {
  return (
    <View
      style={[
        {
          flex,
          flexDirection,
          flexWrap,
          flexGrow,
          flexShrink,
          flexBasis,

          justifyContent,
          alignItems,
          alignContent,

          gap,
          rowGap,
          columnGap,

          width,
          height,
          minWidth,
          minHeight,
          maxWidth,
          maxHeight,

          padding,
          paddingHorizontal,
          paddingVertical,
          margin,
          marginHorizontal,
          marginVertical,
          backgroundColor,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

export default FlexBox;
