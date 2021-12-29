import { BrowserView, BrowserWindow, ipcMain } from "electron"
import {
	BrowserViewEventArgs,
	BrowserViewEvents,
} from "_/lib/BrowserViewEventArgs"

interface IWrappedBrowserView {
	view: BrowserView | null
	visible: boolean
}

function applyBrowserViewProperties(
	wrappedView: IWrappedBrowserView,
	props: BrowserViewEventArgs,
	win: BrowserWindow
) {
	if (wrappedView.view === null) {
		throw new Error("BrowserView uninitialized")
	}

	if (props.visible && !wrappedView.visible) {
		win.addBrowserView(wrappedView.view)
		wrappedView.visible = true
	} else if (!props.visible && wrappedView.visible) {
		win.removeBrowserView(wrappedView.view)
		wrappedView.visible = false
	}

	if (wrappedView.visible) {
		wrappedView.view.setBounds({
			height: Math.floor(props.height),
			width: Math.floor(props.width),
			x: Math.floor(props.x),
			y: Math.floor(props.y),
		})
	}
}

function destroyBrowserView(
	wrappedView: IWrappedBrowserView,
	win: BrowserWindow
) {
	if (wrappedView.view === null) {
		throw new Error("BrowserView uninitialized")
	}

	if (wrappedView.visible) {
		win.removeBrowserView(wrappedView.view)
	}
	wrappedView.view = null
}

export function browserViewManager(win: BrowserWindow) {
	const browserViews: Record<string, IWrappedBrowserView> = {}

	ipcMain.on(
		BrowserViewEvents.browserView,
		(_e, args: BrowserViewEventArgs) => {
			if (!args.id) {
				return
			}

			if (browserViews[args.id]) {
				if (args.destroy) {
					destroyBrowserView(browserViews[args.id], win)
					delete browserViews[args.id]
					return
				}

				applyBrowserViewProperties(browserViews[args.id], args, win)
			} else if (args.url && !args.destroy) {
				const view = {
					view: new BrowserView({
						webPreferences: {
							contextIsolation: true,
							enableRemoteModule: false,
							experimentalFeatures: true,
							navigateOnDragDrop: false,
							nodeIntegration: false,
							nativeWindowOpen: false,
							webSecurity: true,
						},
					}),
					visible: false,
				}
				browserViews[args.id] = view
				applyBrowserViewProperties(view, args, win)
				view.view.webContents.loadURL(args.url).catch((e) => {
					console.error(`Failed to load url: ${args.url}`, e)
				})
			}
		}
	)
}
