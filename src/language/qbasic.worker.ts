import { QBasicProgram } from '@lamus/qbasic-vm'

self.addEventListener('message', (e) => {
	const program = new QBasicProgram(e.data, true)
})
