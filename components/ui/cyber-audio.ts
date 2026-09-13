/**
 * Fenntrace — Cyber Audio Synthesizer (Web Audio API)
 *
 * Lightweight audio synthesis generating high-tech micro-soundscapes
 * without loading external MP3 files.
 */

class CyberSoundEngine {
  private ctx: AudioContext | null = null
  public enabled: boolean = true

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume()
    }
    return this.ctx
  }

  /**
   * Crisp UI selection click / keystroke blip
   */
  public playClick(freq = 800) {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, ctx.currentTime + 0.04)

    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.04)
  }

  /**
   * Radar Sonar Sweep ping tone
   */
  public playSonarPing() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(1200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3)

    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  }

  /**
   * Multi-tone harmonic chime on completion
   */
  public playSuccessChime() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = "triangle"
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.06)

      gain.gain.setValueAtTime(0.05, ctx.currentTime + index * 0.06)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.06 + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime + index * 0.06)
      osc.stop(ctx.currentTime + index * 0.06 + 0.25)
    })
  }

  /**
   * Tactical cyber alert tone
   */
  public playAlert() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sawtooth"
    osc.frequency.setValueAtTime(320, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.15)

    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.15)
  }
}

export const cyberAudio = new CyberSoundEngine()
