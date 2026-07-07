import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
          borderRadius: "112px",
          position: "relative",
        }}
      >
        {/* Dollar sign */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "240px",
            fontWeight: 800,
            fontFamily: "Inter, sans-serif",
            lineHeight: 1,
          }}
        >
          $
        </div>
        {/* Decorative circle */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "50px",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
