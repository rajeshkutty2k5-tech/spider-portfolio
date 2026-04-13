// VideoBackground — fixed full-screen YouTube video backdrop
// Primary: rt-2cxAiPJk (Spider-Man: No Way Home teaser, Sony Pictures)
// Fallback: Tt5F0DQoWJA (Spider-Man: Brand New Day trailer, Sony Pictures Australia)
// Fixed behind all content, muted/autoplay/looped, dark overlay on top

export function VideoBackground() {
  const videoId = "rt-2cxAiPJk";
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}&enablejsapi=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1`;

  return (
    <>
      {/* Dark tint overlay — above video, below everything else */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.8) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* YouTube iframe — scaled to always fill + hide letterbox */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -2,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <iframe
          title="Background video"
          src={src}
          allow="autoplay; encrypted-media"
          frameBorder="0"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            /* Scale up enough to cover any viewport aspect ratio */
            width: "100vw",
            height: "56.25vw" /* 16/9 = 56.25% */,
            minHeight: "100vh",
            minWidth: "177.78vh" /* 100/56.25 */,
            transform: "translate(-50%, -50%) scale(1.15)",
            border: "none",
            pointerEvents: "none",
          }}
        />
      </div>
    </>
  );
}
