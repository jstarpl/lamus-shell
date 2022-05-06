import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import "./AppTabs.css"
import { CodeEditor } from "../CodeEditor/CodeEditor"
import { TabList } from "../TabList/TabList"
import { BrowserView } from "./BrowserView"
import { ComponentView } from "./ComponentView"

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
					visible={selectedTab === "home"}
					url={"lamus://test.html"}
				/>
				<div className="tab-contents">
					<CodeEditor />
				</div>
			</div>
		</>
	)
}
