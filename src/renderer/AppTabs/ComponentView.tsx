import React from "react"

export const ComponentView: React.FC<{
	visible: boolean
	className?: string
	component: React.FC
}> = function ComponentView({ visible, className, component }) {
	if (!visible) return null
	return <div className={className}>{component({})}</div>
}
