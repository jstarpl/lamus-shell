import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react"
import { ipcRenderer } from "electron"
import { literal } from "_/lib/utils"
import {
	BrowserViewEventArgs,
	BrowserViewEvents,
} from "_/lib/BrowserViewEventArgs"

interface IProps {
	url: string
	className?: string
	visible?: boolean
	onChange?: (url: string) => void
}

export function BrowserView({ url, visible, className }: IProps) {
	const id = useRef(Math.floor(Date.now() * Math.random()))
	const [location, setLocation] = useState({ x: 0, y: 0 })
	const ref = useRef<HTMLDivElement>(null)

	const onResize = useCallback(
		(entries: ResizeObserverEntry[]) => {
			ipcRenderer.send(
				BrowserViewEvents.browserView,
				literal<BrowserViewEventArgs>({
					id: String(id.current),
					x: location.x + entries[0].contentRect.x,
					y: location.y + entries[0].contentRect.y,
					height: entries[0].contentRect.height || 300,
					width: entries[0].contentRect.width || 300,
					visible: visible ?? true,
					url,
				})
			)
		},
		[location, visible, url]
	)

	useLayoutEffect(() => {
		if (ref.current) {
			const resizeObserver = new ResizeObserver(onResize)
			resizeObserver.observe(ref.current)

			return () => {
				resizeObserver.disconnect()
			}
		}
	}, [ref.current, location, onResize])

	const onWindowResize = () => {
		if (ref.current) {
			const clientRects = ref.current.getClientRects()

			setLocation({
				x: clientRects[0].x ?? 0,
				y: clientRects[0].y ?? 0,
			})
		}
	}

	useLayoutEffect(onWindowResize, [ref.current])

	useEffect(() => {
		window.addEventListener("resize", onWindowResize)

		return () => {
			window.removeEventListener("resize", onWindowResize)
		}
	}, [])

	useEffect(() => {
		return () => {
			ipcRenderer.send(
				BrowserViewEvents.browserView,
				literal<BrowserViewEventArgs>({
					id: String(id.current),
					x: location.x,
					y: location.y,
					height: 300,
					width: 300,
					visible: false,
					destroy: true,
				})
			)
		}
	}, [])

	return <div className={className} ref={ref}></div>
}
