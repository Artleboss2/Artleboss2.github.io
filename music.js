      {
        "imports": {
          "three": "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js",
          "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/"
        }
      }

      import * as THREE from "three";
      import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
      import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
      import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
      import { AfterimagePass } from "three/addons/postprocessing/AfterimagePass.js";
      import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

      const TAU = Math.PI * 2;
      const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
      const lerp = (a, b, t) => a + (b - a) * t;
      const fract = (x) => x - Math.floor(x);
      const hash1 = (n) => fract(Math.sin(n * 12.9898) * 43758.5453123);

      
      const easeOutQuad = (t) => t * (2 - t);
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
      const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
      const smoothstep = (a, b, t) => {
        const x = clamp((t - a) / (b - a), 0, 1);
        return x * x * (3 - 2 * x);
      };
      const smootherstep = (a, b, t) => {
        const x = clamp((t - a) / (b - a), 0, 1);
        return x * x * x * (x * (x * 6 - 15) + 10);
      };

      
      const hash2 = (x, y) =>
        fract(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453);
      const hash3 = (x, y, z) =>
        fract(Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453);

      
      const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
      const gradNoise = (x, y, z) => {
        const xi = Math.floor(x),
          yi = Math.floor(y),
          zi = Math.floor(z);
        const xf = x - xi,
          yf = y - yi,
          zf = z - zi;
        const u = fade(xf),
          v = fade(yf),
          w = fade(zf);

        const n000 = hash3(xi, yi, zi) * 2 - 1;
        const n001 = hash3(xi, yi, zi + 1) * 2 - 1;
        const n010 = hash3(xi, yi + 1, zi) * 2 - 1;
        const n011 = hash3(xi, yi + 1, zi + 1) * 2 - 1;
        const n100 = hash3(xi + 1, yi, zi) * 2 - 1;
        const n101 = hash3(xi + 1, yi, zi + 1) * 2 - 1;
        const n110 = hash3(xi + 1, yi + 1, zi) * 2 - 1;
        const n111 = hash3(xi + 1, yi + 1, zi + 1) * 2 - 1;

        return lerp(
          lerp(lerp(n000, n100, u), lerp(n010, n110, u), v),
          lerp(lerp(n001, n101, u), lerp(n011, n111, u), v),
          w,
        );
      };

      const config = {
        form: "icosahedron",
        density: 3,
        sensitivity: 1.2,
        volume: 0.8,
        visualMode: "standard",
        colorTheme: "void",
        colorPrimary: "#ffffff",
        colorSecondary: "#4488ff",
        colorBg: "#020204",
        colorReactivity: 0.55,
        colorCycle: true,
        hueRotateSpeed: 0,
        barLockColors: true,
        cameraMode: "orbit",
        cameraDistance: 35,
        cameraSpeed: 0.6,
        cameraShake: 0.45,
        cameraFov: 60,
        cameraBeatZoom: true,
        cameraAutoAngles: false,
        particleMode: "vertex",
        fieldMode: "harmonic",
        symmetry: 6,
        turbulence: 0.25,
        cohesion: 0.55,
        particleCount: 1500,
        bloomStrength: 0.8,
        bloomRadius: 0.7,
        trailMode: "medium",
        glitchAmount: 0,
        vignette: 0.35,
        grain: 0.12,
        aberration: 0.08,
        anamorphic: 0,
        scanlines: 0,
        filmLook: "none",
        environment: "void",
        fogDensity: 0.008,
        ringCount: 3,
        showInner: true,
        showOuter: true,
        showWaveform: true,
        showBars: false,
        showConnections: true,
        showParticles: true,
        showDeepParticles: true,
        showShockwaves: true,
        showWireframeCore: true,
        showRimGlow: true,
        showRings: true,
        particleSizeMult: 1.0,
        particleBrightness: 1.0,
        shockwaveIntensity: 0.7,
        shockwaveImpactThreshold: 0.55,
        shockwaveCooldown: 0.22,
        showLightRays: false,
        showAurora: false,
        showEnergyField: false,
        showOrbitals: false,
        showSpectrum: true,
        autoPilot: false,
        beatFlash: true,
        synesthesia: false,
        harmonicSnap: true,
        negativeSpace: false,
        reactiveBg: true,
        bgPattern: "none",
        bgPatternStrength: 0.35,
        
        smoothness: 0.7,
        
        modelSpinEnabled: true,
        modelSpinSpeed: 1.0,
        modelSpinAxis: "xyz",
        modelSpinReactive: true,
        modelSpinReactivity: 1.0,
        modelPulseEnabled: true,
        modelPulseAmount: 1.0,
      };

      const colorThemes = {
        void: { primary: "#ffffff", secondary: "#888888", bg: "#020204" },
        ember: { primary: "#ff6b35", secondary: "#ff2200", bg: "#0a0505" },
        arctic: { primary: "#88ffff", secondary: "#0066ff", bg: "#020508" },
        neon: { primary: "#ff00ff", secondary: "#00ffff", bg: "#050008" },
        sunset: { primary: "#ff8855", secondary: "#ff3366", bg: "#0a0508" },
        forest: { primary: "#88ff88", secondary: "#00aa44", bg: "#030805" },
        vapor: { primary: "#ff71ce", secondary: "#01cdfe", bg: "#05020a" },
        gold: { primary: "#ffd700", secondary: "#ff8c00", bg: "#080604" },
        blood: { primary: "#ff0044", secondary: "#880022", bg: "#0a0204" },
        ocean: { primary: "#0088ff", secondary: "#004488", bg: "#020408" },
        aurora: { primary: "#00ff88", secondary: "#ff00ff", bg: "#020804" },
        holographic: {
          primary: "#ff88ff",
          secondary: "#88ffff",
          bg: "#040408",
        },
        plasma: { primary: "#ff4488", secondary: "#4488ff", bg: "#080408" },
        infrared: { primary: "#ff2222", secondary: "#880044", bg: "#0a0204" },
        bioluminescent: {
          primary: "#00ffaa",
          secondary: "#0088ff",
          bg: "#020806",
        },
      };

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      document.body.appendChild(renderer.domElement);
      renderer.domElement.id = "canvas";

      
      const bgScene = new THREE.Scene();
      const bgCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const bgUniforms = {
        uTime: { value: 0 },
        uPhase: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uBgColor: { value: new THREE.Color(config.colorBg) },
        uAccentA: { value: new THREE.Color(config.colorPrimary) },
        uAccentB: { value: new THREE.Color(config.colorSecondary) },
        uPattern: { value: 0 },
        uPatternStrength: { value: config.bgPatternStrength },
        uSymmetry: { value: config.symmetry },
        uEnergy: { value: 0 },
        uBass: { value: 0 },
        uMid: { value: 0 },
        uHigh: { value: 0 },
        uNegative: { value: 0 },
        uBeatPulse: { value: 0 },
        uReactiveBg: { value: 1 },
      };

      const bgVert = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
      const bgFrag = `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime, uPhase, uPatternStrength, uSymmetry, uEnergy, uBass, uMid, uHigh, uNegative, uBeatPulse, uReactiveBg;
      uniform vec2 uResolution;
      uniform vec3 uBgColor, uAccentA, uAccentB;
      uniform int uPattern;
      float sat(float x){ return clamp(x, 0.0, 1.0); }
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      vec3 mixScreen(vec3 a, vec3 b, float t){ return mix(a, 1.0 - (1.0 - a) * (1.0 - b), t); }
      void main(){
        vec2 uv = vUv;
        float aspect = uResolution.x / max(uResolution.y, 1.0);
        vec3 base = uBgColor;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= aspect;
        float r = length(p), a = atan(p.y, p.x);
        float n = max(uSymmetry, 1.0);
        float sector = 6.28318530718 / n;
        float asym = mod(a + 3.14159265359, sector) * n;
        float ph = uPhase;
        float reactMult = uReactiveBg > 0.5 ? 1.0 : 0.0;
        float pat = 0.0;
        if (uPattern == 1) {
          pat = 0.55 * sin((10.0 + uBass * 10.0 * reactMult) * r - ph * 0.35) * cos((2.0 + uMid * 4.0 * reactMult) * asym + ph * 0.25)
              + 0.35 * sin((18.0 + uHigh * 20.0 * reactMult) * r + (3.0 + uHigh * 4.0 * reactMult) * asym - ph * 0.55);
        } else if (uPattern == 2) {
          float s = 6.0 + uMid * 10.0 * reactMult;
          float rot = ph * 0.08;
          mat2 R = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
          vec2 q = R * p;
          float gx = abs(fract(q.x * s) - 0.5), gy = abs(fract(q.y * s) - 0.5);
          pat = (1.0 - sat(min(gx, gy) * 18.0)) * (0.6 + 0.4 * sin(ph * 0.25 + r * 3.0));
        } else if (uPattern == 3) {
          pat = 0.25 * (sin(p.x * (2.0 + uBass * 3.0 * reactMult) + ph * 0.15) + sin(p.y * (3.0 + uMid * 4.0 * reactMult) - ph * 0.12)
              + sin((p.x + p.y) * (4.0 + uHigh * 6.0 * reactMult) + ph * 0.10) + sin(r * (6.0 + uEnergy * 8.0 * reactMult) - ph * 0.08));
        } else if (uPattern == 4) {
          pat = sin(r * 8.0 - ph * 0.2) * 0.5 + sin(asym * 3.0 + ph * 0.1) * 0.3;
        } else if (uPattern == 5) {
          for (float i = 1.0; i <= 5.0; i++) {
            float freq = i * (1.0 + uEnergy * 0.5 * reactMult);
            pat += (sin(p.x * freq + ph * 0.2 * i) + sin(p.y * freq + ph * 0.15 * i)) / i;
          }
          pat *= 0.15;
        }
        float strength = uPatternStrength * (0.25 + 0.75 * uEnergy * reactMult);
        vec3 accent = mix(uAccentA, uAccentB, sat(0.5 + 0.5 * sin(ph * 0.06 + r * 2.0)));
        base = mixScreen(base, accent * (0.35 + 0.65 * sat(pat * 0.8 + 0.2)), strength);
        base += accent * uBeatPulse * 0.15 * reactMult * (1.0 - r * 0.5);
        base = mix(base, base * (0.55 + 0.45 * smoothstep(1.35, 0.15, r)), 0.70);
        base += (hash(uv * uResolution.xy + fract(uTime) * 100.0) - 0.5) * 0.03;
        if (uNegative > 0.5) base = mix(mix(base, vec3(1.0), 0.82), vec3(1.0) - base * 0.55, 0.6);
        gl_FragColor = vec4(base, 1.0);
      }
    `;
      bgScene.add(
        new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          new THREE.ShaderMaterial({
            uniforms: bgUniforms,
            vertexShader: bgVert,
            fragmentShader: bgFrag,
            depthTest: false,
            depthWrite: false,
          }),
        ),
      );

      function setBgPatternFromConfig() {
        const map = {
          none: 0,
          mandala: 1,
          lattice: 2,
          plasma: 3,
          voronoi: 4,
          waves: 5,
        };
        bgUniforms.uPattern.value = map[config.bgPattern] || 0;
      }
      setBgPatternFromConfig();

      
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(config.colorBg, config.fogDensity);
      const camera = new THREE.PerspectiveCamera(
        config.cameraFov,
        window.innerWidth / window.innerHeight,
        0.1,
        500,
      );
      camera.position.set(0, 0, config.cameraDistance);
      scene.add(new THREE.AmbientLight(0xffffff, 0.25));
      const mainLight = new THREE.PointLight(0xffffff, 1.2, 120);
      mainLight.position.set(20, 20, 20);
      scene.add(mainLight);
      const fillLight = new THREE.PointLight(0x4488ff, 0.4, 80);
      fillLight.position.set(-15, -10, -20);
      scene.add(fillLight);
      
      class AudioAnalyzer {
        constructor() {
          this.bands = 64;
          this.bandValues = new Float32Array(this.bands);
          this.bandPeaks = new Float32Array(this.bands);
          
          this.bandEdges = this._computeLogBandEdges(this.bands, 20, 20000);
          this.prevBandValues = new Float32Array(this.bands);
          this.onsetDecay = new Float32Array(this.bands);
          this._fftSmooth = null;
          this.beatInterval = 500;
          this.lastBeatTime = 0;
          this.beatGate = 0;
          this.bpmSmooth = 120;
          this.beatCount = 0;
          this.barCount = 0;
          this.spectralCentroid = 0.5;
          this.spectralFlux = 0;
          this.energy = 0;
          this.spectralSpread = 0;
          this.spectralRolloff = 0;
          this.spectralFlatness = 0;
          this.onsetKick = 0;
          this.onsetSnare = 0;
          this.onsetHihat = 0;
          this.onsetGlobal = 0;
          this._fluxHist = [];
          this._fluxKickHist = [];
          this._fluxSnareHist = [];
          this._fluxHihatHist = [];
          this._lastOnsetT = 0;
          this._lastKickT = 0;
          this._lastSnareT = 0;
          this._lastHihatT = 0;
          this.rms = 0;
          this.rmsSmooth = 0.06;
          this.rmsPeak = 0;
          this.sampleRate = 48000;
          this.fftSize = 8192;
          this.rootNote = NaN;
          this.noteName = "--";
          this.chroma = new Float32Array(12);
          this._noteBins = new Float32Array(12);
          this.smoothSubBass = 0;
          this.smoothBass = 0;
          this.smoothLowMid = 0;
          this.smoothMid = 0;
          this.smoothHighMid = 0;
          this.smoothHigh = 0;
          this.smoothBrilliance = 0;
          
          this._envSubBass = 0;
          this._envBass = 0;
          this._envMid = 0;
          this._envHigh = 0;
          this._tMs = 0;
          
          this.transientSharpness = 0;
          
          this.harmonicRatio = 0;
        }

        _computeLogBandEdges(numBands, minHz, maxHz) {
          
          const edges = new Float32Array(numBands + 1);
          const logMin = Math.log10(minHz);
          const logMax = Math.log10(maxHz);
          for (let i = 0; i <= numBands; i++) {
            edges[i] = Math.pow(
              10,
              logMin + (i / numBands) * (logMax - logMin),
            );
          }
          return edges;
        }

        setFFTInfo(fftSize, sampleRate) {
          this.fftSize = fftSize;
          this.sampleRate = sampleRate;
          this.bandEdges = this._computeLogBandEdges(
            this.bands,
            20,
            Math.min(20000, sampleRate / 2),
          );
        }
        _median(arr) {
          if (!arr.length) return 0;
          const a = arr.slice().sort((x, y) => x - y);
          const mid = (a.length - 1) * 0.5;
          return lerp(
            a[Math.floor(mid)],
            a[Math.ceil(mid)],
            mid - Math.floor(mid),
          );
        }
        _mad(arr, med) {
          return this._median(arr.map((v) => Math.abs(v - med))) + 1e-6;
        }
        _adaptiveThreshold(history, k = 2.6) {
          const med = this._median(history);
          return med + k * this._mad(history, med);
        }
        _ensureFftSmooth(n) {
          if (!this._fftSmooth || this._fftSmooth.length !== n)
            this._fftSmooth = new Float32Array(n);
        }
        _noteName(pc) {
          return [
            "C",
            "C#",
            "D",
            "D#",
            "E",
            "F",
            "F#",
            "G",
            "G#",
            "A",
            "A#",
            "B",
          ][(pc | 0) % 12];
        }

        analyze(
          freqData,
          timeData,
          dt,
          freqL = null,
          freqR = null,
          smoothingAlpha = 0.18,
        ) {
          this._tMs += dt * 1000;
          const N = freqData.length;
          this._ensureFftSmooth(N);

          
          const baseAlpha = clamp(smoothingAlpha, 0.05, 0.4);

          
          const hzPerBin = this.sampleRate / this.fftSize;
          
          for (let i = 0; i < N; i++) {
            
            const linear = Math.pow(freqData[i] / 255, 1.2);
            
            const a =
              linear > this._fftSmooth[i]
                ? Math.min(baseAlpha * 2.5, 0.7)
                : baseAlpha;
            this._fftSmooth[i] = lerp(this._fftSmooth[i], linear, a);
          }

          
          let sumEnergy = 0,
            sumCentroid = 0,
            sumCentroidWeight = 0;
          let geoMean = 0,
            arithmeticMean = 0;

          for (let b = 0; b < this.bands; b++) {
            const lowHz = this.bandEdges[b];
            const highHz = this.bandEdges[b + 1];
            const startBin = Math.max(1, Math.floor(lowHz / hzPerBin));
            const endBin = Math.min(N - 1, Math.ceil(highHz / hzPerBin));

            let v = 0,
              w = 0;
            for (let i = startBin; i <= endBin; i++) {
              
              const weight = 1.0 + (i / N) * 0.5;
              v += this._fftSmooth[i] * weight;
              w += weight;
            }
            const val = w > 0 ? v / w : 0;
            this.bandValues[b] = val;
            this.bandPeaks[b] = Math.max(this.bandPeaks[b] * 0.97, val);

            const centerHz = (lowHz + highHz) / 2;
            sumCentroid += (b / this.bands) * val;
            sumCentroidWeight += val;
            sumEnergy += val * val; 

            
            arithmeticMean += val;
            geoMean += val > 0.001 ? Math.log(val + 0.001) : Math.log(0.001);
          }

          this.spectralCentroid =
            sumCentroidWeight > 1e-6 ? sumCentroid / sumCentroidWeight : 0.5;
          arithmeticMean /= this.bands;
          geoMean = Math.exp(geoMean / this.bands);
          this.spectralFlatness =
            arithmeticMean > 0.001 ? geoMean / arithmeticMean : 0;

          
          let flux = 0,
            fluxKick = 0,
            fluxSnare = 0,
            fluxHihat = 0;
          for (let b = 0; b < this.bands; b++) {
            const dv = this.bandValues[b] - this.prevBandValues[b];
            const pos = Math.max(0, dv);
            const rectified = pos * pos; 
            flux += rectified;

            
            const hz = (this.bandEdges[b] + this.bandEdges[b + 1]) / 2;
            if (hz < 150)
              fluxKick += rectified * 2.0; 
            else if (hz >= 150 && hz < 400)
              fluxKick += rectified * 0.5; 
            else if (hz >= 200 && hz < 2000)
              fluxSnare += rectified; 
            else if (hz >= 4000) fluxHihat += rectified * 1.5; 

            this.onsetDecay[b] = Math.max(
              this.onsetDecay[b] * 0.82,
              clamp(pos * 2.8, 0, 1),
            );
            this.prevBandValues[b] = this.bandValues[b];
          }
          flux = Math.sqrt(flux);
          fluxKick = Math.sqrt(fluxKick);
          fluxSnare = Math.sqrt(fluxSnare);
          fluxHihat = Math.sqrt(fluxHihat);

          const pushHist = (arr, v, maxLen) => {
            arr.push(v);
            if (arr.length > maxLen) arr.shift();
          };
          pushHist(this._fluxHist, flux, 60);
          pushHist(this._fluxKickHist, fluxKick, 50);
          pushHist(this._fluxSnareHist, fluxSnare, 50);
          pushHist(this._fluxHihatHist, fluxHihat, 40);

          
          const now = this._tMs;
          const trigOnset = (v, thr, ref, cooldown, sensitivity = 2.4) => {
            if (v > thr && now - this[ref] > cooldown) {
              this[ref] = now;
              return clamp((v / thr - 1.0) * sensitivity, 0.5, 1.5); 
            }
            return 0.0;
          };

          const gOn = trigOnset(
            flux,
            this._adaptiveThreshold(this._fluxHist, 2.2),
            "_lastOnsetT",
            80,
          );
          const kOn = trigOnset(
            fluxKick,
            this._adaptiveThreshold(this._fluxKickHist, 2.0),
            "_lastKickT",
            150,
            3.0,
          );
          const sOn = trigOnset(
            fluxSnare,
            this._adaptiveThreshold(this._fluxSnareHist, 2.2),
            "_lastSnareT",
            100,
          );
          const hOn = trigOnset(
            fluxHihat,
            this._adaptiveThreshold(this._fluxHihatHist, 2.5),
            "_lastHihatT",
            50,
          );

          
          this.onsetGlobal = Math.max(gOn, this.onsetGlobal * 0.88);
          this.onsetKick = Math.max(kOn, this.onsetKick * 0.78); 
          this.onsetSnare = Math.max(sOn, this.onsetSnare * 0.82);
          this.onsetHihat = Math.max(hOn, this.onsetHihat * 0.9); 

          this.spectralFlux = clamp(flux * 0.8, 0, 2.5);

          
          this.transientSharpness = clamp(
            this.onsetKick * 1.2 +
              this.onsetSnare * 0.8 +
              this.onsetHihat * 0.5 +
              this.onsetGlobal * 0.3,
            0,
            2.0,
          );

          
          if (timeData && timeData.length) {
            let sum = 0,
              zeroCrossings = 0;
            for (let i = 0; i < timeData.length; i++) {
              const sample = (timeData[i] - 128) / 128;
              sum += sample * sample;
              if (i > 0) {
                const prev = (timeData[i - 1] - 128) / 128;
                if ((sample >= 0 && prev < 0) || (sample < 0 && prev >= 0))
                  zeroCrossings++;
              }
            }
            this.rms = Math.sqrt(sum / timeData.length);
            
            this.harmonicRatio = clamp(
              (zeroCrossings / timeData.length) * 50,
              0,
              1,
            );
          }

          
          const attackTime = 0.005,
            releaseTime = 0.15;
          const attackCoeff = 1 - Math.exp(-dt / attackTime);
          const releaseCoeff = 1 - Math.exp(-dt / releaseTime);
          const envCoeff =
            this.rms > this.rmsSmooth ? attackCoeff : releaseCoeff;
          this.rmsSmooth =
            this.rmsSmooth + (this.rms - this.rmsSmooth) * envCoeff;
          this.rmsPeak = Math.max(this.rmsPeak * 0.9995, this.rmsSmooth);

          
          const computeBandEnergy = (startBand, endBand) => {
            let sum = 0;
            for (let i = startBand; i <= endBand && i < this.bands; i++)
              sum += this.bandValues[i];
            return sum / (endBand - startBand + 1);
          };

          
          const rawSubBass = computeBandEnergy(0, 3); 
          const rawBass = computeBandEnergy(4, 8); 
          const rawLowMid = computeBandEnergy(9, 16); 
          const rawMid = computeBandEnergy(17, 28); 
          const rawHighMid = computeBandEnergy(29, 40); 
          const rawHigh = computeBandEnergy(41, 52); 
          const rawBrilliance = computeBandEnergy(53, 63); 

          
          const updateEnv = (current, target, attack, release) => {
            const coeff = target > current ? attack : release;
            return current + (target - current) * coeff;
          };
          const fastAttack = 1 - Math.pow(0.001, dt * 12.0);
          const medAttack = 1 - Math.pow(0.001, dt * 6.0);
          const slowRelease = 1 - Math.pow(0.001, dt * 1.5);
          const medRelease = 1 - Math.pow(0.001, dt * 2.5);

          this.smoothSubBass = updateEnv(
            this.smoothSubBass,
            rawSubBass,
            fastAttack,
            slowRelease,
          );
          this.smoothBass = updateEnv(
            this.smoothBass,
            rawBass,
            fastAttack,
            slowRelease,
          );
          this.smoothLowMid = updateEnv(
            this.smoothLowMid,
            rawLowMid,
            medAttack,
            medRelease,
          );
          this.smoothMid = updateEnv(
            this.smoothMid,
            rawMid,
            medAttack,
            medRelease,
          );
          this.smoothHighMid = updateEnv(
            this.smoothHighMid,
            rawHighMid,
            medAttack,
            medRelease,
          );
          this.smoothHigh = updateEnv(
            this.smoothHigh,
            rawHigh,
            fastAttack,
            medRelease,
          );
          this.smoothBrilliance = updateEnv(
            this.smoothBrilliance,
            rawBrilliance,
            fastAttack,
            medRelease,
          );

          
          this.energy = clamp(
            0.25 * this.smoothSubBass +
              0.3 * this.smoothBass +
              0.15 * this.smoothLowMid +
              0.15 * this.smoothMid +
              0.1 * this.smoothHighMid +
              0.05 * this.smoothHigh,
            0,
            1.5,
          );

          
          let isBeat = false;
          if (
            kOn > 0.3 &&
            now - this.lastBeatTime > 180 &&
            this.beatGate <= 0
          ) {
            isBeat = true;
            const interval = now - this.lastBeatTime;
            if (this.lastBeatTime > 0 && interval > 180 && interval < 2500) {
              
              this.beatInterval = lerp(this.beatInterval, interval, 0.25);
              this.bpmSmooth = lerp(
                this.bpmSmooth,
                60000 / this.beatInterval,
                0.15,
              );
            }
            this.lastBeatTime = now;
            this.beatCount++;
            if (this.beatCount % 4 === 0) this.barCount++;
            this.beatGate = 100;
          }
          this.beatGate = Math.max(0, this.beatGate - dt * 1000);

          
          if (this._fftSmooth) {
            this.chroma.fill(0);
            for (let i = 4; i < Math.min(400, N); i++) {
              const freq = i * hzPerBin;
              if (freq > 30 && freq < 4000) {
                const midi = 69 + 12 * Math.log2(freq / 440);
                const chroma = ((Math.round(midi) % 12) + 12) % 12;
                this.chroma[chroma] += this._fftSmooth[i];
              }
            }
            
            let maxVal = 0,
              maxIdx = 0;
            for (let i = 0; i < 12; i++) {
              if (this.chroma[i] > maxVal) {
                maxVal = this.chroma[i];
                maxIdx = i;
              }
            }
            if (maxVal > 0.1) {
              this.rootNote = maxIdx;
              this.noteName = this._noteName(this.rootNote);
            }
          }
          return isBeat;
        }
        getBand(i) {
          return this.bandValues[Math.min(i, this.bands - 1)];
        }
        getOnset(i) {
          return this.onsetDecay[Math.min(i, this.bands - 1)];
        }
        getBPM() {
          return Math.round(
            Number.isFinite(this.bpmSmooth)
              ? this.bpmSmooth
              : 60000 / clamp(this.beatInterval, 240, 2000),
          );
        }
      }
      const audio = new AudioAnalyzer();

      
      
      
      class MotionCoordinator {
        constructor() {
          
          this.pulse = 0; 
          this.impact = 0; 
          this.swell = 0; 
          this.breathe = 0; 

          
          this.lowMotion = 0;
          this.midMotion = 0;
          this.highMotion = 0;

          
          this.scaleSuggestion = 1;
          this.zoomSuggestion = 0;

          
          this._pulseRaw = 0;
          this._impactRaw = 0;
          this._swellRaw = 0;
          this._lowRaw = 0;
          this._midRaw = 0;
          this._highRaw = 0;

          
          this._pulseSmooth1 = 0;
          this._pulseSmooth2 = 0;
          this._swellSmooth1 = 0;
          this._swellSmooth2 = 0;

          
          this._lastBeatTime = 0;
          this._beatLockout = 0;
          this._breathePhase = 0;
        }

        update(audio, dt, musicPhase, smoothness = 0.7) {
          const now = performance.now();

          
          
          
          const smoothFactor = 0.3 + smoothness * 0.7; 
          const lerpSlow = dt * (1.5 - smoothFactor * 1.2); 
          const lerpMed = dt * (4.0 - smoothFactor * 3.0); 
          const lerpFast = dt * (8.0 - smoothFactor * 5.0); 

          
          
          const beatLockoutTime = 150 + smoothness * 200; 

          if (audio.onsetKick > 0.4 && this._beatLockout <= 0) {
            
            this._pulseRaw = clamp(audio.onsetKick * 0.9, 0.5, 1.0);
            this._beatLockout = beatLockoutTime;
            this._lastBeatTime = now;
          }
          this._beatLockout = Math.max(0, this._beatLockout - dt * 1000);

          
          const pulseDecayRate = 0.92 + smoothness * 0.06; 
          this._pulseRaw *= pulseDecayRate;

          
          this._pulseSmooth1 = lerp(
            this._pulseSmooth1,
            this._pulseRaw,
            lerpFast,
          );
          this._pulseSmooth2 = lerp(
            this._pulseSmooth2,
            this._pulseSmooth1,
            lerpMed,
          );
          this.pulse = this._pulseSmooth2;

          
          
          const impactInfluence = 1.0 - smoothness * 0.8; 
          const rawImpact =
            (audio.onsetSnare * 0.5 + audio.onsetHihat * 0.3) * impactInfluence;
          this._impactRaw = Math.max(this._impactRaw * 0.9, rawImpact);
          this.impact = lerp(this.impact, this._impactRaw, lerpFast);

          
          
          const targetSwell = audio.energy * 0.7 + audio.rmsSmooth * 0.3;
          this._swellRaw = lerp(
            this._swellRaw,
            targetSwell,
            dt * (0.5 - smoothness * 0.35),
          ); 

          
          this._swellSmooth1 = lerp(
            this._swellSmooth1,
            this._swellRaw,
            lerpSlow,
          );
          this._swellSmooth2 = lerp(
            this._swellSmooth2,
            this._swellSmooth1,
            lerpSlow,
          );
          this.swell = this._swellSmooth2;

          
          const bpm = audio.getBPM() || 120;
          this._breathePhase += dt * (bpm / 60) * 0.25; 
          
          this.breathe =
            (Math.sin(this._breathePhase * Math.PI * 2) * 0.5 + 0.5) *
            this.swell *
            0.7;

          
          const lowTarget = (audio.smoothSubBass + audio.smoothBass) * 0.5;
          const midTarget = (audio.smoothLowMid + audio.smoothMid) * 0.5;
          const highTarget = (audio.smoothHighMid + audio.smoothHigh) * 0.5;

          
          this._lowRaw = lerp(this._lowRaw, lowTarget, lerpMed);
          this._midRaw = lerp(this._midRaw, midTarget, lerpMed);
          this._highRaw = lerp(this._highRaw, highTarget, lerpMed);

          
          this.lowMotion = lerp(this.lowMotion, this._lowRaw, lerpSlow);
          this.midMotion = lerp(this.midMotion, this._midRaw, lerpSlow);
          this.highMotion = lerp(this.highMotion, this._highRaw, lerpSlow);

          
          
          const pulseScale = this.pulse * (0.2 - smoothness * 0.12); 
          const swellScale = this.swell * 0.12;
          const breatheScale = this.breathe * 0.06;
          this.scaleSuggestion = 1.0 + pulseScale + swellScale + breatheScale;

          
          const pulseZoom = this.pulse * (0.12 - smoothness * 0.1); 
          this.zoomSuggestion = -pulseZoom + this.breathe * 0.04;
        }

        
        getSmoothed(value, extraSmooth = 0.5) {
          
          return value * (1.0 - extraSmooth * 0.5);
        }
      }
      const motion = new MotionCoordinator();

      const music = { beats: 0, phase: 0, bpmSmooth: 120, lastSeenBar: -1 };
      const shockState = { lastTime: -1e9 };
      function updateMusicClock(dt) {
        const bpm = audio.getBPM() || 120;
        music.bpmSmooth = lerp(music.bpmSmooth, bpm, 0.08);
        music.beats += dt * (clamp(music.bpmSmooth, 50, 220) / 60);
        music.phase = music.beats * TAU;
      }
      
      function createParametricGeometry(func, slices, stacks, scale = 8) {
        const geometry = new THREE.BufferGeometry();
        const vertices = [],
          indices = [];
        for (let i = 0; i <= stacks; i++) {
          const v = i / stacks;
          for (let j = 0; j <= slices; j++) {
            const u = j / slices,
              point = func(u, v);
            vertices.push(point.x * scale, point.y * scale, point.z * scale);
          }
        }
        for (let i = 0; i < stacks; i++)
          for (let j = 0; j < slices; j++) {
            const a = i * (slices + 1) + j,
              b = a + slices + 1;
            indices.push(a, b, a + 1, b, b + 1, a + 1);
          }
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(vertices, 3),
        );
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        return geometry;
      }

      function createGeometry(type, detail) {
        const segments = 8 + detail * 8;
        switch (type) {
          case "icosahedron":
            return new THREE.IcosahedronGeometry(8, detail);
          case "octahedron":
            return new THREE.OctahedronGeometry(9, detail);
          case "tetrahedron":
            return new THREE.TetrahedronGeometry(10, detail);
          case "dodecahedron":
            return new THREE.DodecahedronGeometry(8, detail);
          case "torus":
            return new THREE.TorusGeometry(6, 2.5, 12 * detail, 24 * detail);
          case "torusKnot":
            return new THREE.TorusKnotGeometry(5, 1.5, 64 * detail, 8 * detail);
          case "sphere":
            return new THREE.SphereGeometry(8, 16 * detail, 16 * detail);
          case "hyperboloid":
            return createParametricGeometry(
              (u, v) => {
                const theta = u * TAU,
                  t = (v - 0.5) * 3;
                return {
                  x: Math.sqrt(1 + t * t) * Math.cos(theta),
                  y: t,
                  z: Math.sqrt(1 + t * t) * Math.sin(theta),
                };
              },
              segments,
              segments,
              5,
            );
          case "mobius":
            return createParametricGeometry(
              (u, v) => {
                const theta = u * TAU,
                  w = (v - 0.5) * 2,
                  r = 2 + w * Math.cos(theta / 2);
                return {
                  x: r * Math.cos(theta),
                  y: w * Math.sin(theta / 2),
                  z: r * Math.sin(theta),
                };
              },
              segments * 2,
              Math.max(4, detail * 2),
              3,
            );
          case "kleinBottle":
            return createParametricGeometry(
              (u, v) => {
                const theta = u * TAU,
                  phi = v * TAU,
                  rr = 4;
                let x, y, z;
                if (theta < Math.PI) {
                  x =
                    6 * Math.cos(theta) * (1 + Math.sin(theta)) +
                    rr *
                      (1 - Math.cos(theta) / 2) *
                      Math.cos(theta) *
                      Math.cos(phi);
                  z =
                    16 * Math.sin(theta) +
                    rr *
                      (1 - Math.cos(theta) / 2) *
                      Math.sin(theta) *
                      Math.cos(phi);
                } else {
                  x =
                    6 * Math.cos(theta) * (1 + Math.sin(theta)) +
                    rr * (1 - Math.cos(theta) / 2) * Math.cos(phi + Math.PI);
                  z = 16 * Math.sin(theta);
                }
                y = rr * (1 - Math.cos(theta) / 2) * Math.sin(phi);
                return { x: x * 0.25, y: y * 0.25, z: (z - 8) * 0.25 };
              },
              segments * 2,
              segments,
              4,
            );
          case "gyroid":
            return createParametricGeometry(
              (u, v) => {
                const theta = u * TAU,
                  phi = v * Math.PI;
                const r =
                  1 +
                  0.3 *
                    (Math.sin(theta * 2) * Math.cos(phi * 3) +
                      Math.sin(phi * 2) * Math.cos(theta * 3) +
                      Math.sin(theta * 3) * Math.sin(phi * 2));
                return {
                  x: r * Math.sin(phi) * Math.cos(theta),
                  y: r * Math.cos(phi),
                  z: r * Math.sin(phi) * Math.sin(theta),
                };
              },
              segments * 2,
              segments * 2,
              6,
            );
          case "cliffordTorus":
            return createParametricGeometry(
              (u, v) => {
                const theta = u * TAU,
                  phi = v * TAU,
                  rr = 0.7071;
                const ww = rr * Math.cos(theta),
                  x = rr * Math.sin(theta),
                  y = rr * Math.cos(phi),
                  z = rr * Math.sin(phi);
                const scale = 1 / (1 - ww + 0.01);
                return { x: x * scale, y: y * scale, z: z * scale };
              },
              segments * 2,
              segments * 2,
              4,
            );
          case "hopfFibration":
            return createParametricGeometry(
              (u, v) => {
                const theta = u * TAU * 2,
                  phi = v * TAU,
                  rr = 1.5;
                return {
                  x:
                    rr *
                    (Math.cos(theta) + Math.cos(phi) * Math.cos(theta + phi)),
                  y:
                    rr *
                    (Math.sin(theta) + Math.cos(phi) * Math.sin(theta + phi)),
                  z: rr * Math.sin(phi),
                };
              },
              segments * 3,
              segments * 2,
              3,
            );
          case "seashell":
            return createParametricGeometry(
              (u, v) => {
                const theta = u * TAU * 3,
                  s = v * TAU;
                const W = (s / TAU) * Math.exp(theta / (TAU * 2));
                return {
                  x: W * Math.cos(theta) * (1 + Math.cos(s)) * 2,
                  y: W * Math.sin(theta) * (1 + Math.cos(s)) * 2,
                  z: (W * Math.sin(s) - 0.2 * Math.pow(theta / TAU, 2)) * 2 + 4,
                };
              },
              segments * 3,
              segments,
              2,
            );
          case "diniSurface":
            return createParametricGeometry(
              (u, v) => {
                const aa = 1,
                  b = 0.2,
                  uu = u * TAU * 2,
                  vv = 0.01 + v * 1.5;
                return {
                  x: aa * Math.cos(uu) * Math.sin(vv),
                  y: aa * Math.sin(uu) * Math.sin(vv),
                  z:
                    (aa * (Math.cos(vv) + Math.log(Math.tan(vv / 2))) +
                      b * uu) *
                    0.3,
                };
              },
              segments * 2,
              segments,
              3,
            );
          default:
            return new THREE.IcosahedronGeometry(8, detail);
        }
      }

      let wireframeMesh,
        particleSystem,
        connectionLines,
        rimMesh,
        vertexData = [];
      let innerMesh,
        outerMesh,
        rings = [],
        envObjects = [],
        floatingParticles,
        floatingData = [];
      let waveformRing,
        freqBars = [],
        lightRays = [],
        auroraLayer,
        energyFieldMesh,
        orbitalRings = [];
      const shockwaves = [];

      function buildMainGeometry() {
        if (wireframeMesh) scene.remove(wireframeMesh);
        if (rimMesh) scene.remove(rimMesh);
        if (particleSystem) scene.remove(particleSystem);
        if (connectionLines) scene.remove(connectionLines);

        const geom = createGeometry(config.form, config.density);
        wireframeMesh = new THREE.LineSegments(
          new THREE.WireframeGeometry(geom),
          new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
          }),
        );
        wireframeMesh.visible = config.showWireframeCore;
        scene.add(wireframeMesh);

        const rimVert =
          "varying vec3 vN, vW, vPos; void main(){ vN = normalize(normalMatrix * normal); vW = (modelMatrix * vec4(position, 1.0)).xyz; vPos = position; gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); }";
        const rimFrag =
          "uniform vec3 uColor; uniform float uIntensity, uPower, uTime; varying vec3 vN, vW, vPos; void main(){ vec3 V = normalize(cameraPosition - vW); float fres = pow(1.0 - clamp(dot(normalize(vN), V), 0.0, 1.0), uPower); float irid = sin(length(vPos) * 3.0 + uTime * 2.0) * 0.5 + 0.5; vec3 col = mix(uColor, uColor * vec3(1.2, 0.9, 1.1), irid * 0.3); gl_FragColor = vec4(col * fres * uIntensity, fres * 0.85); }";
        rimMesh = new THREE.Mesh(
          geom,
          new THREE.ShaderMaterial({
            uniforms: {
              uColor: { value: new THREE.Color(1, 1, 1) },
              uIntensity: { value: 1.0 },
              uPower: { value: 2.6 },
              uTime: { value: 0 },
            },
            vertexShader: rimVert,
            fragmentShader: rimFrag,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
        );
        rimMesh.visible = config.negativeSpace;
        rimMesh.visible = config.showRimGlow;
        scene.add(rimMesh);

        const posArr = geom.attributes.position.array;
        const uniqueSet = new Set();
        vertexData = [];
        for (let i = 0; i < posArr.length; i += 3) {
          const key = `${posArr[i].toFixed(2)},${posArr[i + 1].toFixed(2)},${posArr[i + 2].toFixed(2)}`;
          if (!uniqueSet.has(key)) {
            uniqueSet.add(key);
            const v = new THREE.Vector3(
              posArr[i],
              posArr[i + 1],
              posArr[i + 2],
            );
            const norm = v.clone().normalize();
            vertexData.push({
              base: v.clone(),
              current: v.clone(),
              velocity: new THREE.Vector3(),
              band:
                Math.floor(
                  ((Math.atan2(norm.z, norm.x) + Math.PI) / TAU) * 32 +
                    (Math.acos(clamp(norm.y, -1, 1)) / Math.PI) * 32,
                ) % 64,
              phase: Math.random() * TAU,
              theta: Math.atan2(norm.z, norm.x),
              phi: Math.acos(clamp(norm.y, -1, 1)),
              isExtra: false,
            });
          }
        }
        while (vertexData.length < config.particleCount) {
          const theta = Math.random() * TAU,
            phi = Math.acos(2 * Math.random() - 1),
            r = 2 + Math.random() * 8;
          const v = new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi),
          );
          vertexData.push({
            base: v.clone(),
            current: v.clone(),
            velocity: new THREE.Vector3(
              (Math.random() - 0.5) * 0.1,
              (Math.random() - 0.5) * 0.1,
              (Math.random() - 0.5) * 0.1,
            ),
            band: Math.floor(Math.random() * 64),
            phase: Math.random() * TAU,
            theta: Math.atan2(v.z, v.x),
            phi: Math.acos(clamp(v.clone().normalize().y, -1, 1)),
            isExtra: true,
          });
        }

        const pGeom = new THREE.BufferGeometry();
        const pPos = new Float32Array(vertexData.length * 3),
          pCol = new Float32Array(vertexData.length * 3),
          pSize = new Float32Array(vertexData.length);
        vertexData.forEach((vd, i) => {
          pPos[i * 3] = vd.current.x;
          pPos[i * 3 + 1] = vd.current.y;
          pPos[i * 3 + 2] = vd.current.z;
          pCol[i * 3] = pCol[i * 3 + 1] = pCol[i * 3 + 2] = 1;
          pSize[i] = 0.15 + Math.random() * 0.1;
        });
        pGeom.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
        pGeom.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
        pGeom.setAttribute("size", new THREE.BufferAttribute(pSize, 1));

        const pVert = `
        attribute float size; 
        attribute vec3 color; 
        varying vec3 vColor; 
        varying float vSize;
        uniform float uEnergy, uPixelRatio, uTime, uSizeMult; 
        void main() { 
          vColor = color; 
          vSize = size;
          vec4 mv = modelViewMatrix * vec4(position, 1.0); 
          
          float depth = -mv.z;
          float sizeScale = 250.0 / max(depth, 1.0);
          
          float pulse = 1.0 + sin(uTime * 2.5 + position.x * 0.3 + position.y * 0.2) * 0.15 * uEnergy;
          gl_PointSize = size * sizeScale * uPixelRatio * (0.9 + uEnergy * 0.5) * pulse * uSizeMult; 
          gl_Position = projectionMatrix * mv; 
        }
      `;
        const pFrag = `
        varying vec3 vColor; 
        varying float vSize;
        uniform float uEnergy, uBrightness;
        void main() { 
          vec2 center = gl_PointCoord - 0.5;
          float d = length(center);
          
          
          float coreGlow = exp(-d * 10.0);
          float midGlow = exp(-d * 5.0) * 0.5;
          float outerGlow = exp(-d * 2.5) * 0.25;
          float totalGlow = coreGlow + midGlow + outerGlow;
          
          
          vec3 glowColor = vColor * (0.9 + coreGlow * 0.3);
          
          glowColor += vec3(0.05, 0.02, 0.08) * outerGlow * uEnergy;
          
          float alpha = totalGlow * (0.75 + uEnergy * 0.25) * uBrightness;
          if (alpha < 0.02) discard;
          gl_FragColor = vec4(glowColor * totalGlow * uBrightness, alpha); 
        }
      `;
        particleSystem = new THREE.Points(
          pGeom,
          new THREE.ShaderMaterial({
            uniforms: {
              uTime: { value: 0 },
              uEnergy: { value: 0 },
              uPixelRatio: { value: renderer.getPixelRatio() },
              uSizeMult: { value: 1.0 },
              uBrightness: { value: 1.0 },
            },
            vertexShader: pVert,
            fragmentShader: pFrag,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
        );
        scene.add(particleSystem);

        const lineGeom = new THREE.BufferGeometry();
        lineGeom.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(3000 * 6), 3),
        );
        lineGeom.setAttribute(
          "color",
          new THREE.BufferAttribute(new Float32Array(3000 * 6), 3),
        );
        lineGeom.setDrawRange(0, 0);
        connectionLines = new THREE.LineSegments(
          lineGeom,
          new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending,
          }),
        );
        scene.add(connectionLines);
        connectionLines.visible = config.showConnections;
        particleSystem.visible = config.showParticles;
      }

      function buildSecondary() {
        if (innerMesh) scene.remove(innerMesh);
        if (outerMesh) scene.remove(outerMesh);
        innerMesh = new THREE.LineSegments(
          new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(3, 1)),
          new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending,
          }),
        );
        innerMesh.visible = config.showInner;
        scene.add(innerMesh);
        outerMesh = new THREE.LineSegments(
          new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(16, 0)),
          new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.04,
            blending: THREE.AdditiveBlending,
          }),
        );
        outerMesh.visible = config.showOuter;
        scene.add(outerMesh);
      }

      function buildWaveformRing() {
        if (waveformRing) scene.remove(waveformRing);
        const positions = new Float32Array(256 * 3);
        for (let i = 0; i < 256; i++) {
          const ang = (i / 256) * TAU;
          positions[i * 3] = Math.cos(ang) * 12;
          positions[i * 3 + 2] = Math.sin(ang) * 12;
        }
        const geom = new THREE.BufferGeometry();
        geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        waveformRing = new THREE.LineLoop(
          geom,
          new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
          }),
        );
        waveformRing.rotation.x = Math.PI / 2;
        waveformRing.visible = config.showWaveform;
        scene.add(waveformRing);
      }

      function buildFreqBars() {
        freqBars.forEach((b) => scene.remove(b));
        freqBars = [];
        for (let i = 0; i < 64; i++) {
          const ang = (i / 64) * TAU;
          const bar = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 1, 0.3),
            new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.6,
              blending: THREE.AdditiveBlending,
            }),
          );
          bar.position.set(Math.cos(ang) * 16, -15, Math.sin(ang) * 16);
          bar.rotation.y = -ang;
          bar.userData = { index: i, baseY: -15 };
          bar.visible = config.showBars;
          freqBars.push(bar);
          scene.add(bar);
        }
      }

      function buildRings() {
        rings.forEach((r) => scene.remove(r));
        rings = [];
        for (let i = 0; i < config.ringCount; i++) {
          const ring = new THREE.Mesh(
            new THREE.RingGeometry(12 + i * 5, 12.1 + i * 5, 128),
            new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.03,
              side: THREE.DoubleSide,
              blending: THREE.AdditiveBlending,
            }),
          );
          ring.userData = { index: i };
          ring.visible = config.showRings;
          rings.push(ring);
          scene.add(ring);
        }
      }
      function buildLightRays() {
        lightRays.forEach((r) => scene.remove(r));
        lightRays = [];
        if (!config.showLightRays) return;
        const rayVert =
          "varying float vY; void main() { vY = position.y / 50.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }";
        const rayFrag =
          "uniform vec3 uColor; uniform float uIntensity; varying float vY; void main() { gl_FragColor = vec4(uColor, (1.0 - vY) * uIntensity * (1.0 - vY)); }";
        for (let i = 0; i < 12; i++) {
          const mat = new THREE.ShaderMaterial({
            uniforms: {
              uColor: { value: new THREE.Color(1, 1, 1) },
              uIntensity: { value: 0.3 },
            },
            vertexShader: rayVert,
            fragmentShader: rayFrag,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
          });
          const ray = new THREE.Mesh(
            new THREE.ConeGeometry(0.3, 50, 8, 1, true),
            mat,
          );
          ray.rotation.x = Math.PI;
          ray.rotation.z = (i / 12) * TAU;
          ray.userData = {
            baseAngle: ray.rotation.z,
            speed: 0.1 + Math.random() * 0.2,
          };
          lightRays.push(ray);
          scene.add(ray);
        }
      }

      function buildAurora() {
        if (auroraLayer) scene.remove(auroraLayer);
        if (!config.showAurora) return;
        const aVert =
          "uniform float uTime, uEnergy; varying vec2 vUv; varying float vDisp; void main() { vUv = uv; vec3 pos = position; float wave = sin(pos.x * 0.15 + uTime * 0.5) * cos(pos.x * 0.08 + uTime * 0.3) + sin(pos.x * 0.22 + uTime * 0.7) * 0.5; pos.z += wave * (3.0 + uEnergy * 5.0); vDisp = wave; gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0); }";
        const aFrag =
          "uniform vec3 uColorA, uColorB; uniform float uEnergy; varying vec2 vUv; varying float vDisp; void main() { vec3 col = mix(uColorA, uColorB, vUv.y + vDisp * 0.2); float alpha = (1.0 - vUv.y) * 0.3 * (0.5 + uEnergy) * smoothstep(0.0, 0.3, vUv.y); gl_FragColor = vec4(col, alpha); }";
        auroraLayer = new THREE.Mesh(
          new THREE.PlaneGeometry(80, 30, 64, 32),
          new THREE.ShaderMaterial({
            uniforms: {
              uTime: { value: 0 },
              uColorA: { value: new THREE.Color(0x00ff88) },
              uColorB: { value: new THREE.Color(0xff00ff) },
              uEnergy: { value: 0 },
            },
            vertexShader: aVert,
            fragmentShader: aFrag,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
          }),
        );
        auroraLayer.position.set(0, 25, -30);
        auroraLayer.rotation.x = -0.3;
        scene.add(auroraLayer);
      }

      function buildEnergyField() {
        if (energyFieldMesh) scene.remove(energyFieldMesh);
        if (!config.showEnergyField) return;
        const eVert =
          "uniform float uTime, uEnergy; varying vec3 vNormal, vPos; void main() { vNormal = normal; vPos = position; vec3 pos = position; float pulse = sin(length(position) * 2.0 - uTime * 3.0) * 0.5 + 0.5; pos += normal * pulse * uEnergy * 2.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0); }";
        const eFrag =
          "uniform vec3 uColor; uniform float uTime, uEnergy; varying vec3 vNormal, vPos; void main() { float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 3.0); float pattern = sin(vPos.x * 5.0 + uTime) * sin(vPos.y * 5.0 + uTime * 1.3) * sin(vPos.z * 5.0 + uTime * 0.7); gl_FragColor = vec4(uColor, fresnel * 0.15 * (0.5 + uEnergy) * (0.5 + pattern * 0.5)); }";
        energyFieldMesh = new THREE.Mesh(
          new THREE.IcosahedronGeometry(20, 3),
          new THREE.ShaderMaterial({
            uniforms: {
              uTime: { value: 0 },
              uColor: { value: new THREE.Color(0x4488ff) },
              uEnergy: { value: 0 },
            },
            vertexShader: eVert,
            fragmentShader: eFrag,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            wireframe: true,
          }),
        );
        scene.add(energyFieldMesh);
      }

      function buildOrbitals() {
        orbitalRings.forEach((r) => scene.remove(r));
        orbitalRings = [];
        if (!config.showOrbitals) return;
        for (let i = 0; i < 3; i++) {
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(10 + i * 3, 0.05, 8, 128),
            new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.2,
              blending: THREE.AdditiveBlending,
            }),
          );
          ring.userData = { index: i, speed: (i + 1) * 0.3 };
          orbitalRings.push(ring);
          scene.add(ring);
        }
      }

      function buildEnvironment() {
        envObjects.forEach((o) => scene.remove(o));
        envObjects = [];
        if (floatingParticles) scene.remove(floatingParticles);
        floatingData = [];

        const fpPos = new Float32Array(500 * 3),
          fpCol = new Float32Array(500 * 3);
        for (let i = 0; i < 500; i++) {
          const theta = Math.random() * TAU,
            phi = Math.acos(2 * Math.random() - 1),
            r = 15 + Math.random() * 50;
          fpPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          fpPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          fpPos[i * 3 + 2] = r * Math.cos(phi);
          fpCol[i * 3] = fpCol[i * 3 + 1] = fpCol[i * 3 + 2] = 1;
          floatingData.push({
            r,
            theta,
            phi,
            speed: 0.1 + Math.random() * 0.4,
            band: Math.floor(Math.random() * 64),
            phase: Math.random() * TAU,
          });
        }
        const fpGeom = new THREE.BufferGeometry();
        fpGeom.setAttribute("position", new THREE.BufferAttribute(fpPos, 3));
        fpGeom.setAttribute("color", new THREE.BufferAttribute(fpCol, 3));
        floatingParticles = new THREE.Points(
          fpGeom,
          new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
          }),
        );
        scene.add(floatingParticles);
        floatingParticles.visible = config.showDeepParticles;

        if (config.environment === "grid") {
          const grid = new THREE.GridHelper(100, 50, 0x222222, 0x111111);
          grid.position.y = -20;
          envObjects.push(grid);
          scene.add(grid);
        }
        if (config.environment === "stars") {
          const starPos = new Float32Array(3000 * 3);
          for (let i = 0; i < 3000; i++) {
            starPos[i * 3] = (Math.random() - 0.5) * 250;
            starPos[i * 3 + 1] = (Math.random() - 0.5) * 250;
            starPos[i * 3 + 2] = (Math.random() - 0.5) * 250;
          }
          const sGeom = new THREE.BufferGeometry();
          sGeom.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
          const stars = new THREE.Points(
            sGeom,
            new THREE.PointsMaterial({
              size: 0.18,
              color: 0xffffff,
              transparent: true,
              opacity: 0.7,
            }),
          );
          envObjects.push(stars);
          scene.add(stars);
        }
        if (config.environment === "nebula") {
          for (let i = 0; i < 6; i++) {
            const neb = new THREE.Mesh(
              new THREE.SphereGeometry(35 + i * 12, 20, 20),
              new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.58 + i * 0.08, 0.6, 0.12),
                transparent: true,
                opacity: 0.04,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending,
              }),
            );
            neb.userData = { rotSpeed: 0.001 * (i + 1) };
            envObjects.push(neb);
            scene.add(neb);
          }
        }
      }

      function buildShockwaves() {
        shockwaves.forEach((s) => scene.remove(s.mesh));
        shockwaves.length = 0;
        if (!config.showShockwaves) return;

        
        const shockVert = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;
        const shockFrag = `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          
          vec2 p = vUv - 0.5;
          float r = length(p) * 2.0;
          float ring = exp(-pow(abs(r - 1.0) * 3.5, 2.0));
          float fade = smoothstep(1.6, 0.0, r);
          float a = ring * fade * uOpacity;
          if (a < 0.01) discard;
          gl_FragColor = vec4(uColor, a);
        }
      `;

        const geom = new THREE.RingGeometry(0.9, 1.28, 192, 1);
        for (let i = 0; i < 12; i++) {
          const mat = new THREE.ShaderMaterial({
            uniforms: {
              uColor: { value: new THREE.Color(1, 1, 1) },
              uOpacity: { value: 0 },
            },
            vertexShader: shockVert,
            fragmentShader: shockFrag,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
          });
          const mesh = new THREE.Mesh(geom, mat);
          mesh.visible = config.showShockwaves;
          scene.add(mesh);
          shockwaves.push({ mesh, life: 0, active: false, strength: 1.0 });
        }
      }

      function spawnShockwave(color, strength = 1.0) {
        if (!config.showShockwaves || shockwaves.length === 0) return;
        const s = shockwaves.find((x) => !x.active) || shockwaves[0];
        s.active = true;
        s.life = 1.0;
        s.strength = clamp(strength, 0.15, 1.25);
        s.mesh.scale.setScalar(1.0);
        s.mesh.position.set(0, 0, 0);
        s.mesh.material.uniforms.uOpacity.value =
          config.shockwaveIntensity * s.strength;
        s.mesh.material.uniforms.uColor.value.copy(color);
      }

      
      
      
      renderer.autoClear = false;

      const composer = new EffectComposer(renderer);

      
      const bgPass = new RenderPass(bgScene, bgCam);
      bgPass.clear = true;
      composer.addPass(bgPass);

      
      const mainPass = new RenderPass(scene, camera);
      mainPass.clear = false;
      composer.addPass(mainPass);

      
      const afterimagePass = new AfterimagePass();
      afterimagePass.enabled = config.trailMode !== "none";
      composer.addPass(afterimagePass);

      
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        config.bloomStrength,
        config.bloomRadius,
        0.12, 
      );
      bloomPass.threshold = 0.12;
      composer.addPass(bloomPass);

      
      const screenVert =  `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `;

      const screenFrag =  `
      precision highp float;

      varying vec2 vUv;
      uniform sampler2D tDiffuse;
      uniform float uTime;
      uniform vec2 uResolution;

      uniform float uVignette;
      uniform float uGrain;
      uniform float uAberration;
      uniform float uHigh;
      uniform float uAnamorphic;
      uniform float uScanlines;

      uniform float uKaleidoscope;
      uniform float uKaleidoscopeSegments;

      uniform float uFilmLook;   
      uniform float uNegative;   
      uniform float uBeatPulse;  
      uniform float uGlitch;     

      float sat(float x){ return clamp(x, 0.0, 1.0); }

      float rand(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      vec3 toLuma(vec3 c){ float l = dot(c, vec3(0.299, 0.587, 0.114)); return vec3(l); }

      vec3 adjustContrast(vec3 c, float k){
        return (c - 0.5) * k + 0.5;
      }

      vec3 adjustSaturation(vec3 c, float s){
        float l = dot(c, vec3(0.299, 0.587, 0.114));
        return mix(vec3(l), c, s);
      }

      void main() {
        vec2 uv = vUv;

        
        if (uKaleidoscope > 0.5) {
          vec2 p = uv - 0.5;
          float r = length(p);
          float a = atan(p.y, p.x);
          float n = max(1.0, uKaleidoscopeSegments);
          float sector = 6.28318530718 / n;
          a = mod(a + 6.28318530718, sector);
          a = abs(a - sector * 0.5);
          p = vec2(cos(a), sin(a)) * r;
          uv = p + 0.5;
        }

        
        if (uGlitch > 0.001) {
          float band = floor(uv.y * 24.0);
          float n = rand(vec2(band, floor(uTime * 6.0)));
          uv.x += (n - 0.5) * 0.08 * uGlitch;
          uv.y += (rand(vec2(band * 3.7, uTime * 0.4)) - 0.5) * 0.03 * uGlitch;
        }

        
        vec2 dir = uv - 0.5;
        float d = length(dir) + 1e-6;
        dir /= d;
        vec2 off = dir * uAberration * (0.002 + 0.004 * sat(uHigh));

        vec3 col;
        col.r = texture2D(tDiffuse, uv + off).r;
        col.g = texture2D(tDiffuse, uv).g;
        col.b = texture2D(tDiffuse, uv - off).b;

        
        if (uAnamorphic > 0.001) {
          vec2 o = vec2(off.x * 6.0, 0.0);
          vec3 smear = 0.5 * (texture2D(tDiffuse, uv + o).rgb + texture2D(tDiffuse, uv - o).rgb);
          col = mix(col, smear, uAnamorphic * 0.35);
        }

        
        if (uFilmLook > 0.5 && uFilmLook < 1.5) { 
          col = adjustContrast(col, 1.08);
          col *= vec3(1.03, 1.00, 0.98);
        } else if (uFilmLook >= 1.5 && uFilmLook < 2.5) { 
          col = adjustSaturation(col, 0.80);
          col = mix(col, col * vec3(1.06, 1.02, 0.92) + vec3(0.02, 0.015, 0.0), 0.55);
        } else if (uFilmLook >= 2.5 && uFilmLook < 3.5) { 
          col = adjustSaturation(col, 1.25);
          col = adjustContrast(col, 1.05);
        } else if (uFilmLook >= 3.5) { 
          col = mix(col, col + toLuma(col) * 0.06, 0.35);
          col = mix(col, vec3(1.0) - (vec3(1.0) - col) * 0.92, 0.15);
        }

        
        float vig = smoothstep(0.86, 0.28, distance(uv, vec2(0.5)));
        col *= mix(1.0, vig, sat(uVignette));

        
        if (uScanlines > 0.001) {
          float s = 0.5 + 0.5 * sin(uv.y * uResolution.y * 3.14159265);
          col *= 1.0 - uScanlines * 0.09 * s;
        }

        
        float g = (rand(uv * uResolution.xy + fract(uTime) * 1000.0) - 0.5);
        col += g * (0.06 * uGrain) * (0.35 + 0.65 * sat(uHigh));

        
        col += vec3(1.0) * uBeatPulse * 0.08;

        
        if (uNegative > 0.5) {
          col = mix(col, vec3(1.0) - col, 0.75);
        }

        gl_FragColor = vec4(col, 1.0);
      }
    `;

      const screenFXPass = new ShaderPass({
        uniforms: {
          tDiffuse: { value: null },
          uTime: { value: 0 },
          uResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
          },
          uVignette: { value: config.vignette },
          uGrain: { value: config.grain },
          uAberration: { value: config.aberration },
          uHigh: { value: 0 },
          uAnamorphic: { value: config.anamorphic },
          uScanlines: { value: config.scanlines },
          uKaleidoscope: { value: 0 },
          uKaleidoscopeSegments: { value: 6 },
          uFilmLook: { value: 0 },
          uBeatPulse: { value: 0 },
          uGlitch: { value: 0 },
          uNegative: { value: 0 },
        },
        vertexShader: screenVert,
        fragmentShader: screenFrag,
      });
      composer.addPass(screenFXPass);

      function updateTrailMode() {
        switch (config.trailMode) {
          case "none":
            afterimagePass.enabled = false;
            break;
          case "light":
            afterimagePass.enabled = true;
            afterimagePass.uniforms.damp.value = 0.82;
            break;
          case "medium":
            afterimagePass.enabled = true;
            afterimagePass.uniforms.damp.value = 0.91;
            break;
          case "heavy":
            afterimagePass.enabled = true;
            afterimagePass.uniforms.damp.value = 0.96;
            break;
          case "smear":
            afterimagePass.enabled = true;
            afterimagePass.uniforms.damp.value = 0.985;
            break;
        }
      }
      updateTrailMode();

      
      const audioEl = document.getElementById("audio");
      let audioCtx,
        analyser,
        sourceNode,
        gainNode,
        mediaDest,
        freqData,
        timeData,
        playing = false;
      
      let analyserL, analyserR;

      function initAudio() {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        sourceNode = audioCtx.createMediaElementSource(audioEl);
        analyser = audioCtx.createAnalyser();

        
        
        analyser.fftSize = 8192;
        
        analyser.smoothingTimeConstant = 0.0;
        
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;

        gainNode = audioCtx.createGain();
        gainNode.gain.value = config.volume;

        
        const highpass = audioCtx.createBiquadFilter();
        highpass.type = "highpass";
        highpass.frequency.value = 20;
        highpass.Q.value = 0.7;

        
        const compressor = audioCtx.createDynamicsCompressor();
        compressor.threshold.value = -24;
        compressor.knee.value = 30;
        compressor.ratio.value = 3;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.25;

        mediaDest = audioCtx.createMediaStreamDestination();

        
        sourceNode.connect(highpass);
        highpass.connect(compressor);
        compressor.connect(analyser);
        analyser.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        gainNode.connect(mediaDest);

        freqData = new Uint8Array(analyser.frequencyBinCount);
        timeData = new Uint8Array(analyser.fftSize);
        audio.setFFTInfo(analyser.fftSize, audioCtx.sampleRate);
      }

      
      const tmpHSL1 = { h: 0, s: 0, l: 0 },
        tmpHSL2 = { h: 0, s: 0, l: 0 };
      const palette = { hOffset: 0, hOffsetTarget: 0, globalHueShift: 0 };

      function applyColorTheme() {
        const theme = colorThemes[config.colorTheme];
        if (theme) {
          config.colorPrimary = theme.primary;
          config.colorSecondary = theme.secondary;
          config.colorBg = theme.bg;
          document.getElementById("colorPrimary").value = theme.primary;
          document.getElementById("colorSecondary").value = theme.secondary;
          document.getElementById("colorBg").value = theme.bg;
        }
        scene.fog.color = new THREE.Color(config.colorBg);
        bgUniforms.uBgColor.value.set(config.colorBg);
        bgUniforms.uAccentA.value.set(config.colorPrimary);
        bgUniforms.uAccentB.value.set(config.colorSecondary);
      }

      function getHarmonizedColor(energy, bandMix01) {
        const c1 = new THREE.Color(config.colorPrimary),
          c2 = new THREE.Color(config.colorSecondary);
        c1.getHSL(tmpHSL1);
        c2.getHSL(tmpHSL2);

        
        const rawMix =
          bandMix01 * config.colorReactivity +
          energy * config.colorReactivity * 0.4;
        const mixAmt = clamp(easeInOutSine(rawMix), 0, 1);

        let h =
          lerp(tmpHSL1.h, tmpHSL2.h, mixAmt) +
          palette.hOffset +
          palette.globalHueShift;

        
        if (config.colorCycle) {
          h += 0.018 * Math.sin(music.phase * 0.06);
          h += 0.008 * Math.sin(music.phase * 0.15 + Math.PI / 3);
        }

        
        if (config.synesthesia && Number.isFinite(audio.rootNote)) {
          
          const chromaMax = Math.max(...audio.chroma);
          if (chromaMax > 0.1) {
            const noteHue = audio.rootNote / 12;
            h = lerp(h, noteHue, 0.35 * (chromaMax / (chromaMax + 0.5)));
          }
        }
        h = fract(h);

        
        const baseSat = lerp(tmpHSL1.s, tmpHSL2.s, mixAmt);
        const satBoost =
          audio.transientSharpness * 0.15 + audio.smoothHighMid * 0.1;
        const s = clamp(
          baseSat * (0.75 + 0.5 * audio.smoothHigh + satBoost),
          0.1,
          0.98,
        );

        
        const baseLum = lerp(tmpHSL1.l, tmpHSL2.l, mixAmt);
        const lumBoost = audio.onsetKick * 0.15 + audio.spectralFlux * 0.08;
        const l = clamp(baseLum * (0.5 + 0.7 * energy + lumBoost), 0.08, 0.88);

        return new THREE.Color().setHSL(h, s, l);
      }

      function noise3D(x, y, z) {
        return (
          fract(Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453) *
            2 -
          1
        );
      }
      function foldTheta(theta, n) {
        const sector = TAU / Math.max(1, n);
        let a = (theta + Math.PI) % sector;
        if (a < 0) a += sector;
        return a * n;
      }

      
      buildMainGeometry();
      buildSecondary();
      buildWaveformRing();
      buildFreqBars();
      buildRings();
      buildEnvironment();
      buildShockwaves();
      buildLightRays();
      buildAurora();
      buildEnergyField();
      buildOrbitals();
      applyColorTheme();

      
      const specCanvas = document.getElementById("spectrum-overlay");
      const specCtx = specCanvas.getContext("2d");
      specCanvas.width = window.innerWidth;
      specCanvas.height = 50;

      function drawSpectrum() {
        if (!config.showSpectrum || !analyser) {
          specCanvas.style.opacity = "0";
          return;
        }
        specCanvas.style.opacity = "0.5";
        specCtx.clearRect(0, 0, specCanvas.width, specCanvas.height);
        const barW = specCanvas.width / 64;
        const primary = new THREE.Color(config.colorPrimary),
          secondary = new THREE.Color(config.colorSecondary);
        for (let i = 0; i < 64; i++) {
          const v = audio.getBand(i),
            h = v * 48,
            t = i / 64;
          const col = primary.clone().lerp(secondary, t);
          specCtx.fillStyle = `rgba(${Math.floor(col.r * 255)}, ${Math.floor(col.g * 255)}, ${Math.floor(col.b * 255)}, ${0.25 + v * 0.6})`;
          specCtx.fillRect(i * barW, specCanvas.height - h, barW - 1, h);
        }
      }
      
      const camState = {
        angle: 0,
        targetAngle: 0,
        height: 0,
        targetHeight: 0,
        distance: config.cameraDistance,
        targetDistance: config.cameraDistance,
        look: new THREE.Vector3(),
        targetLook: new THREE.Vector3(),
        roll: 0,
        targetRoll: 0,
        appliedRoll: 0,
        autoMode: config.cameraMode,
        autoAngleOffset: 0,
        autoAngleOffsetTarget: 0,
        autoHeightBias: 0,
        autoHeightBiasTarget: 0,
        autoRoll: 0,
        autoRollTarget: 0,
        shake: new THREE.Vector3(),
        drunk: new THREE.Vector3(),
      };

      let beatPulse = 0,
        _lastFrameTime = 0,
        _animationTime = 0,
        _lastFFTUpdate = 0,
        modelSpin = 0;
      
      const getFFTInterval = () => 1000 / (60 - config.smoothness * 30); 
      const _pool = {
        tmp: new THREE.Vector3(),
        targetPos: new THREE.Vector3(),
        axisY: new THREE.Vector3(0, 1, 0),
        quat: new THREE.Quaternion(),
        vi: new THREE.Vector3(),
        vj: new THREE.Vector3(),
      };

      
      let presets = {};
      try {
        presets = JSON.parse(
          localStorage.getItem("geometricResonancePresets") || "{}",
        );
      } catch (e) {}
      window.openPresetModal = () => {
        document.getElementById("preset-modal").style.display = "block";
        renderPresetList();
      };
      window.closePresetModal = () => {
        document.getElementById("preset-modal").style.display = "none";
      };
      window.savePreset = () => {
        const name = document.getElementById("preset-name").value.trim();
        if (!name) return;
        presets[name] = JSON.parse(JSON.stringify(config));
        localStorage.setItem(
          "geometricResonancePresets",
          JSON.stringify(presets),
        );
        renderPresetList();
      };
      window.loadPreset = (name) => {
        if (!presets[name]) return;
        Object.assign(config, presets[name]);
        
        const setToggle = (id, on) => {
          const el = document.getElementById(id);
          if (el) el.classList.toggle("active", !!on);
        };
        const setVal = (id, v) => {
          const el = document.getElementById(id);
          if (el && typeof v !== "undefined" && v !== null) el.value = v;
        };

        
        setVal("form", config.form);
        setVal("colorTheme", config.colorTheme);
        setVal("cameraMode", config.cameraMode);
        setVal("particleMode", config.particleMode);
        setVal("trailMode", config.trailMode);
        setVal("environment", config.environment);
        setVal("bgPattern", config.bgPattern);

        
        setToggle("toggleModelSpin", config.modelSpinEnabled);
        setToggle("toggleModelSpinReactive", config.modelSpinReactive);
        setToggle("toggleModelPulse", config.modelPulseEnabled);
        setVal("modelSpinSpeed", config.modelSpinSpeed);
        setVal("modelSpinAxis", config.modelSpinAxis);
        setVal("modelSpinReactivity", config.modelSpinReactivity);
        setVal("modelPulseAmount", config.modelPulseAmount);

        applyColorTheme();
        setBgPatternFromConfig();
        updateTrailMode();
        buildMainGeometry();
        buildRings();
        buildEnvironment();
        buildShockwaves();
        buildLightRays();
        buildAurora();
        buildEnergyField();
        buildOrbitals();
        scene.fog.density = config.fogDensity;
        camera.fov = config.cameraFov;
        camera.updateProjectionMatrix();
        closePresetModal();
      };
      window.deletePreset = (name) => {
        delete presets[name];
        localStorage.setItem(
          "geometricResonancePresets",
          JSON.stringify(presets),
        );
        renderPresetList();
      };
      function renderPresetList() {
        const list = document.getElementById("preset-list");
        list.innerHTML = "";
        Object.keys(presets).forEach((name) => {
          const item = document.createElement("div");
          item.style.cssText =
            "padding:10px;background:rgba(255,255,255,0.03);border-radius:8px;margin-bottom:8px;cursor:pointer;color:rgba(255,255,255,0.7);display:flex;justify-content:space-between;";
          item.innerHTML = `<span onclick="loadPreset('${name}')">${name}</span><span style="color:rgba(255,100,100,0.6);cursor:pointer;" onclick="deletePreset('${name}')">✕</span>`;
          list.appendChild(item);
        });
      }

      function randomize() {
        const forms = [
          "icosahedron",
          "octahedron",
          "dodecahedron",
          "torus",
          "torusKnot",
          "sphere",
          "mobius",
          "gyroid",
          "hopfFibration",
          "seashell",
        ];
        const themes = Object.keys(colorThemes);
        const cameras = [
          "orbit",
          "reactive",
          "cinematic",
          "spiral",
          "figure8",
          "vortex",
          "pendulum",
        ];
        const particles = [
          "vertex",
          "swarm",
          "explode",
          "orbital",
          "magnetic",
          "wave",
          "vortex",
          "aurora",
        ];
        const trails = ["none", "light", "medium", "heavy", "smear"];
        const envs = ["void", "stars", "nebula", "grid"];
        const patterns = [
          "none",
          "mandala",
          "lattice",
          "plasma",
          "voronoi",
          "waves",
        ];

        config.form = forms[Math.floor(Math.random() * forms.length)];
        config.density = Math.floor(Math.random() * 4) + 1;
        config.colorTheme = themes[Math.floor(Math.random() * themes.length)];
        config.cameraMode = cameras[Math.floor(Math.random() * cameras.length)];
        config.particleMode =
          particles[Math.floor(Math.random() * particles.length)];
        config.trailMode = trails[Math.floor(Math.random() * trails.length)];
        config.environment = envs[Math.floor(Math.random() * envs.length)];
        config.bgPattern =
          patterns[Math.floor(Math.random() * patterns.length)];
        config.symmetry = [3, 4, 6, 8, 12][Math.floor(Math.random() * 5)];
        config.sensitivity = 0.6 + Math.random() * 1.8;
        config.turbulence = Math.random() * 1.5;
        config.bloomStrength = 0.4 + Math.random() * 1.2;
        config.cameraSpeed = 0.3 + Math.random() * 1.2;
        config.cameraShake = Math.random() * 1.0;
        config.bgPatternStrength = 0.1 + Math.random() * 0.5;
        config.showLightRays = Math.random() > 0.7;
        config.showAurora = Math.random() > 0.7;
        config.showEnergyField = Math.random() > 0.8;
        config.showOrbitals = Math.random() > 0.7;

        applyColorTheme();
        setBgPatternFromConfig();
        updateTrailMode();
        buildMainGeometry();
        buildRings();
        buildEnvironment();
        buildShockwaves();
        buildLightRays();
        buildAurora();
        buildEnergyField();
        buildOrbitals();

        document.getElementById("form").value = config.form;
        document.getElementById("colorTheme").value = config.colorTheme;
        document.getElementById("cameraMode").value = config.cameraMode;
        document.getElementById("particleMode").value = config.particleMode;
        document.getElementById("trailMode").value = config.trailMode;
        document.getElementById("environment").value = config.environment;
        document.getElementById("bgPattern").value = config.bgPattern;
      }
      
      function animate(timestamp) {
        requestAnimationFrame(animate);
        if (!timestamp) timestamp = performance.now();
        const rawDt = _lastFrameTime
          ? (timestamp - _lastFrameTime) / 1000
          : 0.016;
        const dt = Math.min(rawDt, 0.05);
        _lastFrameTime = timestamp;
        _animationTime += dt;
        const t = _animationTime;

        
        if (config.modelSpinEnabled) {
          modelSpin += dt * (0.24 * config.cameraSpeed * config.modelSpinSpeed); 
        }

        

        let isBeat = false;
        if (analyser && playing) {
          if (timestamp - _lastFFTUpdate >= getFFTInterval()) {
            _lastFFTUpdate = timestamp;
            analyser.getByteFrequencyData(freqData);
            analyser.getByteTimeDomainData(timeData);
          }
          
          const smoothingAlpha = 0.18 + config.smoothness * 0.15; 
          isBeat = audio.analyze(
            freqData,
            timeData,
            dt,
            null,
            null,
            smoothingAlpha,
          );

          
          motion.update(audio, dt, music.phase, config.smoothness);

          document.getElementById("bpm-display").textContent =
            `${audio.getBPM()} BPM`;
          document.getElementById("energy-display").textContent =
            `Energy: ${(audio.energy * 100).toFixed(0)}%`;
          document.getElementById("bar-display").textContent =
            `Bar: ${audio.barCount}`;
          document.getElementById("note-display").textContent =
            `Note: ${audio.noteName}`;
        }
        updateMusicClock(dt);

        if (config.hueRotateSpeed > 0) {
          palette.globalHueShift += dt * config.hueRotateSpeed * 0.1;
          palette.globalHueShift = fract(palette.globalHueShift);
        }

        if (audio.barCount !== music.lastSeenBar) {
          music.lastSeenBar = audio.barCount;
          if (config.barLockColors)
            palette.hOffsetTarget = (hash1(audio.barCount * 0.97) - 0.5) * 0.1;
          if (
            config.cameraAutoAngles &&
            audio.barCount > 0 &&
            audio.barCount % 16 === 0
          ) {
            const modes = [
              "orbit",
              "reactive",
              "cinematic",
              "spiral",
              "figure8",
              "vortex",
              "pendulum",
            ];
            camState.autoMode = modes[Math.floor(Math.random() * modes.length)];
            camState.autoAngleOffsetTarget =
              (Math.random() * 2 - 1) * (Math.PI * 0.45);
            camState.autoHeightBiasTarget = (Math.random() * 2 - 1) * 7.0;
            camState.autoRollTarget = (Math.random() * 2 - 1) * (Math.PI / 18);
          }
        }
        palette.hOffset = lerp(
          palette.hOffset,
          palette.hOffsetTarget,
          dt * 0.8,
        );

        const {
          smoothSubBass,
          smoothBass,
          smoothLowMid,
          smoothMid,
          smoothHighMid,
          smoothHigh,
          smoothBrilliance,
          spectralCentroid,
          spectralFlux,
          energy,
          transientSharpness,
          onsetSnare,
          onsetHihat,
        } = audio;
        const phase = music.phase;
        const sens = config.sensitivity;
        const symN = config.symmetry;

        
        
        beatPulse = motion.pulse;

        
        
        if (config.showShockwaves) {
          const canSpawn = t - shockState.lastTime > config.shockwaveCooldown;
          const strongTransient =
            motion.impact > config.shockwaveImpactThreshold;
          if (canSpawn && (isBeat || strongTransient)) {
            shockState.lastTime = t;
            const col = getHarmonizedColor(energy, 0.5);
            spawnShockwave(col, isBeat ? 1.0 : 0.75);
          }
        }

        
        bgUniforms.uTime.value = t;
        bgUniforms.uPhase.value = phase;
        bgUniforms.uSymmetry.value = symN;
        bgUniforms.uEnergy.value = motion.swell; 
        bgUniforms.uBass.value = motion.lowMotion;
        bgUniforms.uMid.value = motion.midMotion;
        bgUniforms.uHigh.value = motion.highMotion;
        bgUniforms.uNegative.value = config.negativeSpace ? 1.0 : 0.0;
        bgUniforms.uBeatPulse.value = motion.pulse;
        bgUniforms.uReactiveBg.value = config.reactiveBg ? 1.0 : 0.0;
        bgUniforms.uPatternStrength.value = config.bgPatternStrength;

        
        if (wireframeMesh && particleSystem) {
          const rotBase = 0.55 * config.cameraSpeed;

          
          
          
          
          const react = config.modelSpinReactive
            ? config.modelSpinReactivity
            : 0;
          const baseY = modelSpin;
          const baseX = modelSpin * 0.455;
          const baseZ = modelSpin * 0.273;

          const centroidFactor = lerp(
            1.0,
            0.85 + 0.35 * spectralCentroid,
            react,
          );

          let rotY = baseY + motion.midMotion * 0.06 * react;
          let rotX = baseX * centroidFactor;
          let rotZ = baseZ + motion.highMotion * 0.04 * react;

          if (config.modelSpinAxis === "y") {
            rotX = 0;
            rotZ = 0;
          }

          wireframeMesh.rotation.y = rotY;
          wireframeMesh.rotation.x = rotX;
          wireframeMesh.rotation.z = rotZ;

          
          const targetScale = motion.scaleSuggestion * (0.95 + sens * 0.05);
          const pulseAmt = config.modelPulseEnabled
            ? config.modelPulseAmount
            : 0;
          const meshScale = lerp(1.0, targetScale, pulseAmt);
          wireframeMesh.scale.setScalar(meshScale);

          wireframeMesh.material.opacity = config.negativeSpace
            ? 0.12
            : 0.22 + motion.swell * 0.42;
          wireframeMesh.material.color.copy(
            config.negativeSpace
              ? new THREE.Color(0x080808)
              : getHarmonizedColor(motion.swell, 0.5),
          );

          if (rimMesh) {
            rimMesh.visible = config.negativeSpace;
            rimMesh.rotation.copy(wireframeMesh.rotation);
            rimMesh.scale.copy(wireframeMesh.scale);
            rimMesh.material.uniforms.uColor.value.copy(
              getHarmonizedColor(motion.swell, 0.5),
            );
            rimMesh.material.uniforms.uTime.value = t;
          }

          
          const pos = particleSystem.geometry.attributes.position.array;
          const col = particleSystem.geometry.attributes.color.array;
          const sizes = particleSystem.geometry.attributes.size.array;
          const pMode = config.particleMode;
          const turb = config.turbulence;
          const cohe = config.cohesion;
          const { tmp, targetPos } = _pool;

          
          const noiseOffset = t * 0.15;

          
          const particlePulse = motion.pulse;
          const particleImpact = motion.impact;

          for (let i = 0; i < vertexData.length; i++) {
            const vd = vertexData[i];
            
            const freqVal = clamp(audio.getBand(vd.band) * 1.2 * sens, 0, 1.5);
            const onset = audio.getOnset(vd.band) * 0.6; 
            const thetaSym = foldTheta(vd.theta, symN);

            
            let disp = 1.0;

            if (config.fieldMode === "harmonic") {
              const h1 = Math.sin(thetaSym + 2.0 * vd.phi + phase * 0.04);
              const h2 = Math.sin(
                2.0 * thetaSym - 3.0 * vd.phi + phase * 0.028,
              );
              
              disp =
                1.0 +
                freqVal * 0.5 * h1 +
                motion.lowMotion * 0.4 * h2 +
                particlePulse * 0.15 +
                onset * 0.08;
            } else if (config.fieldMode === "curl") {
              const noiseVal = gradNoise(
                vd.base.x * 0.08 + noiseOffset,
                vd.base.y * 0.08,
                vd.base.z * 0.08 + t * 0.1,
              );
              disp =
                1 +
                freqVal * 0.45 +
                onset * 0.25 +
                noiseVal * 0.2 * turb +
                particlePulse * 0.18;
            } else if (config.fieldMode === "spiral") {
              const spiralWave = Math.sin(
                thetaSym + phase * 0.18 + motion.lowMotion * 2.0,
              );
              disp =
                1 +
                freqVal * 0.45 +
                onset * 0.25 +
                spiralWave * 0.22 * sens +
                particlePulse * 0.18;
            } else {
              const noiseVal = gradNoise(
                vd.base.x * 0.12 + noiseOffset,
                vd.base.y * 0.12,
                vd.base.z * 0.12,
              );
              disp =
                1 +
                freqVal * 0.55 +
                onset * 0.35 +
                noiseVal * 0.25 * turb +
                particlePulse * 0.2;
            }
            disp = clamp(disp, 0.7, 2.2);

            targetPos.copy(vd.base).multiplyScalar(disp);

            if (pMode === "swarm") {
              const swarmIntensity = turb * freqVal * 1.0;
              targetPos.x += Math.cos(thetaSym + phase * 0.18) * swarmIntensity;
              targetPos.y +=
                Math.sin(vd.phi + phase * 0.14) * swarmIntensity * 0.7;
              targetPos.z += Math.sin(thetaSym - phase * 0.16) * swarmIntensity;
            } else if (pMode === "explode") {
              tmp.copy(vd.base).normalize();
              
              const explodeForce =
                (particlePulse * 0.8 + particleImpact * 0.5) * 5 * sens;
              targetPos.addScaledVector(tmp, explodeForce);
            } else if (pMode === "orbital") {
              const ang = phase * 0.25 + vd.phase + freqVal * 2.0;
              const r = vd.base.length() * (1 + freqVal * 0.3 * sens);
              targetPos.set(
                Math.cos(ang) * r,
                vd.base.y * (1 + motion.midMotion * 0.35),
                Math.sin(ang) * r,
              );
            } else if (pMode === "magnetic") {
              
              const attractorY = (motion.lowMotion - motion.highMotion) * 6;
              const attractorStrength = motion.swell * 0.12 * sens;
              tmp.set(0, attractorY, 0).sub(vd.current);
              const dist = Math.max(tmp.length(), 0.5);
              targetPos.addScaledVector(
                tmp.normalize(),
                attractorStrength / (dist * 0.08),
              );
              targetPos.x +=
                Math.sin(phase * 0.2 + vd.phase) * motion.midMotion * 1.2;
              targetPos.z +=
                Math.cos(phase * 0.2 + vd.phase) * motion.midMotion * 1.2;
            } else if (pMode === "wave") {
              
              const wave1 =
                Math.sin(thetaSym + phase * 0.35) * motion.lowMotion * 2.5;
              const wave2 =
                Math.sin(thetaSym * 2 + phase * 0.5 + Math.PI / 3) *
                motion.midMotion *
                1.2;
              const wave3 =
                Math.sin(thetaSym * 3 + phase * 0.7) * motion.highMotion * 0.6;
              targetPos.y += (wave1 + wave2 + wave3) * sens;
            } else if (pMode === "vortex") {
              const vAng = phase * 0.35 + vd.phase;
              const vR = vd.base.length() * (1 + motion.lowMotion * 0.2);
              targetPos.x = Math.cos(vAng + thetaSym * 0.5) * vR;
              targetPos.z = Math.sin(vAng + thetaSym * 0.5) * vR;
              targetPos.y =
                vd.base.y * (1 + motion.midMotion * 0.25) +
                motion.highMotion * 3 * Math.sin(vAng * 2);
            } else if (pMode === "aurora") {
              const aWave1 =
                Math.sin(vd.base.x * 0.15 + phase * 0.12) *
                Math.cos(vd.base.z * 0.15 + phase * 0.08);
              const aWave2 =
                Math.sin(vd.base.x * 0.25 + phase * 0.18 + Math.PI / 4) *
                motion.highMotion;
              targetPos.y +=
                (aWave1 * motion.midMotion * 3.0 + aWave2 * 1.2) * sens;
              targetPos.x +=
                Math.sin(phase * 0.08 + vd.base.y * 0.1) *
                motion.lowMotion *
                0.6;
            }

            
            tmp.copy(targetPos).sub(vd.current);

            
            const effectiveCohesion = cohe * (0.4 - config.smoothness * 0.15); 
            vd.velocity.add(tmp.multiplyScalar(effectiveCohesion));

            
            const damping = 0.92 + config.smoothness * 0.05; 
            vd.velocity.multiplyScalar(damping);

            
            const maxVel = 2.0 - config.smoothness * 1.0; 
            const velMag = vd.velocity.length();
            if (velMag > maxVel) {
              vd.velocity.multiplyScalar(maxVel / velMag);
            }

            vd.current.addScaledVector(vd.velocity, dt);

            pos[i * 3] = vd.current.x;
            pos[i * 3 + 1] = vd.current.y;
            pos[i * 3 + 2] = vd.current.z;

            
            const colorEnergy = freqVal + onset * 0.3;
            const colorPhase = fract(thetaSym / TAU + spectralCentroid * 0.25);
            const c = getHarmonizedColor(colorEnergy, colorPhase);
            const brightness = clamp(
              0.35 + freqVal * 0.45 + motion.pulse * 0.15,
              0.15,
              1.0,
            );
            col[i * 3] = c.r * brightness;
            col[i * 3 + 1] = c.g * brightness;
            col[i * 3 + 2] = c.b * brightness;

            
            const baseSize = 0.12 + freqVal * 0.14;
            const pulseSize = motion.pulse * 0.25;
            sizes[i] = baseSize * (1 + pulseSize);
          }

          particleSystem.geometry.attributes.position.needsUpdate = true;
          particleSystem.geometry.attributes.color.needsUpdate = true;
          particleSystem.geometry.attributes.size.needsUpdate = true;
          particleSystem.rotation.copy(wireframeMesh.rotation);
          particleSystem.scale.copy(wireframeMesh.scale);
          particleSystem.material.uniforms.uTime.value = t;
          particleSystem.material.uniforms.uEnergy.value = motion.swell;
          particleSystem.material.uniforms.uSizeMult.value =
            config.particleSizeMult;
          particleSystem.material.uniforms.uBrightness.value =
            config.particleBrightness;
        }

        
        if (
          connectionLines &&
          config.showConnections &&
          vertexData.length > 1
        ) {
          const linePos = connectionLines.geometry.attributes.position.array;
          const lineCol = connectionLines.geometry.attributes.color.array;
          let lineIdx = 0;
          
          const maxDist = 3.5 + motion.midMotion * 4.0 + motion.pulse * 2.0;
          _pool.quat.setFromEuler(wireframeMesh.rotation);
          const scale = wireframeMesh.scale.x;
          const limit = Math.min(vertexData.length, 150);

          for (let i = 0; i < limit && lineIdx < linePos.length / 6; i++) {
            for (
              let j = i + 1;
              j < limit && lineIdx < linePos.length / 6;
              j++
            ) {
              _pool.vi
                .copy(vertexData[i].current)
                .multiplyScalar(scale)
                .applyQuaternion(_pool.quat);
              _pool.vj
                .copy(vertexData[j].current)
                .multiplyScalar(scale)
                .applyQuaternion(_pool.quat);
              const d = _pool.vi.distanceTo(_pool.vj);
              if (d < maxDist) {
                linePos[lineIdx * 6] = _pool.vi.x;
                linePos[lineIdx * 6 + 1] = _pool.vi.y;
                linePos[lineIdx * 6 + 2] = _pool.vi.z;
                linePos[lineIdx * 6 + 3] = _pool.vj.x;
                linePos[lineIdx * 6 + 4] = _pool.vj.y;
                linePos[lineIdx * 6 + 5] = _pool.vj.z;
                const bright =
                  clamp((maxDist - d) / maxDist, 0, 1) * 0.24 + 0.03;
                const c = getHarmonizedColor(energy, 0.5);
                lineCol[lineIdx * 6] = lineCol[lineIdx * 6 + 3] = c.r * bright;
                lineCol[lineIdx * 6 + 1] = lineCol[lineIdx * 6 + 4] =
                  c.g * bright;
                lineCol[lineIdx * 6 + 2] = lineCol[lineIdx * 6 + 5] =
                  c.b * bright;
                lineIdx++;
              }
            }
          }
          connectionLines.geometry.setDrawRange(0, lineIdx * 2);
          connectionLines.geometry.attributes.position.needsUpdate = true;
          connectionLines.geometry.attributes.color.needsUpdate = true;
        }

        
        if (innerMesh) {
          innerMesh.rotation.y = phase * 0.05;
          innerMesh.rotation.x = phase * 0.03;
          
          innerMesh.scale.setScalar(
            1 + motion.lowMotion * 0.25 + motion.pulse * 0.15,
          );
          innerMesh.material.color.copy(
            getHarmonizedColor(motion.lowMotion, 0.2),
          );
          innerMesh.material.opacity = 0.12 + motion.swell * 0.12;
        }
        if (outerMesh) {
          outerMesh.rotation.y = -phase * 0.02;
          outerMesh.rotation.z = phase * 0.015;
          outerMesh.scale.setScalar(
            1 + motion.lowMotion * 0.15 + motion.breathe * 0.08,
          );
          outerMesh.material.opacity = 0.03 + motion.swell * 0.03;
        }

        
        if (waveformRing && waveformRing.visible && timeData) {
          const wPos = waveformRing.geometry.attributes.position.array;
          const baseRadius = 12;
          const waveAmplitude = 3.5 * (1 + motion.swell * 0.4);

          for (let i = 0; i < 256; i++) {
            const ang = (i / 256) * TAU;
            const dataIdx = Math.floor((i * timeData.length) / 256);
            const sample = timeData[dataIdx] / 128 - 1;
            const prevSample = timeData[Math.max(0, dataIdx - 1)] / 128 - 1;
            const nextSample =
              timeData[Math.min(timeData.length - 1, dataIdx + 1)] / 128 - 1;
            const smoothedSample = (prevSample + sample * 2 + nextSample) / 4;

            const r = baseRadius + smoothedSample * waveAmplitude;
            wPos[i * 3] = Math.cos(ang) * r;
            wPos[i * 3 + 2] = Math.sin(ang) * r;
            wPos[i * 3 + 1] = smoothedSample * 0.4 * motion.highMotion;
          }
          waveformRing.geometry.attributes.position.needsUpdate = true;
          waveformRing.material.color.copy(
            getHarmonizedColor(motion.midMotion, 0.7),
          );
          waveformRing.material.opacity = 0.35 + motion.swell * 0.2;
        }

        
        freqBars.forEach((bar, idx) => {
          if (!bar.visible) return;
          const v = audio.getBand(idx);
          const peak = audio.bandPeaks[idx];
          const targetScale = 0.5 + v * 8 + (peak - v) * 1.5;
          bar.scale.y = lerp(bar.scale.y, targetScale, 0.25);
          bar.material.color.copy(getHarmonizedColor(v, idx / 64));
          bar.material.opacity = 0.35 + v * 0.45;
        });

        
        rings.forEach((ring, idx) => {
          ring.rotation.x =
            phase * 0.02 * (idx + 1) + (Math.PI / 2) * (idx % 2);
          ring.rotation.y = phase * 0.015 * (idx + 1);
          const bandVal = audio.getBand(idx * 8);
          ring.scale.setScalar(1 + bandVal * 0.3 + motion.pulse * 0.1);
          ring.material.color.copy(
            getHarmonizedColor(bandVal, idx / config.ringCount),
          );
          ring.material.opacity = 0.02 + bandVal * 0.025;
        });

        
        lightRays.forEach((ray, i) => {
          ray.rotation.z =
            ray.userData.baseAngle +
            t * ray.userData.speed * (1 + motion.lowMotion * 0.3);
          const intensity = 0.1 + motion.midMotion * 0.3 + motion.pulse * 0.15;
          ray.material.uniforms.uIntensity.value = intensity;
          ray.material.uniforms.uColor.value.copy(
            getHarmonizedColor(motion.midMotion, i / 12),
          );
        });

        
        if (auroraLayer) {
          auroraLayer.material.uniforms.uTime.value = t;
          auroraLayer.material.uniforms.uEnergy.value = motion.swell;
          auroraLayer.material.uniforms.uColorA.value.copy(
            new THREE.Color(config.colorPrimary),
          );
          auroraLayer.material.uniforms.uColorB.value.copy(
            new THREE.Color(config.colorSecondary),
          );
        }

        
        if (energyFieldMesh) {
          energyFieldMesh.material.uniforms.uTime.value = t;
          energyFieldMesh.material.uniforms.uEnergy.value = motion.swell;
          energyFieldMesh.material.uniforms.uColor.value.copy(
            getHarmonizedColor(motion.swell, 0.5),
          );
          energyFieldMesh.rotation.y = t * 0.1;
          energyFieldMesh.rotation.x = t * 0.05;
        }

        
        orbitalRings.forEach((ring, i) => {
          ring.rotation.x = t * ring.userData.speed;
          ring.rotation.z = t * ring.userData.speed * 0.7;
          ring.material.color.copy(getHarmonizedColor(motion.midMotion, i / 3));
          ring.material.opacity = 0.08 + motion.swell * 0.15;
        });

        
        shockwaves.forEach((s) => {
          if (!s.active) return;
          s.life -= dt * 1.8;
          if (s.life <= 0) {
            s.active = false;
            s.mesh.material.uniforms.uOpacity.value = 0;
            return;
          }
          
          s.mesh.quaternion.copy(camera.quaternion);
          s.mesh.scale.addScalar(dt * 22);
          s.mesh.material.uniforms.uOpacity.value =
            s.life * config.shockwaveIntensity * (s.strength || 1.0);
        });

        
        if (floatingParticles) {
          const fp = floatingParticles.geometry.attributes.position.array;
          const fc = floatingParticles.geometry.attributes.color.array;
          floatingData.forEach((fd, i) => {
            fd.theta += fd.speed * dt * 0.25;
            fd.phi += fd.speed * dt * 0.12;
            const bv = audio.getBand(fd.band);
            
            const rr = fd.r * (1 + bv * 0.2 + motion.swell * 0.1);
            fp[i * 3] = rr * Math.sin(fd.phi) * Math.cos(fd.theta);
            fp[i * 3 + 1] = rr * Math.sin(fd.phi) * Math.sin(fd.theta);
            fp[i * 3 + 2] = rr * Math.cos(fd.phi);
            const c = getHarmonizedColor(bv * 0.7, fd.band / 64);
            fc[i * 3] = c.r;
            fc[i * 3 + 1] = c.g;
            fc[i * 3 + 2] = c.b;
          });
          floatingParticles.geometry.attributes.position.needsUpdate = true;
          floatingParticles.geometry.attributes.color.needsUpdate = true;
        }

        
        envObjects.forEach((obj) => {
          if (obj.userData && obj.userData.rotSpeed) {
            obj.rotation.y += obj.userData.rotSpeed;
            obj.rotation.x += obj.userData.rotSpeed * 0.5;
          }
        });
        
        
        const mode = config.autoPilot ? camState.autoMode : config.cameraMode;
        const cSpeed = config.cameraSpeed;
        const cShake = config.cameraShake;

        camState.autoAngleOffset = lerp(
          camState.autoAngleOffset,
          camState.autoAngleOffsetTarget,
          dt * 0.5,
        );
        camState.autoHeightBias = lerp(
          camState.autoHeightBias,
          camState.autoHeightBiasTarget,
          dt * 0.5,
        );
        camState.autoRoll = lerp(
          camState.autoRoll,
          camState.autoRollTarget,
          dt * 0.3,
        );

        
        const camPhase = t * 2.0; 
        switch (mode) {
          case "orbit":
            camState.targetAngle =
              camPhase * 0.08 * cSpeed + camState.autoAngleOffset;
            camState.targetHeight =
              Math.sin(camPhase * 0.04 * cSpeed) * 8 + camState.autoHeightBias;
            camState.targetDistance = config.cameraDistance;
            break;
          case "reactive":
            
            camState.targetAngle =
              camPhase * 0.06 * cSpeed +
              motion.swell * 0.3 +
              camState.autoAngleOffset;
            camState.targetHeight =
              motion.midMotion * 6 - 1 + camState.autoHeightBias;
            camState.targetDistance = config.cameraDistance - motion.swell * 4;
            camState.targetRoll = (motion.highMotion - 0.3) * 0.08;
            break;
          case "cinematic":
            camState.targetAngle =
              Math.sin(camPhase * 0.02 * cSpeed) * 1.2 +
              camState.autoAngleOffset;
            camState.targetHeight =
              Math.cos(camPhase * 0.015 * cSpeed) * 6 +
              2 +
              camState.autoHeightBias;
            camState.targetDistance =
              config.cameraDistance + Math.sin(camPhase * 0.01) * 5;
            break;
          case "spiral":
            camState.targetAngle =
              camPhase * 0.12 * cSpeed + camState.autoAngleOffset;
            camState.targetHeight =
              Math.sin(camPhase * 0.08 * cSpeed) * 12 + camState.autoHeightBias;
            camState.targetDistance =
              config.cameraDistance + Math.cos(camPhase * 0.06) * 8;
            break;
          case "figure8":
            camState.targetAngle =
              Math.sin(camPhase * 0.05 * cSpeed) * 1.5 +
              camState.autoAngleOffset;
            camState.targetHeight =
              Math.sin(camPhase * 0.1 * cSpeed) *
                Math.cos(camPhase * 0.05 * cSpeed) *
                10 +
              camState.autoHeightBias;
            camState.targetDistance = config.cameraDistance;
            break;
          case "vortex":
            
            camState.targetAngle =
              camPhase * 0.15 * cSpeed +
              motion.swell * 0.8 +
              camState.autoAngleOffset;
            camState.targetHeight =
              motion.highMotion * 5 + camState.autoHeightBias;
            camState.targetDistance = config.cameraDistance - motion.swell * 6;
            camState.targetRoll = camPhase * 0.02 * cSpeed;
            break;
          case "pendulum":
            camState.targetAngle =
              Math.sin(camPhase * 0.04 * cSpeed) * 2 + camState.autoAngleOffset;
            camState.targetHeight =
              Math.abs(Math.sin(camPhase * 0.04 * cSpeed)) * 15 -
              5 +
              camState.autoHeightBias;
            camState.targetDistance = config.cameraDistance;
            break;
          case "flythrough":
            camState.targetAngle =
              camPhase * 0.1 * cSpeed + camState.autoAngleOffset;
            camState.targetHeight =
              Math.sin(camPhase * 0.05 * cSpeed) * 5 + camState.autoHeightBias;
            camState.targetDistance =
              config.cameraDistance + Math.sin(camPhase * 0.08 * cSpeed) * 15;
            break;
          case "drunk":
            camState.drunk.x = lerp(
              camState.drunk.x,
              (Math.random() - 0.5) * 0.8,
              dt * 0.5,
            );
            camState.drunk.y = lerp(
              camState.drunk.y,
              (Math.random() - 0.5) * 0.6,
              dt * 0.5,
            );
            camState.drunk.z = lerp(
              camState.drunk.z,
              (Math.random() - 0.5) * 0.4,
              dt * 0.5,
            );
            camState.targetAngle =
              camPhase * 0.05 * cSpeed +
              camState.drunk.x +
              camState.autoAngleOffset;
            camState.targetHeight =
              camState.drunk.y * 10 + camState.autoHeightBias;
            camState.targetDistance =
              config.cameraDistance + camState.drunk.z * 10;
            camState.targetRoll = camState.drunk.z * 0.3 + camState.autoRoll;
            break;
        }

        
        if (config.cameraBeatZoom) {
          camState.targetDistance += motion.zoomSuggestion * 8;
        }

        
        
        const camLerpBase = 1.8 - config.smoothness * 1.0; 
        const camLerpSlow = camLerpBase * 0.8;

        camState.angle = lerp(
          camState.angle,
          camState.targetAngle,
          dt * camLerpBase,
        );
        camState.height = lerp(
          camState.height,
          camState.targetHeight,
          dt * camLerpSlow,
        );
        camState.distance = lerp(
          camState.distance,
          camState.targetDistance,
          dt * camLerpSlow,
        );
        camState.roll = lerp(
          camState.roll,
          camState.targetRoll + camState.autoRoll,
          dt * camLerpSlow * 0.8,
        );
        camState.look.lerp(camState.targetLook, dt * camLerpSlow);

        
        const shakeMultiplier = 1.0 - config.smoothness * 0.9; 
        if (cShake > 0 && shakeMultiplier > 0.05) {
          const shakeAmt = motion.impact * cShake * 0.12 * shakeMultiplier;
          
          const shakeLerp = dt * (3.0 - config.smoothness * 2.0); 
          camState.shake.x = lerp(
            camState.shake.x,
            (Math.random() - 0.5) * shakeAmt,
            shakeLerp,
          );
          camState.shake.y = lerp(
            camState.shake.y,
            (Math.random() - 0.5) * shakeAmt,
            shakeLerp,
          );
          camState.shake.z = lerp(
            camState.shake.z,
            (Math.random() - 0.5) * shakeAmt * 0.2,
            shakeLerp,
          );
        } else {
          
          camState.shake.multiplyScalar(0.95);
        }

        camera.position.x =
          Math.cos(camState.angle) * camState.distance + camState.shake.x;
        camera.position.y = camState.height + camState.shake.y;
        camera.position.z =
          Math.sin(camState.angle) * camState.distance + camState.shake.z;
        camera.lookAt(camState.look);
        camState.appliedRoll = lerp(
          camState.appliedRoll,
          camState.roll,
          dt * 2,
        );
        camera.rotation.z = camState.appliedRoll;

        
        bloomPass.strength = config.bloomStrength * (1 + motion.pulse * 0.2);
        bloomPass.radius = config.bloomRadius;
        screenFXPass.uniforms.uTime.value = t;
        screenFXPass.uniforms.uVignette.value = config.vignette;
        screenFXPass.uniforms.uGrain.value = config.grain;
        screenFXPass.uniforms.uAberration.value = config.aberration;
        screenFXPass.uniforms.uHigh.value = motion.highMotion;
        screenFXPass.uniforms.uAnamorphic.value = config.anamorphic;
        screenFXPass.uniforms.uScanlines.value = config.scanlines;
        screenFXPass.uniforms.uBeatPulse.value = config.beatFlash
          ? motion.pulse
          : 0;
        screenFXPass.uniforms.uGlitch.value =
          config.glitchAmount * (1 + motion.impact * 0.5);
        screenFXPass.uniforms.uKaleidoscope.value =
          config.visualMode === "kaleidoscope" ? 1.0 : 0.0;
        screenFXPass.uniforms.uKaleidoscopeSegments.value = config.symmetry;
        screenFXPass.uniforms.uNegative.value = config.negativeSpace
          ? 1.0
          : 0.0;
        const filmMap = {
          none: 0,
          cinematic: 1,
          vintage: 2,
          neon: 3,
          dream: 4,
        };
        screenFXPass.uniforms.uFilmLook.value = filmMap[config.filmLook] || 0;

        drawSpectrum();
        composer.render();
      }

      animate();
      
      document.querySelectorAll(".tab").forEach((tab) => {
        tab.addEventListener("click", () => {
          document
            .querySelectorAll(".tab")
            .forEach((t) => t.classList.remove("active"));
          document
            .querySelectorAll(".settings-panel")
            .forEach((p) => p.classList.remove("active"));
          tab.classList.add("active");
          document
            .querySelector(`.settings-panel[data-panel="${tab.dataset.tab}"]`)
            .classList.add("active");
        });
      });

      document.querySelectorAll(".toggle").forEach((toggle) => {
        toggle.addEventListener("click", () =>
          toggle.classList.toggle("active"),
        );
      });

      
      const _psm = document.getElementById("particleSizeMult");
      if (_psm) _psm.value = config.particleSizeMult;
      const _pbr = document.getElementById("particleBrightness");
      if (_pbr) _pbr.value = config.particleBrightness;
      const _swi = document.getElementById("shockwaveIntensity");
      if (_swi) _swi.value = config.shockwaveIntensity;
      const _swt = document.getElementById("shockwaveImpactThreshold");
      if (_swt) _swt.value = config.shockwaveImpactThreshold;
      const _swc = document.getElementById("shockwaveCooldown");
      if (_swc) _swc.value = config.shockwaveCooldown;

      document.getElementById("form").addEventListener("change", (e) => {
        config.form = e.target.value;
        buildMainGeometry();
      });
      document.getElementById("density").addEventListener("input", (e) => {
        config.density = parseInt(e.target.value);
        buildMainGeometry();
      });
      document.getElementById("sensitivity").addEventListener("input", (e) => {
        config.sensitivity = parseFloat(e.target.value);
      });
      document.getElementById("smoothness").addEventListener("input", (e) => {
        config.smoothness = parseFloat(e.target.value);
      });
      document.getElementById("volume").addEventListener("input", (e) => {
        config.volume = parseFloat(e.target.value);
        if (gainNode) gainNode.gain.value = config.volume;
      });
      document.getElementById("visualMode").addEventListener("change", (e) => {
        config.visualMode = e.target.value;
      });

      
      document
        .getElementById("modelSpinSpeed")
        .addEventListener("input", (e) => {
          config.modelSpinSpeed = parseFloat(e.target.value);
        });
      document
        .getElementById("modelSpinAxis")
        .addEventListener("change", (e) => {
          config.modelSpinAxis = e.target.value;
        });
      document
        .getElementById("modelSpinReactivity")
        .addEventListener("input", (e) => {
          config.modelSpinReactivity = parseFloat(e.target.value);
        });
      document
        .getElementById("modelPulseAmount")
        .addEventListener("input", (e) => {
          config.modelPulseAmount = parseFloat(e.target.value);
        });

      document
        .getElementById("toggleModelSpin")
        .addEventListener("click", (e) => {
          config.modelSpinEnabled = e.target.classList.contains("active");
        });
      document
        .getElementById("toggleModelSpinReactive")
        .addEventListener("click", (e) => {
          config.modelSpinReactive = e.target.classList.contains("active");
        });
      document
        .getElementById("toggleModelPulse")
        .addEventListener("click", (e) => {
          config.modelPulseEnabled = e.target.classList.contains("active");
        });

      document.getElementById("colorTheme").addEventListener("change", (e) => {
        config.colorTheme = e.target.value;
        applyColorTheme();
      });
      document.getElementById("colorPrimary").addEventListener("input", (e) => {
        config.colorPrimary = e.target.value;
        bgUniforms.uAccentA.value.set(config.colorPrimary);
      });
      document
        .getElementById("colorSecondary")
        .addEventListener("input", (e) => {
          config.colorSecondary = e.target.value;
          bgUniforms.uAccentB.value.set(config.colorSecondary);
        });
      document.getElementById("colorBg").addEventListener("input", (e) => {
        config.colorBg = e.target.value;
        scene.fog.color.set(config.colorBg);
        bgUniforms.uBgColor.value.set(config.colorBg);
      });
      document
        .getElementById("colorReactivity")
        .addEventListener("input", (e) => {
          config.colorReactivity = parseFloat(e.target.value);
        });
      document
        .getElementById("hueRotateSpeed")
        .addEventListener("input", (e) => {
          config.hueRotateSpeed = parseFloat(e.target.value);
        });
      document
        .getElementById("toggleBarLockColors")
        .addEventListener("click", (e) => {
          config.barLockColors = e.target.classList.contains("active");
        });

      document.getElementById("cameraMode").addEventListener("change", (e) => {
        config.cameraMode = e.target.value;
        camState.autoMode = e.target.value;
      });
      document
        .getElementById("cameraDistance")
        .addEventListener("input", (e) => {
          config.cameraDistance = parseFloat(e.target.value);
        });
      document.getElementById("cameraSpeed").addEventListener("input", (e) => {
        config.cameraSpeed = parseFloat(e.target.value);
      });
      document.getElementById("cameraShake").addEventListener("input", (e) => {
        config.cameraShake = parseFloat(e.target.value);
      });
      document.getElementById("cameraFov").addEventListener("input", (e) => {
        config.cameraFov = parseFloat(e.target.value);
        camera.fov = config.cameraFov;
        camera.updateProjectionMatrix();
      });
      document
        .getElementById("toggleBeatZoom")
        .addEventListener("click", (e) => {
          config.cameraBeatZoom = e.target.classList.contains("active");
        });
      document
        .getElementById("toggleAutoAngles")
        .addEventListener("click", (e) => {
          config.cameraAutoAngles = e.target.classList.contains("active");
        });

      document
        .getElementById("particleMode")
        .addEventListener("change", (e) => {
          config.particleMode = e.target.value;
        });
      document.getElementById("fieldMode").addEventListener("change", (e) => {
        config.fieldMode = e.target.value;
      });
      document.getElementById("symmetry").addEventListener("change", (e) => {
        config.symmetry = parseInt(e.target.value);
      });
      document.getElementById("turbulence").addEventListener("input", (e) => {
        config.turbulence = parseFloat(e.target.value);
      });
      document.getElementById("cohesion").addEventListener("input", (e) => {
        config.cohesion = parseFloat(e.target.value);
      });
      document
        .getElementById("particleCount")
        .addEventListener("change", (e) => {
          config.particleCount = parseInt(e.target.value);
          buildMainGeometry();
        });

      document.getElementById("toggleInner").addEventListener("click", (e) => {
        config.showInner = e.target.classList.contains("active");
        if (innerMesh) innerMesh.visible = config.showInner;
      });
      document.getElementById("toggleOuter").addEventListener("click", (e) => {
        config.showOuter = e.target.classList.contains("active");
        if (outerMesh) outerMesh.visible = config.showOuter;
      });
      document
        .getElementById("toggleWaveform")
        .addEventListener("click", (e) => {
          config.showWaveform = e.target.classList.contains("active");
          if (waveformRing) waveformRing.visible = config.showWaveform;
        });
      document.getElementById("toggleBars").addEventListener("click", (e) => {
        config.showBars = e.target.classList.contains("active");
        freqBars.forEach((b) => (b.visible = config.showBars));
      });
      document
        .getElementById("toggleConnections")
        .addEventListener("click", (e) => {
          config.showConnections = e.target.classList.contains("active");
          if (connectionLines) connectionLines.visible = config.showConnections;
        });
      document
        .getElementById("toggleParticles")
        .addEventListener("click", (e) => {
          config.showParticles = e.target.classList.contains("active");
          if (particleSystem) particleSystem.visible = config.showParticles;
        });
      document
        .getElementById("toggleShockwaves")
        .addEventListener("click", (e) => {
          config.showShockwaves = e.target.classList.contains("active");
          shockwaves.forEach((s) => (s.mesh.visible = config.showShockwaves));
        });
      document
        .getElementById("toggleLightRays")
        .addEventListener("click", (e) => {
          config.showLightRays = e.target.classList.contains("active");
          buildLightRays();
        });
      document.getElementById("toggleAurora").addEventListener("click", (e) => {
        config.showAurora = e.target.classList.contains("active");
        buildAurora();
      });
      document
        .getElementById("toggleEnergyField")
        .addEventListener("click", (e) => {
          config.showEnergyField = e.target.classList.contains("active");
          buildEnergyField();
        });
      document
        .getElementById("toggleOrbitals")
        .addEventListener("click", (e) => {
          config.showOrbitals = e.target.classList.contains("active");
          buildOrbitals();
        });

      document
        .getElementById("bloomStrength")
        .addEventListener("input", (e) => {
          config.bloomStrength = parseFloat(e.target.value);
        });
      document.getElementById("bloomRadius").addEventListener("input", (e) => {
        config.bloomRadius = parseFloat(e.target.value);
      });
      document.getElementById("trailMode").addEventListener("change", (e) => {
        config.trailMode = e.target.value;
        updateTrailMode();
      });
      document.getElementById("glitchAmount").addEventListener("input", (e) => {
        config.glitchAmount = parseFloat(e.target.value);
      });
      document.getElementById("vignette").addEventListener("input", (e) => {
        config.vignette = parseFloat(e.target.value);
      });
      document.getElementById("grain").addEventListener("input", (e) => {
        config.grain = parseFloat(e.target.value);
      });
      document.getElementById("aberration").addEventListener("input", (e) => {
        config.aberration = parseFloat(e.target.value);
      });
      document.getElementById("anamorphic").addEventListener("input", (e) => {
        config.anamorphic = parseFloat(e.target.value);
      });
      document.getElementById("scanlines").addEventListener("input", (e) => {
        config.scanlines = parseFloat(e.target.value);
      });
      document.getElementById("filmLook").addEventListener("change", (e) => {
        config.filmLook = e.target.value;
      });

      document.getElementById("environment").addEventListener("change", (e) => {
        config.environment = e.target.value;
        buildEnvironment();
      });
      document.getElementById("fogDensity").addEventListener("input", (e) => {
        config.fogDensity = parseFloat(e.target.value);
        scene.fog.density = config.fogDensity;
      });
      document.getElementById("ringCount").addEventListener("input", (e) => {
        config.ringCount = parseInt(e.target.value);
        buildRings();
      });
      document.getElementById("bgPattern").addEventListener("change", (e) => {
        config.bgPattern = e.target.value;
        setBgPatternFromConfig();
      });
      document
        .getElementById("bgPatternStrength")
        .addEventListener("input", (e) => {
          config.bgPatternStrength = parseFloat(e.target.value);
        });

      document
        .getElementById("toggleSpectrum")
        .addEventListener("click", (e) => {
          config.showSpectrum = e.target.classList.contains("active");
        });
      document
        .getElementById("toggleAutoPilot")
        .addEventListener("click", (e) => {
          config.autoPilot = e.target.classList.contains("active");
        });
      document
        .getElementById("toggleBeatFlash")
        .addEventListener("click", (e) => {
          config.beatFlash = e.target.classList.contains("active");
        });
      document
        .getElementById("toggleColorCycle")
        .addEventListener("click", (e) => {
          config.colorCycle = e.target.classList.contains("active");
        });
      document
        .getElementById("toggleSynesthesia")
        .addEventListener("click", (e) => {
          config.synesthesia = e.target.classList.contains("active");
        });
      document
        .getElementById("toggleHarmonicSnap")
        .addEventListener("click", (e) => {
          config.harmonicSnap = e.target.classList.contains("active");
        });
      document
        .getElementById("toggleNegativeSpace")
        .addEventListener("click", (e) => {
          config.negativeSpace = e.target.classList.contains("active");
          if (rimMesh) rimMesh.visible = config.negativeSpace;
          wireframeMesh.material.blending = config.negativeSpace
            ? THREE.NormalBlending
            : THREE.AdditiveBlending;
        });
      document
        .getElementById("toggleReactiveBg")
        .addEventListener("click", (e) => {
          config.reactiveBg = e.target.classList.contains("active");
        });


      const playBtn = document.getElementById("playBtn");
      const playIcon = document.getElementById("playIcon");
      const pauseIcon = document.getElementById("pauseIcon");

      document.getElementById("file").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          initAudio();
          audioEl.src = URL.createObjectURL(file);
          audioEl.load();
        }
      });

      playBtn.addEventListener("click", () => {
        if (!audioEl.src) return;
        initAudio();
        if (audioCtx.state === "suspended") audioCtx.resume();
        if (audioEl.paused) {
          audioEl.play();
          playing = true;
          playIcon.style.display = "none";
          pauseIcon.style.display = "block";
        } else {
          audioEl.pause();
          playing = false;
          playIcon.style.display = "block";
          pauseIcon.style.display = "none";
        }
      });

      audioEl.addEventListener("ended", () => {
        playing = false;
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
      });

      let mediaRecorder,
        recordedChunks = [];
      document.getElementById("recordBtn").addEventListener("click", () => {
        if (mediaRecorder && mediaRecorder.state === "recording") {
          mediaRecorder.stop();
          document.getElementById("rec-indicator").classList.remove("active");
          return;
        }
        if (!mediaDest) initAudio();
        const canvasStream = renderer.domElement.captureStream(60);
        const audioStream = mediaDest.stream;
        const combined = new MediaStream([
          ...canvasStream.getTracks(),
          ...audioStream.getTracks(),
        ]);
        mediaRecorder = new MediaRecorder(combined, {
          mimeType: "video/webm; codecs=vp9",
          videoBitsPerSecond: 8000000,
        });
        recordedChunks = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "geometric_resonance_ultra.webm";
          a.click();
        };
        mediaRecorder.start();
        document.getElementById("rec-indicator").classList.add("active");
      });

      document.getElementById("randomBtn").addEventListener("click", randomize);
      document.getElementById("fullscreenBtn").addEventListener("click", () => {
        if (!document.fullscreenElement)
          document.documentElement.requestFullscreen();
        else document.exitFullscreen();
      });

      document.addEventListener("keydown", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT")
          return;
        switch (e.key.toLowerCase()) {
          case " ":
            e.preventDefault();
            playBtn.click();
            break;
          case "u":
            document.getElementById("ui").classList.toggle("hidden");
            break;
          case "r":
            randomize();
            break;
          case "f":
            document.getElementById("fullscreenBtn").click();
            break;
          case "p":
            openPresetModal();
            break;
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
            const tabs = document.querySelectorAll(".tab");
            const idx = parseInt(e.key) - 1;
            if (tabs[idx]) tabs[idx].click();
            break;
        }
      });

      window.addEventListener("resize", () => {
        const w = window.innerWidth,
          h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer.setSize(w, h);
        bloomPass.resolution.set(w, h);
        bgUniforms.uResolution.value.set(w, h);
        screenFXPass.uniforms.uResolution.value.set(w, h);
        specCanvas.width = w;
      });
