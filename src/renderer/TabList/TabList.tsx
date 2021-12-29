import React from "react"
import "./TabList.css"
import { TabButton } from "./TabButton"

interface IProps {
	tabs: [string, string][]
	selectedTab: string
	onChange?: (id: string) => void
}

export function TabList({ tabs, selectedTab, onChange }: IProps) {
	console.log(selectedTab, tabs)
	return (
		<ul className="tab-list">
			{tabs.map((tab) => (
				<li
					key={tab[0]}
					className={tab[0] === selectedTab ? "selected" : undefined}
				>
					<TabButton
						selected={tab[0] === selectedTab}
						onClick={onChange && (() => onChange(tab[0]))}
					>
						{tab[1]}
					</TabButton>
				</li>
			))}
		</ul>
	)
}
