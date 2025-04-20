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

	feedbacks.inputValid = {
		type: 'boolean',
		name: 'Input Signal valid',
		description: 'Indicates whether a valid input signal has been detected and locked',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorGreen,
		},
		options: [],
		callback: function () {
			return (
				self.data.vi.video_ok !== 0 && self.data.ai.audio_ok !== 0 && self.data.vi.framerate > 0 && self.data.aitick > 0
			)
		},
	}

	feedbacks.inputInvalid = {
		type: 'boolean',
		name: 'Input Signal invalid',
		description: 'Indicates whether there is a problem with the input signal',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorRed,
		},
		options: [],
		callback: function () {
			return (
				self.data.vi.video_ok === 0 ||
				self.data.ai.audio_ok === 0 ||
				self.data.vi.framerate === 0 ||
				self.data.aitick === 0
			)
		},
	}

	self.data.vi.venc.forEach((item, index) => {
		feedbacks[`rtmpConnected_stream${index}`] = {
			type: 'boolean',
			name: `Stream ${index + 1}: RTMP Push connected`,
			description: `Indicates whether the RTMP Push connection for Stream ${index + 1} is established`,
			defaultStyle: {
				color: colorWhite,
				bgcolor: colorGreen,
			},
			options: [],
			callback: function () {
				return item.rtmp_status === 0
			},
		}

		feedbacks[`rtmpNotConnected_stream${index}`] = {
			type: 'boolean',
			name: `Stream ${index + 1}: RTMP Push not connected`,
			description: `Indicates whether the RTMP Push connection for Stream ${index + 1} is not established`,
			defaultStyle: {
				color: colorWhite,
				bgcolor: colorRed,
			},
			options: [],
			callback: function () {
				return item.rtmp_status === -1
			},
		}

		feedbacks[`srtConnected_stream${index}`] = {
			type: 'boolean',
			name: `Stream ${index + 1}: SRT Caller connected`,
			description: `Indicates whether the SRT Caller connection for Stream ${index + 1} is established`,
			defaultStyle: {
				color: colorWhite,
				bgcolor: colorGreen,
			},
			options: [],
			callback: function () {
				return item.srt_publish_status === 0
			},
		}

		feedbacks[`srtNotConnected_stream${index}`] = {
			type: 'boolean',
			name: `Stream ${index + 1}: SRT Caller not connected`,
			description: `Indicates whether the SRT Caller connection for Stream ${index + 1} is not established`,
			defaultStyle: {
				color: colorWhite,
				bgcolor: colorRed,
			},
			options: [],
			callback: function () {
				return item.srt_publish_status === -1
			},
		}
	})

	return feedbacks
}
