import React, {useEffect} from 'react'
import { TabList } from './TabList/TabList'

export function App() {
	useEffect(() => {
		document.body.classList.add('shell')

		return () => {
			document.body.classList.remove('shell')
		}
	})

	return (
		<div className="app">
			<TabList />
		</div>
	)
}