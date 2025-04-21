export function setVariables(self) {
	const variables = [
		{ variableId: 'version', name: 'Version' },
		{ variableId: 'runtime', name: 'Runtime' },
		{ variableId: 'systime', name: 'System Time' },
		{ variableId: 'buildtime', name: 'Build Time' },
		{ variableId: 'cpuinfo', name: 'CPU Info' },
		{ variableId: 'vga_input', name: 'VGA Input' },
		{ variableId: 'sdi_input', name: 'SDI Input' },
		{ variableId: 'cpuusage', name: 'CPU Usage (%)' },
		{ variableId: 'memoryfree', name: 'Memory Free (kB)' },
		{ variableId: 'memorytotal', name: 'Memory Total (kB)' },
		{ variableId: 'net_packet_sent', name: 'Network Packets Sent' },
		{ variableId: 'net_packet_dropped', name: 'Network Packets Dropped' },
		{ variableId: 'ai_samplerate', name: 'Audio Input: Sample Rate (Hz)' },
		{ variableId: 'ai_status', name: 'Audio Input: Status' },
		{ variableId: 'ai_format', name: 'Audio Input: Format' },
		{ variableId: 'vi_framerate', name: 'Video Input: Frame Rate (Hz)' },
		{ variableId: 'vi_int_cnt', name: 'Video Input: Interrupt Count' },
		{ variableId: 'vi_lost_int', name: 'Video Input: Lost Interrupts' },
		{ variableId: 'vi_width', name: 'Video Input: Width' },
		{ variableId: 'vi_height', name: 'Video Input: Height' },
		{ variableId: 'vi_interlaced', name: 'Video Input: Interlaced' },
		{ variableId: 'vi_status', name: 'Video Input: Status' },
		{ variableId: 'vi_mode', name: 'Video Input: Mode' },
		{ variableId: 'vi_format', name: 'Video Input: Format' },
		{ variableId: 'stream0_codec', name: 'Stream 1: Codec' },
		{ variableId: 'stream0_format', name: 'Stream 1: Format' },
		{ variableId: 'stream0_bitrate', name: 'Stream 1: Bitrate' },
		{ variableId: 'stream0_rtmp_status', name: 'Stream 1: RTMP Push Status' },
		{ variableId: 'stream0_srt_status', name: 'Stream 1: SRT Caller Status' },
		{ variableId: 'stream0_hls_status', name: 'Stream 1: HLS Push Status' },
		{ variableId: 'stream1_codec', name: 'Stream 2: Codec' },
		{ variableId: 'stream1_format', name: 'Stream 2: Format' },
		{ variableId: 'stream1_bitrate', name: 'Stream 2: Bitrate' },
		{ variableId: 'stream1_rtmp_status', name: 'Stream 2: RTMP Push Status' },
		{ variableId: 'stream1_srt_status', name: 'Stream 2: SRT Caller Status' },
		{ variableId: 'stream1_hls_status', name: 'Stream 2: HLS Push Status' },
		{ variableId: 'stream2_codec', name: 'Stream 3: Codec' },
		{ variableId: 'stream2_format', name: 'Stream 3: Format' },
		{ variableId: 'stream2_bitrate', name: 'Stream 3: Bitrate' },
		{ variableId: 'stream2_rtmp_status', name: 'Stream 3: RTMP Push Status' },
		{ variableId: 'stream2_srt_status', name: 'Stream 3: SRT Caller Status' },
		{ variableId: 'stream2_hls_status', name: 'Stream 3: HLS Push Status' },
		{ variableId: 'stream3_codec', name: 'Stream 4: Codec' },
		{ variableId: 'stream3_format', name: 'Stream 4: Format' },
		{ variableId: 'stream3_bitrate', name: 'Stream 4: Bitrate' },
		{ variableId: 'stream3_rtmp_status', name: 'Stream 4: RTMP Push Status' },
		{ variableId: 'stream3_srt_status', name: 'Stream 4: SRT Caller Status' },
		{ variableId: 'stream3_hls_status', name: 'Stream 4: HLS Push Status' },
		{ variableId: 'user_ts', name: 'Active Users: MPEG-TS' },
		{ variableId: 'user_flv', name: 'Active Users: FLV' },
		{ variableId: 'user_pri', name: 'Active Users: PRI' },
		{ variableId: 'user_web', name: 'Active Users: Web' },
		{ variableId: 'user_rtsp', name: 'Active Users: RTSP' },
	]

	return variables
}
export function checkVariables(self) {
	const aiValid = self.data.aitick > 0 && self.data.ai.audio_ok !== 0
	const viValid = self.data.vi.framerate > 0 && self.data.vi.video_ok !== 0
	const aiSamplerate = self.data.ai.samplerate || self.data.aisamplerate

	self.setVariableValues({
		version: self.data.version,
		runtime: self.data.runtime,
		systime: self.data.systime,
		buildtime: self.data.buildtime,
		cpuinfo: self.data.cpuinfo,
		vga_input: !!self.data.vga_input,
		sdi_input: !!self.data.sdi_input,
		cpuusage: self.data.cpuusage,
		memoryfree: self.data.memoryfree,
		memorytotal: self.data.memorytotal,
		net_packet_sent: self.data.net_packet_sent,
		net_packet_dropped: self.data.net_packet_dropped,
		ai_samplerate: aiValid ? aiSamplerate : null,
		ai_status: aiValid,
		ai_format: aiValid ? `${aiSamplerate} Hz` : 'No Signal',
		vi_framerate: self.data.vi.framerate,
		vi_int_cnt: self.data.vi.int_cnt,
		vi_lost_int: self.data.vi.lost_int,
		vi_width: self.data.vi.width,
		vi_height: self.data.vi.height,
		vi_interlaced: !!self.data.vi.interlaced,
		vi_status: viValid,
		vi_mode: viValid ? self.data.vi.height + (self.data.vi.interlaced ? 'i' : 'p') + self.data.vi.framerate : null,
		vi_format: viValid
			? `${self.data.vi.width}x${self.data.vi.height}@${self.data.vi.framerate}${self.data.vi.interlaced ? 'i' : 'p'}`
			: 'No Signal',
		stream0_codec: translateCodec(self.data.vi.venc[0].codec),
		stream0_format: `${self.data.vi.venc[0].width}x${self.data.vi.venc[0].height}@${self.data.vi.venc[0].framerate}`,
		stream0_bitrate: self.data.vi.venc[0].bitrate,
		stream0_rtmp_status: translateStreamStatus(self.data.vi.venc[0].rtmp_status),
		stream0_srt_status: translateStreamStatus(self.data.vi.venc[0].srt_publish_status),
		stream0_hls_status: translateStreamStatus(self.data.vi.venc[0].hls_publish_status),
		stream1_codec: translateCodec(self.data.vi.venc[1].codec),
		stream1_format: `${self.data.vi.venc[1].width}x${self.data.vi.venc[1].height}@${self.data.vi.venc[1].framerate}`,
		stream1_bitrate: self.data.vi.venc[1].bitrate,
		stream1_rtmp_status: translateStreamStatus(self.data.vi.venc[1].rtmp_status),
		stream1_srt_status: translateStreamStatus(self.data.vi.venc[1].srt_publish_status),
		stream1_hls_status: translateStreamStatus(self.data.vi.venc[1].hls_publish_status),
		stream2_codec: translateCodec(self.data.vi.venc[2].codec),
		stream2_format: `${self.data.vi.venc[2].width}x${self.data.vi.venc[2].height}@${self.data.vi.venc[2].framerate}`,
		stream2_bitrate: self.data.vi.venc[2].bitrate,
		stream2_rtmp_status: translateStreamStatus(self.data.vi.venc[2].rtmp_status),
		stream2_srt_status: translateStreamStatus(self.data.vi.venc[2].srt_publish_status),
		stream2_hls_status: translateStreamStatus(self.data.vi.venc[2].hls_publish_status),
		stream3_codec: translateCodec(self.data.vi.venc[3].codec),
		stream3_format: `${self.data.vi.venc[3].width}x${self.data.vi.venc[3].height}@${self.data.vi.venc[3].framerate}`,
		stream3_bitrate: self.data.vi.venc[3].bitrate,
		stream3_rtmp_status: translateStreamStatus(self.data.vi.venc[3].rtmp_status),
		stream3_srt_status: translateStreamStatus(self.data.vi.venc[3].srt_publish_status),
		stream3_hls_status: translateStreamStatus(self.data.vi.venc[3].hls_publish_status),
		user_ts: self.data.user.ts0,
		user_flv: self.data.user.flv0,
		user_pri: self.data.user.pri0,
		user_web: self.data.user.web,
		user_rtsp: self.data.user.rtsp,
	})
}

function translateCodec(codec) {
	switch (codec) {
		case 96:
			return 'H.264/AVC'
		case 265:
			return 'H.265/HEVC'
		case 1002:
			return 'MJPEG'
		default:
			return 'unknown'
	}
}

function translateStreamStatus(status) {
	switch (status) {
		case -1:
			return 'not connected'
		case 0:
			return 'connected'
		default:
			return 'disabled'
	}
}
