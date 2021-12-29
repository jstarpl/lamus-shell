import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import "./AppTabs.css"
import { CodeEditor } from "../CodeEditor/CodeEditor"
import { TabList } from "../TabList/TabList"
import { BrowserView } from "./BrowserView"

interface IProps {}

export function AppTabs(props: IProps) {
	const { t } = useTranslation()
	const [selectedTab, setSelectedTab] = useState("home")
	const [tabs, setTabs] = useState<[string, string][]>([
		["home", t("Home")],
		["code", t("Code")],
	])

	return (
		<>
			<TabList
				selectedTab={selectedTab}
				tabs={tabs}
				onChange={(id) => setSelectedTab(id)}
			/>
			<div className="tab-contents-area">
				<BrowserView
					className="tab-contents"
					visible={selectedTab === "code"}
					url={"lamus://test.html"}
				/>
			</div>
		</>
	)
}
