export function setActions(self) {
	const actions = {}

	actions.reboot = {
		name: 'Reboot',
		description: 'Reboots the device without any further confirmation',
		options: [],
		callback: async (action) => {
			await self.sendCommand('reboot')
		},
	}

	return actions
}
