export enum BrowserViewEvents {
	"browserView" = "browserView",
}

export interface BrowserViewProps {
	x: number
	y: number
	width: number
	height: number
	visible: boolean
}

export interface BrowserViewEventArgs extends BrowserViewProps {
	id: string
	url?: string
	destroy?: true
}
