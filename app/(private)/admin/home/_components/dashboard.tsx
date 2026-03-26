import React from "react";
import FlexBox from "@/components/ui/flexbox";
import Title from "@/components/ui/title";

const Dashboard = () => {
	return (
		<FlexBox flex={1} paddingHorizontal={20} paddingVertical={20}>
			<Title title="Dashboard" />
		</FlexBox>
	);
};

export default Dashboard;
