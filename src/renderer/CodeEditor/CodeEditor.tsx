import React, { useState } from "react"
import MonacoEditor from "react-monaco-editor"
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api"

export function CodeEditor() {
	const [code] = useState("")

	const options: monacoEditor.editor.IStandaloneEditorConstructionOptions = {
		selectOnLineNumbers: true,
		minimap: {
			enabled: false,
		},
	}

	const onChange = (
		newValue: string,
		e: monacoEditor.editor.IModelContentChangedEvent
	) => {
		console.log("onChange", newValue, e)
	}

	const editorDidMount = (
		editor: monacoEditor.editor.IStandaloneCodeEditor,
		monaco: typeof monacoEditor
	) => {
		console.log("editorDidMount", editor, monaco)
	}

	return (
		<MonacoEditor
			width="800"
			height="600"
			language="javascript"
			theme="vs-dark"
			value={code}
			options={options}
			onChange={onChange}
			editorDidMount={editorDidMount}
		/>
	)
}
