import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FlexBox from "@/components/ui/flexbox";
import CustomText from "@/components/ui/custom-text";
import { PRIMARY_COLOR } from "@/constants";

interface ReportCardProps {
	icon: string;
	title: string;
	value: string | number;
	caption?: string;
	color?: string;
}

const ReportCard = ({
	icon,
	title,
	value,
	caption,
	color = PRIMARY_COLOR,
}: ReportCardProps) => {
	return (
		<FlexBox
			backgroundColor="#fff"
			padding={15}
			style={{
				borderRadius: 5,
				overflow: "hidden",
				borderColor: "#d4cece",
				borderWidth: 1,
			}}
			flexDirection="row"
			alignItems="center"
			justifyContent="space-between"
			gap={15}
		>
			{/* Content */}
			<FlexBox flex={1}>
				{/* Title */}
				<CustomText
					value={title}
					fontSize={12}
					fontColor="#1a1a1a"
					fontWeight="700"
				/>

				{/* Caption */}
				{caption && (
					<CustomText
						value={caption}
						fontSize={10}
						fontColor="#555"
						fontWeight="600"
					/>
				)}

				{/* Value */}
				<CustomText
					value={String(value)}
					fontSize={20}
					fontWeight="700"
					fontColor={color}
				/>
			</FlexBox>

			{/* Icon Container */}
			<FlexBox
				width={50}
				height={50}
				backgroundColor={`${color}20`}
				alignItems="center"
				justifyContent="center"
				style={{
					borderRadius: 10,
					borderColor: color,
					borderWidth: 1,
					overflow: "hidden",

				}}
			>
				<MaterialCommunityIcons
					name={icon as any}
					size={24}
					color={color}
				/>
			</FlexBox>
		</FlexBox>
	);
};

export default ReportCard;
