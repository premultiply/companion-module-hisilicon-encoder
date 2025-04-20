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
		{ variableId: 'ai_audio_status', name: 'Audio Input: Status' },
		{ variableId: 'vi_framerate', name: 'Video Input: Frame Rate (Hz)' },
		{ variableId: 'vi_int_cnt', name: 'Video Input: Interrupt Count' },
		{ variableId: 'vi_lost_int', name: 'Video Input: Lost Interrupts' },
		{ variableId: 'vi_width', name: 'Video Input: Width' },
		{ variableId: 'vi_height', name: 'Video Input: Height' },
		{ variableId: 'vi_interlaced', name: 'Video Input: Interlaced' },
		{ variableId: 'vi_video_status', name: 'Video Input: Status' },
		{ variableId: 'vi_mode', name: 'Video Input: Mode' },
		{ variableId: 'vi_venc0_codec', name: 'Video Encoder 1: Codec' },
		{ variableId: 'vi_venc0_bitrate', name: 'Video Encoder 1: Bitrate' },
		{ variableId: 'vi_venc0_rtmp_status', name: 'Video Encoder 1: RTMP Push Status' },
		{ variableId: 'vi_venc0_srt_status', name: 'Video Encoder 1: SRT Caller Status' },
		{ variableId: 'vi_venc1_codec', name: 'Video Encoder 2: Codec' },
		{ variableId: 'vi_venc1_bitrate', name: 'Video Encoder 2: Bitrate' },
		{ variableId: 'vi_venc1_rtmp_status', name: 'Video Encoder 2: RTMP Push Status' },
		{ variableId: 'vi_venc1_srt_status', name: 'Video Encoder 2: SRT Caller Status' },
		{ variableId: 'vi_venc2_codec', name: 'Video Encoder 3: Codec' },
		{ variableId: 'vi_venc2_bitrate', name: 'Video Encoder 3: Bitrate' },
		{ variableId: 'vi_venc2_rtmp_status', name: 'Video Encoder 3: RTMP Push Status' },
		{ variableId: 'vi_venc2_srt_status', name: 'Video Encoder 3: SRT Caller Status' },
		{ variableId: 'vi_venc3_codec', name: 'Video Encoder 4: Codec' },
		{ variableId: 'vi_venc3_bitrate', name: 'Video Encoder 4: Bitrate' },
		{ variableId: 'vi_venc3_rtmp_status', name: 'Video Encoder 4: RTMP Push Status' },
		{ variableId: 'vi_venc3_srt_status', name: 'Video Encoder 4: SRT Caller Status' },
		{ variableId: 'user_ts', name: 'Active Users: MPEG-TS' },
		{ variableId: 'user_flv', name: 'Active Users: FLV' },
		{ variableId: 'user_pri', name: 'Active Users: PRI' },
		{ variableId: 'user_web', name: 'Active Users: Web' },
		{ variableId: 'user_rtsp', name: 'Active Users: RTSP' },
	]

	return variables
}
export function checkVariables(self) {
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
		ai_samplerate:
			self.data.aitick > 0 ? (self.data.ai.samplerate ? self.data.ai.samplerate : self.data.aisamplerate) : '-',
		ai_audio_status: translateInputStatus(self.data.ai.audio_ok),
		vi_framerate: self.data.vi.framerate,
		vi_int_cnt: self.data.vi.int_cnt,
		vi_lost_int: self.data.vi.lost_int,
		vi_width: self.data.vi.width,
		vi_height: self.data.vi.height,
		vi_interlaced: !!self.data.vi.interlaced,
		vi_video_status: translateInputStatus(self.data.vi.video_ok),
		vi_mode:
			self.data.vi.framerate > 0
				? self.data.vi.height + (self.data.vi.interlaced ? 'i' : 'p') + self.data.vi.framerate
				: '---',
		vi_venc0_codec: translateCodec(self.data.vi.venc[0].codec),
		vi_venc0_bitrate: self.data.vi.venc[0].bitrate,
		vi_venc0_rtmp_status: translateStreamStatus(self.data.vi.venc[0].rtmp_status),
		vi_venc0_srt_status: translateStreamStatus(self.data.vi.venc[0].srt_publish_status),
		vi_venc1_codec: translateCodec(self.data.vi.venc[1].codec),
		vi_venc1_bitrate: self.data.vi.venc[1].bitrate,
		vi_venc1_rtmp_status: translateStreamStatus(self.data.vi.venc[1].rtmp_status),
		vi_venc1_srt_status: translateStreamStatus(self.data.vi.venc[1].srt_publish_status),
		vi_venc2_codec: translateCodec(self.data.vi.venc[2].codec),
		vi_venc2_bitrate: self.data.vi.venc[2].bitrate,
		vi_venc2_rtmp_status: translateStreamStatus(self.data.vi.venc[2].rtmp_status),
		vi_venc2_srt_status: translateStreamStatus(self.data.vi.venc[2].srt_publish_status),
		vi_venc3_codec: translateCodec(self.data.vi.venc[3].codec),
		vi_venc3_bitrate: self.data.vi.venc[3].bitrate,
		vi_venc3_rtmp_status: translateStreamStatus(self.data.vi.venc[3].rtmp_status),
		vi_venc3_srt_status: translateStreamStatus(self.data.vi.venc[3].srt_publish_status),
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
			return 'H.264'
		case 265:
			return 'H.265'
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

function translateInputStatus(status) {
	switch (status) {
		case 0:
			return 'No Signal'
		case 1:
			return 'OK'
		default:
			return 'unknown'
	}
}
