New Orange Technology H.265/H.264 video encoder

This module supports H.264(AVC)/H.265(HEVC) IP streaming video encoders sold under many brand names worldwide based on SoCs from HiSilicon (Huawei) or Ambarella.
It appears that the basic hardware design and control application was developed by New Orange Technology and is only further branded and customized by other vendors and resellers.

These include brands and suppliers such as

- URayTech
- J-Tech Digital
- Pro Video Instruments
- Network Technologies Incorporated (NTI)
- Oupree
- MINE Technology
- Blankom
- ISEEVY
- Orivision
- WorldKast
- Digicast
- DIVAR Electronics
- U.T.E. Electronic
- ...

The devices all look very similar and there are at least three different hardware generations. They are available as standalone or rackmount devices (with up to 16 channels) with HDMI, SDI, CVBS or VGA input.
The integrated web UI can be heavily customized and redesigned, but the core HTTP API and functionality are always identical. The firmware (packaged as “up.rar”) should be interchangeable between different vendors within the same hardware generation.

SoCs used:

- Gen 1: HiSilicon Hi3516AV100 (1 Main- & 1 Substream)
- Gen 2: HiSilicon Hi3520DV400 (1 Main- & 3 Substreams)
- Gen 3: Ambarella S6L55M (1 Main- & 3 substreams)

## Actions

- rtmpPush
- srtCaller
- reboot

## Variables

- version
- runtime
- systime
- buildtime
- cpuinfo
- vga_input
- sdi_input
- cpuusage
- memoryfree
- memorytotal
- net_packet_sent
- net_packet_dropped
- ai_samplerate
- ai_status
- ai_format
- vi_framerate
- vi_int_cnt
- vi_lost_int
- vi_width
- vi_height
- vi_interlaced
- vi_status
- vi_mode
- vi_format
- stream0_codec
- stream0_format
- stream0_bitrate
- stream0_rtmp_status
- stream0_srt_status
- stream0_hls_status
- stream1_codec
- stream1_format
- stream1_bitrate
- stream1_rtmp_status
- stream1_srt_status
- stream1_hls_status
- stream2_codec
- stream2_format
- stream2_bitrate
- stream2_rtmp_status
- stream2_srt_status
- stream2_hls_status
- stream3_codec
- stream3_format
- stream3_bitrate
- stream3_rtmp_status
- stream3_srt_status
- stream3_hls_status
- user_ts
- user_flv
- user_pri
- user_web
- user_rtsp

## Feedbacks

- inputSignal
- streamUsed
- streamConnection

For additional actions, please raise a feature request on [GitHub](https://github.com/bitfocus/companion-module-neworange-encoder/).
