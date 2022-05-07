import mdParser from "markdown-dom"

const mdDom = mdParser.parse()
console.log()

// TODO: Parse commands.md and produce a JSON object:
/*

	{
		'KEYWORD': {
			signatures: [
				``
			],
			documentation: ``
			returns?: `TYPE`
		}
	}

*/
