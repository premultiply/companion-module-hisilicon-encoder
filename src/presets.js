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

	presets['inputStatus'] = {
		type: 'button',
		category: 'System',
		name: 'Input Status',
		style: {
			text: 'Status \\n$(generic-module:vi_video_status) \\n$(generic-module:ai_audio_status) \\n',
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
				feedbackId: 'inputValid',
				options: {},
				style: {
					color: colorWhite,
					bgcolor: colorGreen,
				},
			},
			{
				feedbackId: 'inputInvalid',
				options: {},
				style: {
					color: colorWhite,
					bgcolor: colorRed,
				},
			},
		],
	}

	presets['inputFormat'] = {
		type: 'button',
		category: 'System',
		name: 'Input Format',
		style: {
			text: 'Input \\n$(generic-module:vi_mode) \\n$(generic-module:ai_samplerate) Hz \\n',
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
				feedbackId: 'inputValid',
				options: {},
				style: {
					color: colorWhite,
					bgcolor: colorGreen,
				},
			},
			{
				feedbackId: 'inputInvalid',
				options: {},
				style: {
					color: colorWhite,
					bgcolor: colorRed,
				},
			},
		],
	}

	presets['reboot'] = {
		type: 'button',
		category: 'System',
		name: 'Reboot Device (Hold for 2s)',
		style: {
			text: 'REBOOT\\n[Hold 2s]',
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

	self.data.vi.venc.forEach((_, index) => {
		presets[`rtmpConnected_stream${index}`] = {
			type: 'button',
			category: 'System',
			name: `Stream ${index + 1}: RTMP Push connected`,
			style: {
				text: `Stream ${index + 1}\\n\\nRTMP Push\\n\\n$(generic-module:vi_venc${index}_rtmp_status)`,
				size: '7',
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
					feedbackId: `rtmpConnected_stream${index}`,
					options: {},
					style: {
						color: colorWhite,
						bgcolor: colorGreen,
					},
				},
				{
					feedbackId: `rtmpNotConnected_stream${index}`,
					options: {},
					style: {
						color: colorWhite,
						bgcolor: colorRed,
					},
				},
			],
		}

		presets[`srtConnected_stream${index}`] = {
			type: 'button',
			category: 'System',
			name: `Stream ${index + 1}: SRT Caller connected`,
			style: {
				text: `Stream ${index + 1}\\n\\nSRT Caller\\n\\n$(generic-module:vi_venc${index}_srt_status)`,
				size: '7',
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
					feedbackId: `srtConnected_stream${index}`,
					options: {},
					style: {
						color: colorWhite,
						bgcolor: colorGreen,
					},
				},
				{
					feedbackId: `srtNotConnected_stream${index}`,
					options: {},
					style: {
						color: colorWhite,
						bgcolor: colorRed,
					},
				},
			],
		}
	})

	return presets
}
