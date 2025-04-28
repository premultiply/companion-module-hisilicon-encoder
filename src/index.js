import { InstanceBase, InstanceStatus, runEntrypoint } from '@companion-module/base'

import { setVariables, checkVariables } from './variables.js'
import { setActions } from './actions.js'
import { setFeedbacks } from './feedbacks.js'
import { setPresets } from './presets.js'
import { ConfigFields } from './config.js'

import { XMLParser } from 'fast-xml-parser'
import { DigestClient } from 'digest-fetch'

class NeworangeEncoderInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		this.pollID = null
	}

	async init(config) {
		this.data = this.emptyCache()

		this.config = config

		this.init_variables()
		this.init_actions()
		this.init_feedbacks()
		this.init_presets()

		this.checkVariables()

		this.client = new DigestClient('admin', 'admin')
		this.parser = new XMLParser()
		this.controller = new AbortController()

		this.updateStatus(InstanceStatus.Connecting)

		this.enablePolling()
	}

	// Cleanup when the module gets deleted or disabled.
	async destroy() {
		this.disablePolling()
		this.controller.abort()
		this.updateStatus(InstanceStatus.Disconnected)
	}

	// Update module after a config change
	async configUpdated(config) {
		this.disablePolling()
		this.controller.abort()
		this.updateStatus(InstanceStatus.Disconnected, 'Config changed')

		this.init(config)
	}

	enablePolling() {
		clearInterval(this.pollID)
		this.pollID = setInterval(() => this.pullData(), 1000)
		this.log('debug', 'Polling enabled with 1s interval')
	}

	disablePolling() {
		clearInterval(this.pollID)
		this.pollID = null
		this.log('debug', 'Polling disabled')
	}

	emptyCache() {
		return {
			version: null,
			runtime: null,
			systime: null,
			buildtime: null,
			cpuinfo: null,
			vga_input: null,
			sdi_input: null,
			cpuusage: null,
			memoryfree: null,
			memorytotal: null,
			net_packet_sent: null,
			net_packet_dropped: null,
			aisamplerate: null,
			aitick: null,
			ai: {
				samplerate: null,
				audio_ok: null,
			},
			vi: {
				framerate: null,
				int_cnt: null,
				lost_int: null,
				width: null,
				height: null,
				interlaced: null,
				video_ok: null,
				venc: Array.from({ length: 4 }, () => ({
					no_use: null,
					bitrate: null,
					codec: null,
					width: null,
					height: null,
					framerate: null,
					rtmp_status: null,
					srt_publish_status: null,
					hls_publish_status: null,
				})),
			},
			user: {
				ts0: null,
				flv0: null,
				pri0: null,
				web: null,
				rtsp: null,
			},
		}
	}

	async sendCommand(cmd) {
		this.log('debug', 'sendCommand()')

		const t = AbortSignal.timeout(5000)

		const options = {
			signal: AbortSignal.any([t, this.controller.signal]),
		}

		const start = Date.now()
		try {
			await this.getAPI(cmd, options)

			this.updateStatus(InstanceStatus.Ok)
		} catch (error) {
			switch (error.name) {
				case 'TimeoutError':
					this.updateStatus(
						InstanceStatus.ConnectionFailure,
						'Timeout - Check configuration and connection to the device',
					)
					this.data = this.emptyCache()
				case 'AbortError':
					break
				default:
					this.log('error', String(error))
			}
		} finally {
			const dt = Date.now() - start
			this.log('debug', `...returned after ${dt}ms.`)

			this.checkVariables()
			this.checkFeedbacks()
		}
	}

	async pullData() {
		this.log('debug', 'pullData()')

		const t = AbortSignal.timeout(950)

		const options = {
			signal: AbortSignal.any([t, this.controller.signal]),
		}

		const start = Date.now()
		try {
			await this.getAPI('get_status', options)

			this.updateStatus(InstanceStatus.Ok)
		} catch (error) {
			switch (error.name) {
				case 'TimeoutError':
					this.updateStatus(
						InstanceStatus.ConnectionFailure,
						'Timeout - Check configuration and connection to the controller',
					)
					this.data = this.emptyCache()
				case 'AbortError':
					break
				default:
					this.log('error', String(error))
			}
		} finally {
			const dt = Date.now() - start
			this.log('debug', `...returned after ${dt}ms.`)

			this.checkVariables()
			this.checkFeedbacks()
		}
	}

	async getAPI(cmd, options) {
		const url = `http://${this.config.host}:${this.config.port}/${cmd}`
		this.log('debug', 'GET ' + url)

		const response = await this.client.fetch(url, options)
		if (!response.ok) throw new Error(`HTTP error: ${response.status} ${response.statusText}`)

		const xmlobj = this.parser.parse(await response.text())

		const status = xmlobj.status ?? null

		this.data.version = status.version ?? null
		this.data.runtime = status.runtime ?? null
		this.data.systime = status.systime ?? null
		this.data.buildtime = status.buildtime ?? null
		this.data.cpuinfo = status.cpuinfo ?? null
		this.data.vga_input = status.vga_input ?? null
		this.data.sdi_input = status.sdi_input ?? null
		this.data.cpuusage = status.cpuusage ?? null
		this.data.memoryfree = status.memoryfree ?? null
		this.data.memorytotal = status.memorytotal ?? null
		this.data.net_packet_sent = status.net_packet_sent ?? null
		this.data.net_packet_dropped = status.net_packet_dropped ?? null
		this.data.aisamplerate = status.aisamplerate ?? null // legacy
		this.data.aitick = status.aitick ?? null // legacy
		this.data.ai.samplerate = status.ai?.samplerate ?? null
		this.data.ai.audio_ok = status.ai?.audio_ok ?? null
		this.data.vi.framerate = status.vi?.framerate ?? null
		this.data.vi.int_cnt = status.vi?.int_cnt ?? null
		this.data.vi.lost_int = status.vi?.lost_int ?? null
		this.data.vi.width = status.vi?.width ?? null
		this.data.vi.height = status.vi?.height ?? null
		this.data.vi.interlaced = status.vi?.interlaced ?? null
		this.data.vi.video_ok = status.vi?.video_ok ?? null
		for (let i = 0; i < 4; i++) {
			this.data.vi.venc[i].no_use = status.vi?.venc[i]?.no_use ?? null
			this.data.vi.venc[i].bitrate = status.vi?.venc[i]?.bitrate ?? null
			this.data.vi.venc[i].codec = status.vi?.venc[i]?.codec ?? null
			this.data.vi.venc[i].width = status.vi?.venc[i]?.width ?? null
			this.data.vi.venc[i].height = status.vi?.venc[i]?.height ?? null
			this.data.vi.venc[i].framerate = status.vi?.venc[i]?.framerate ?? null
			this.data.vi.venc[i].rtmp_status = status.vi?.venc[i]?.rtmp_status ?? null
			this.data.vi.venc[i].srt_publish_status = status.vi?.venc[i]?.srt_publish_status ?? null
			this.data.vi.venc[i].hls_publish_status = status.vi?.venc[i]?.hls_publish_status ?? null
		}
		this.data.user.ts0 = status.user?.ts0 ?? null
		this.data.user.flv0 = status.user?.flv0 ?? null
		this.data.user.pri0 = status.user?.pri0 ?? null
		this.data.user.web = status.user?.web ?? null
		this.data.user.rtsp = status.user?.rtsp ?? null

		//console.log(this.data.vi.venc)
	}

	// Return config fields for web config
	getConfigFields() {
		return ConfigFields
	}

	// ##########################
	// #### Instance Actions ####
	// ##########################
	init_actions() {
		this.setActionDefinitions(setActions(this))
	}

	// ############################
	// #### Instance Feedbacks ####
	// ############################
	init_feedbacks() {
		this.setFeedbackDefinitions(setFeedbacks(this))
	}

	// ############################
	// #### Instance Variables ####
	// ############################
	init_variables() {
		this.setVariableDefinitions(setVariables(this))
	}

	// Update Values
	checkVariables() {
		checkVariables(this)
	}

	// ##########################
	// #### Instance Presets ####
	// ##########################
	init_presets() {
		this.setPresetDefinitions(setPresets(this))
	}
}

runEntrypoint(NeworangeEncoderInstance)
