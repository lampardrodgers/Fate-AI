// Build the FATE/AI promo video from the rendered card layers (promo/build/*.png) + the BGM.
// Usage:  node promo/extract-data.js && ./promo/render-cards.sh && node promo/make-video.js
// Output: promo/fate-ai-promo.mp4  (1920×1080, 30 fps, H.264 + AAC)
const {spawnSync} = require('child_process');
const fs = require('fs'), path = require('path');
const dir = __dirname, build = path.join(dir, 'build');
const BGM = path.join(dir, '..', 'assets', 'audio', 'bgm.m4a');
const OUT = path.join(dir, 'fate-ai-promo.mp4');
const FPS = 30;

// ---------- timeline ----------
// scene: [layer prefix, seconds, transition INTO the next scene]
const scenes = [
  ['epi', 8, 'fadewhite'],      // epigraph over the slow build-up
  ['logo', 8, 'fade'],          // logo lands on the big swell (song 1:11)
  ...Array.from({length: 10}, (_, i) => [`c${i}`, 5.6, i === 9 ? 'fadeblack' : 'smoothleft']),
  ['outro', 10, null],
];
const T = 0.7;                  // transition length
const HIT = 71;                 // song second of the swell
const MUSIC_START = HIT - (scenes[0][1] - T / 2);   // swell lands mid epi→logo flash
const ENDING_FROM = 197;        // jump to the song's last climax + natural decay for the outro
const XA = 2.5;                 // audio crossfade length

function ff(args, label){
  process.stdout.write(`· ${label}\n`);
  const r = spawnSync('ffmpeg', ['-v', 'error', '-y', ...args], {stdio: 'inherit'});
  if(r.status !== 0) throw new Error('ffmpeg failed: ' + label);
}

// ---------- pass 1: one clip per scene (slow push-in on bg, fg slides + fades in) ----------
const clips = scenes.map(([name, dur], k) => {
  const out = path.join(build, `clip-${String(k).padStart(2, '0')}.mp4`);
  const frames = Math.round(dur * FPS);
  const isChar = name.startsWith('c');
  const zoomTo = isChar ? 1.07 : 1.04;
  const slide = isChar ? 70 : 0;                 // px the text travels in from the right
  const fadeSt = name === 'epi' ? 0.6 : 0.25, fadeD = name === 'epi' ? 1.8 : 0.9;
  const ease = `pow(max(0\\,1-(t-${fadeSt})/1.1)\\,3)`;
  const filter =
    `[0:v]scale=3840:2160,zoompan=z='1+(${zoomTo}-1)*on/${frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=${FPS}[bg];` +
    `[1:v]format=rgba,fade=t=in:st=${fadeSt}:d=${fadeD}:alpha=1[fg];` +
    `[bg][fg]overlay=x='${slide}*${ease}':y=0:shortest=1,format=yuv420p[v]`;
  ff(['-loop', '1', '-framerate', FPS, '-t', dur, '-i', path.join(build, `${name}-bg.png`),
      '-loop', '1', '-framerate', FPS, '-t', dur, '-i', path.join(build, `${name}-fg.png`),
      '-filter_complex', filter, '-map', '[v]', '-frames:v', frames,
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-r', FPS, out].map(String), `clip ${name}`);
  return out;
});

// ---------- pass 2: xfade chain + music edit ----------
let fc = '', last = '[0:v]', acc = scenes[0][1];
for(let k = 1; k < scenes.length; k++){
  const trans = scenes[k - 1][2];
  const off = (acc - T).toFixed(3);
  const lbl = k === scenes.length - 1 ? '[vx]' : `[x${k}]`;
  fc += `${last}[${k}:v]xfade=transition=${trans}:duration=${T}:offset=${off}${lbl};`;
  last = lbl; acc = acc - T + scenes[k][1];
}
const total = acc;
const outroStart = total - scenes[scenes.length - 1][1];
const partA = outroStart + XA;                         // main segment runs into the outro
const partB = total - outroStart + 1;                  // ending segment length
const n = scenes.length;
fc += `[vx]fade=t=in:st=0:d=1,fade=t=out:st=${(total - 1.2).toFixed(2)}:d=1.2[v];`;
fc += `[${n}:a]atrim=start=${MUSIC_START}:duration=${partA},asetpts=PTS-STARTPTS[a1];`;
fc += `[${n + 1}:a]atrim=start=${ENDING_FROM}:duration=${partB},asetpts=PTS-STARTPTS[a2];`;
fc += `[a1][a2]acrossfade=d=${XA}:c1=tri:c2=tri,afade=t=in:st=0:d=1.5,afade=t=out:st=${(total - 3).toFixed(2)}:d=3,atrim=duration=${total}[a]`;

ff([...clips.flatMap(c => ['-i', c]), '-i', BGM, '-i', BGM,
    '-filter_complex', fc, '-map', '[v]', '-map', '[a]',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', OUT], 'final mix');

const mb = (fs.statSync(OUT).size / 1048576).toFixed(1);
console.log(`done → ${path.relative(process.cwd(), OUT)}  ${total.toFixed(1)}s  ${mb} MB  (music ${MUSIC_START}s→, ending from ${ENDING_FROM}s)`);
