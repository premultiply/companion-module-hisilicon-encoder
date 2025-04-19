import { combineRgb } from '@companion-module/base'

export function setFeedbacks(self) {
	const feedbacks = {}

	const colorWhite = combineRgb(255, 255, 255)
	const colorRed = combineRgb(255, 0, 0)
	const colorGreen = combineRgb(0, 204, 0)
	const colorOrange = combineRgb(255, 102, 0)
	const colorBlue = combineRgb(0, 51, 204)
	const colorGrey = combineRgb(51, 51, 51)
	const colorPurple = combineRgb(255, 0, 255)
	const colorBlack = combineRgb(0, 0, 0)

	feedbacks.inputOK = {
		type: 'boolean',
		name: 'Input Signal OK',
		description: 'Indicate if a valid input signal is detected and locked',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorGreen,
		},
		options: [],
		callback: function () {
			return !!self.data.vi.video_ok && !!self.data.ai.audio_ok
		},
	}

	return feedbacks
}
