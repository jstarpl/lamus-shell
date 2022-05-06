import React, { useLayoutEffect, useRef } from "react"
import {
	Console,
	AudioDevice,
	NetworkAdapter,
	LocalStorageFileSystem,
	GeneralIORouter,
	DebugConsole,
	VirtualMachine,
} from "@lamus/qbasic-vm"
import "./App.css"

export function App() {
	const targetEl = useRef<HTMLDivElement>(null)
	const debugConsole = useRef<HTMLTextAreaElement>(null)

	useLayoutEffect(() => {
		if (!targetEl.current || !debugConsole.current) return

		console.log("Runtime initialized")

		const cons = new Console(targetEl.current, undefined, 320, 600, "public/")
		const audio = new AudioDevice()
		const network = new NetworkAdapter()
		const fileSystem = new LocalStorageFileSystem()
		const generalIORouter = new GeneralIORouter()
		const virtualMachine = new VirtualMachine(
			cons,
			audio,
			network,
			fileSystem,
			generalIORouter
		)
		const dbg = new DebugConsole(debugConsole.current)
		console.log(virtualMachine, dbg)

		return () => {
			console.log("Runtime destroyed")
		}
	}, [targetEl.current, debugConsole.current])

	return (
		<>
			<div ref={targetEl}></div>
			<textarea ref={debugConsole}></textarea>
		</>
	)
}
