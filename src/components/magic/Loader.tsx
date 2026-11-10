/**
 * Intro loader: a breeze-block grid of circles resolves into a "KA" monogram,
 * then wipes away. Pure CSS (see globals.css) so it never blocks rendering;
 * hidden on repeat visits in a session, in calm mode, and for reduced motion.
 */

// 7 x 7 grid. 1 = filled (forms "K" and "A"), 2 = accent.
const MAP = [
  "0000000",
  "1010010",
  "1100101",
  "1000111",
  "1100101",
  "1010101",
  "0000002",
];

export function Loader() {
  const cells = MAP.join("").split("");
  return (
    <div className="loader" aria-hidden>
      <div className="flex flex-col items-center gap-8">
        <div className="loader-grid">
          {cells.map((c, i) => (
            <span
              key={i}
              className="loader-dot"
              data-on={c === "1" ? "1" : undefined}
              data-accent={c === "2" ? "1" : undefined}
              style={{ "--i": i } as React.CSSProperties}
            />
          ))}
        </div>
        <p className="loader-caption t-label text-stone">Kwabena Acheampong · Studio Archive</p>
      </div>
    </div>
  );
}

/** Runs before paint: skip the loader if already seen this session or in calm mode. */
export const loaderScript = `try{var d=document.documentElement;if(sessionStorage.getItem('ka-seen'))d.classList.add('ka-seen');else sessionStorage.setItem('ka-seen','1');var s=JSON.parse(localStorage.getItem('ka-studio-v1')||'{}');if(s.playMode===false)d.classList.add('ka-calm');}catch(e){}`;
