import * as Comlink from "comlink"

class QBasicAnalyzer {
	private program: string
	private line: string

	setProgram(program: string) {
		this.program = program
	}
	setLine(line: string) {
		this.line = line
	}
	getErrors(): {
		locus: {
			line: number
			column: number
		},
		type: string
		message: string
	}[] {
		return[]
	}
}

Comlink.expose(QBasicAnalyzer)