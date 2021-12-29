import React, { useEffect } from "react"
import "./App.css"
import { AppTabs } from "./AppTabs/AppTabs"

export function App() {
	useEffect(() => {
		document.body.classList.add("shell")

		return () => {
			document.body.classList.remove("shell")
		}
	})

	return <AppTabs />
}
