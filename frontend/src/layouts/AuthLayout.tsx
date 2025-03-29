// src/layouts/AuthLayout.tsx
import { Outlet } from "react-router-dom";

import Title from "@/components/Title";
import { TypoH1, TypoH4 } from "@/components/ui/typography";
import { useNavigateTo } from "@/hooks/use-navigate-to";

function AuthLayout() {
	const { toHome } = useNavigateTo();
	return (
		<div className="flex flex-col flex-1 items-center w-full h-full p-10 gap-5">
			<div className="h-20 w-full flex items-end justify-center px-5">
				<div className="cursor-pointer" onClick={toHome}>
					<TypoH1 classname="leading-none text-5xl">Chef!</TypoH1>
					<TypoH4 classname="leading-none ml-5 text-3xl">
						AI Recipe Maker
					</TypoH4>
				</div>
			</div>
			<main className="flex-1 flex flex-col items-center justify-center">
				<Outlet />
			</main>
		</div>
	);
}

export default AuthLayout;
