import { languages } from "monaco-editor"
import { SystemSubroutines, SystemFunctions } from "@lamus/qbasic-vm"

export default {
	extensionPoint: {
		id: "qbasic",
		extensions: [".prg", ".qb", ".bas"],
		aliases: ["QB", "PRG", "QBASIC", "BASIC"],
		mimetypes: ["text/basic", "text/qbasic"],
	},
	languageConfiguration(): languages.LanguageConfiguration {
		return {
			wordPattern: /[A-Za-z][\w\$\%\&\#\!]*/,
			comments: {
				lineComment: "' ",
			},
			indentationRules: {
				increaseIndentPattern:
					/^SUB\s.*|^FUNCTION\s.*|^WHILE\s.*|DO$|THEN$|\s*ELSE\s+|^\s*FOR\s.*\sTO\s|^\s*CASE|^\s*TYPE|^(\w)+:$/gi,
				decreaseIndentPattern: /^\s*END\s+|^\s*RETURN|^\s*LOOP\s+$/gi,
			},
		}
	},
	monarchTokensProvider(): languages.IMonarchLanguage {
		// Create your own language definition here
		// You can safely look at other samples without losing modifications.
		// Modifications are not saved on browser refresh/close though -- copy often!
		return {
			// Set defaultToken to invalid to see what you do not tokenize yet
			// defaultToken: 'invalid',

			ignoreCase: true,

			keywords: [
				"AND",
				"AS",
				"CASE",
				"CONST",
				"DATA",
				"DECLARE",
				"DEF",
				"DEFINT",
				"DIM",
				"DO",
				"ELSE",
				"END",
				"EXIT",
				"FOR",
				"FUNCTION",
				"GOSUB",
				"GOTO",
				"IF",
				"INPUT",
				"OUTPUT",
				"BINARY",
				"RANDOM",
				"APPEND",
				"LINE",
				"LOOP",
				"MOD",
				"NEXT",
				"NOT",
				"POKE",
				"ON",
				"OFF",
				"EVENT",
				"PRINT",
				"RESTORE",
				"RETURN",
				"SEG",
				"SELECT",
				"SHARED",
				"STATIC",
				"STEP",
				"SUB",
				"TAB",
				"THEN",
				"TO",
				"TYPE",
				"UNTIL",
				"USING",
				"VIEW",
				"WEND",
				"WHILE",
				"OPEN",
				"CLOSE",
				"WRITE",

				...Object.keys(SystemSubroutines).filter(
					(value) => value !== "print_using"
				),
				...Object.keys(SystemFunctions),
			],

			typeKeywords: ["STRING", "INTEGER", "LONG", "DOUBLE", "SINGLE", "JSON"],

			operators: [
				"IMP",
				"EQV",
				"XOR",
				"OR",
				"AND",
				"=",
				"<>",
				">",
				"<",
				"<<",
				">>",
				"<=",
				">=",
				"MOD",
				"^",
			],

			// we include these common regular expressions
			symbols: /[=><~?:|+\-*\/\^]+/,

			// C# style strings
			escapes:
				/\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

			// The main tokenizer for our languages
			tokenizer: {
				root: [
					// identify REM comments early
					[/REM\s.*$/, "comment"],

					// labels
					[/^[a-z_]*:/, "label"],

					// identifiers and keywords
					[
						/[a-z_][\w\$\%\&\#\!]*/,
						{
							cases: {
								"@typeKeywords": "keyword",
								"@keywords": "keyword",
								"@default": "identifier",
							},
							log: "identifier: $0",
						},
					],
					[/[a-z][\w]*/, "type.identifier"], // to show class names nicely

					// whitespace
					{ include: "@whitespace" },

					// delimiters and operators
					[/[{}()\[\]]/, "@brackets"],
					[/[<>](?!@symbols)/, "@brackets"],
					[
						/@symbols/,
						{
							cases: {
								"@operators": "operator",
								"@default": "",
							},
						},
					],

					// @ annotations.
					// As an example, we emit a debugging log message on these tokens.
					// Note: message are supressed during the first load -- change some lines to see them.
					[
						/@\s*[a-zA-Z_\$][\w\$]*/,
						{ token: "annotation", log: "annotation token: $0" },
					],

					// numbers
					[/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
					// [/0[xX][0-9a-fA-F]+/, 'number.hex'],
					[/\d+/, "number"],

					// delimiter: after number because of .\d floats
					[/[;,.]/, "delimiter"],

					// strings
					[/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
					[/"/, { token: "string.quote", bracket: "@open", next: "@string" }],

					// characters
					// [/'[^\\']'/, 'string'],
					// [/(')(@escapes)(')/, ['string','string.escape','string']],
					// [/'/, 'string.invalid']
				],

				comment: [
					// [/[^\/*]+/, 'comment' ],
					// [/\/\*/,    'comment', '@push' ],    // nested comment
					// ["\\*/",    'comment', '@pop'  ],
					// [/[\/*]/,   'comment' ]
					[/'.*$/, "comment"],
				],

				string: [
					[/[^\\"]+/, "string"],
					[/@escapes/, "string.escape"],
					[/\\./, "string.escape.invalid"],
					[/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
				],

				whitespace: [
					[/[ \t\r\n]+/, "white"],
					[/'.*$/, "comment"],
				],
			},
		}
	},
	completionItemProvider(): languages.CompletionItemProvider {
		const keywords = this.monarchTokensProvider().keywords
		const typeKeywords = this.monarchTokensProvider().typeKeywords

		const allKeywords: string[] = [...keywords, ...typeKeywords]

		return {
			provideCompletionItems(model, position, context, token) {
				const wordAtCursor = model.getWordAtPosition(position)
				if (!wordAtCursor) return

				const suggestions: languages.CompletionItem[] = allKeywords.map(
					(keyword) => ({
						label: keyword,
						insertText: keyword,
						kind: languages.CompletionItemKind.Keyword,
						range: {
							startLineNumber: position.lineNumber,
							endLineNumber: position.lineNumber,
							startColumn: wordAtCursor.startColumn,
							endColumn: wordAtCursor.endColumn,
						},
					})
				)

				return {
					suggestions,
				}
			},
		}
	},
}
