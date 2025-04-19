import { Regex } from '@companion-module/base'

export const ConfigFields = [
	{
		type: 'textinput',
		id: 'host',
		label: 'IP address / Hostname',
		width: 5,
	},
	{
		type: 'number',
		id: 'port',
		label: 'API port (default: 80)',
		width: 4,
		default: 80,
		regex: Regex.PORT,
	},
]
