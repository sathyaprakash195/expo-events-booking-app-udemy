import React from "react";
import CustomText from "./custom-text";

import { PRIMARY_COLOR } from "@/constants";
import Flexbox from "./flexbox";

interface TabTitleProps {
  title: string;
  caption?: string;
}

const Title = (props: TabTitleProps) => {
  return (
    <Flexbox gap={3}>
      <CustomText
        value={props.title}
        fontSize={25}
        fontWeight="bold"
        fontColor={PRIMARY_COLOR}
      />
      {props.caption && (
        <CustomText
          value={props.caption}
          fontSize={14}
          fontWeight="bold"
          fontColor="#545454"
        />
      )}
    </Flexbox>
  );
};

export default Title;
