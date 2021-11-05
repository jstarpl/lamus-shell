import React from 'react'
import './TabList.css'
import { TabButton } from './TabButton'

export function TabList() {
	return (
		<ul className="tab-list">
			<li className="selected"><TabButton>Home</TabButton></li>
			<li><TabButton>Other tabs</TabButton></li>
		</ul>
	)
}