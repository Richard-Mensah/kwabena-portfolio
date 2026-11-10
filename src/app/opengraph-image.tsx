import { ImageResponse } from "next/og";

export const alt = "Kwabena Acheampong, Graphic Designer & Brand Strategy Creative";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const dots = Array.from({ length: 40 });
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F5F2EB", color: "#171717", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#5F5C56" }}>
            Independent Designer · Ghana
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 0.92 }}>
            <span>Kwabena</span>
            <span>Acheampong<span style={{ color: "#E64B32" }}>.</span></span>
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#171717" }}>Graphic Designer & Brand Strategy Creative</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", width: 300, alignContent: "center", gap: 16 }}>
          {dots.map((_, i) => (
            <div
              key={i}
              style={{ width: 44, height: 44, borderRadius: 999, background: i === 27 ? "#E64B32" : i % 3 === 0 ? "#171717" : "transparent", border: "3px solid #171717" }}
            />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
