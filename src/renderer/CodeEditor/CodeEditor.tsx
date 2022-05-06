import React, { useEffect, useRef, useState } from "react"
import Editor, { loader, useMonaco } from "@monaco-editor/react"
import * as monaco from "monaco-editor"
import qbasic from "_/language/LamusQBasic"

loader.config({ monaco })

export function CodeEditor() {
	const [code] = useState("")
	const disposables = useRef<monaco.IDisposable[]>([])

	const monaco = useMonaco()

	function registerDisposable(disposable: monaco.IDisposable): void {
		disposables.current.push(disposable)
	}

	useEffect(() => {
		if (!monaco) return
		console.log("monaco effect")

		monaco.languages.register(qbasic.extensionPoint)
		monaco.languages.onLanguage("qbasic", () => {
			console.log("onLanguage")
			registerDisposable(
				monaco.languages.setMonarchTokensProvider(
					"qbasic",
					qbasic.monarchTokensProvider()
				)
			)
			registerDisposable(
				monaco.languages.setLanguageConfiguration(
					"qbasic",
					qbasic.languageConfiguration()
				)
			)
			registerDisposable(
				monaco.languages.registerCompletionItemProvider(
					"qbasic",
					qbasic.completionItemProvider()
				)
			)
		})
	}, [monaco])

	const options: monaco.editor.IStandaloneEditorConstructionOptions = {
		selectOnLineNumbers: true,
		minimap: {
			enabled: false,
		},
		language: "qbasic",
		autoIndent: "full",
	}

	const onChange = (
		newValue: string,
		e: monaco.editor.IModelContentChangedEvent
	) => {
		console.log("onChange", newValue, e)
	}

	const onMount = (e: monaco.editor.IStandaloneCodeEditor) => {
		console.log("onMount")
		if (!monaco) return
		const model = e.getModel()
		if (!model) return
		console.log("onMount set model language")
		monaco.editor.setModelLanguage(model, "qbasic")
		model.updateOptions({
			trimAutoWhitespace: true,
		})
		console.log(monaco.languages.getLanguages())
	}

	useEffect(() => {
		return () => {
			disposables.current.forEach((disposable) => disposable.dispose())
		}
	}, [])

	// start up web worker
	useEffect(() => {
		const worker = new Worker("./qbasic.worker.bundle.js", {
			name: "QBasic Language Service",
		})
		worker.addEventListener("message", (e) => {
			console.log(e)
		})
		worker.postMessage("Ping")

		return () => {
			worker.terminate()
		}
	}, [])

	return (
		<Editor
			className=""
			width="100%"
			height="100%"
			theme="vs-dark"
			value={code}
			options={options}
			onChange={onChange}
			onMount={onMount}
		/>
	)
}
