import { combineRgb } from '@companion-module/base'

export function setPresets(self) {
	var presets = []

	const colorWhite = combineRgb(255, 255, 255)
	const colorRed = combineRgb(255, 0, 0)
	const colorGreen = combineRgb(0, 204, 0)
	const colorOrange = combineRgb(255, 102, 0)
	const colorBlue = combineRgb(0, 51, 204)
	const colorGrey = combineRgb(51, 51, 51)
	const colorPurple = combineRgb(255, 0, 255)
	const colorBlack = combineRgb(0, 0, 0)

	presets['inputSignalFormat'] = {
		type: 'button',
		category: 'System',
		name: 'Input Signal Format',
		style: {
			text: 'Input \\n$(generic-mpdule:vi_mode) \\n$(generic-mpdule:ai_samplerate) Hz \\n',
			size: '14',
			alignment: 'right:center',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'inputOK',
				options: {},
				style: {
					color: colorWhite,
					bgcolor: colorGreen,
				},
			},
		],
	}

	presets['reboot'] = {
		type: 'button',
		category: 'System',
		name: 'Reboot Device (Hold for 2s)',
		style: {
			text: 'Reboot',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		options: {
			relativeDelay: false,
		},
		steps: [
			{
				down: [],
				up: [],
				2000: {
					options: { runWhileHeld: true },
					actions: [
						{
							actionId: 'reboot',
							options: {},
						},
					],
				},
			},
		],
		feedbacks: [],
	}

	return presets
}
