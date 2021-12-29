import React from "react"
import "./TabButton.css"

export function TabButton({
	onClick,
	children,
	selected,
}: {
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
	children?: React.ReactNode
	selected?: boolean
}) {
	return (
		<button className={selected ? "selected" : undefined} onClick={onClick}>
			{children}
		</button>
	)
}
