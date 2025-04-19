import { InstanceBase, InstanceStatus, runEntrypoint } from '@companion-module/base'

import { setVariables, checkVariables } from './variables.js'
import { setActions } from './actions.js'
import { setFeedbacks } from './feedbacks.js'
import { setPresets } from './presets.js'
import { ConfigFields } from './config.js'

import { XMLParser } from 'fast-xml-parser'
import { DigestClient } from 'digest-fetch'

class HisiliconEncoderInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		this.pollID = null
	}

	async init(config) {
		this.data = {
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
			},
			user: {
				ts0: null,
				flv0: null,
				pri0: null,
				web: null,
				rtsp: null,
			},
		}

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
		this.clearSession()
		this.updateStatus(InstanceStatus.Disconnected)
	}

	// Update module after a config change
	async configUpdated(config) {
		this.disablePolling()
		this.controller.abort()
		this.clearSession()
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
						'Timeout - Check configuration and connection to the controller',
					)
				case 'AbortError':
					break
				default:
					this.log('error', String(error))
			}
		} finally {
			const dt = Date.now() - start
			this.log('debug', `...returned after ${dt}ms.`)
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

			this.checkVariables()
			this.checkFeedbacks()
		} catch (error) {
			switch (error.name) {
				case 'TimeoutError':
					this.updateStatus(
						InstanceStatus.ConnectionFailure,
						'Timeout - Check configuration and connection to the controller',
					)
				case 'AbortError':
					break
				default:
					this.log('error', String(error))
			}
		} finally {
			const dt = Date.now() - start
			this.log('debug', `...returned after ${dt}ms.`)
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
		this.data.ai.samplerate = status.ai?.samplerate ?? null
		this.data.ai.audio_ok = status.ai?.audio_ok ?? null
		this.data.vi.framerate = status.vi?.framerate ?? null
		this.data.vi.int_cnt = status.vi?.int_cnt ?? null
		this.data.vi.lost_int = status.vi?.lost_int ?? null
		this.data.vi.width = status.vi?.width ?? null
		this.data.vi.height = status.vi?.height ?? null
		this.data.vi.interlaced = status.vi?.interlaced ?? null
		this.data.vi.video_ok = status.vi?.video_ok ?? null
		this.data.user.ts0 = status.user?.ts0 ?? null
		this.data.user.flv0 = status.user?.flv0 ?? null
		this.data.user.pri0 = status.user?.pri0 ?? null
		this.data.user.web = status.user?.web ?? null
		this.data.user.rtsp = status.user?.rtsp ?? null
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

runEntrypoint(HisiliconEncoderInstance)
