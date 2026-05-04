export function CenterVideoSection({ video, videoAlt }) {
  const iframeSrc = String(video ?? "").trim();
  if (!iframeSrc) return null;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
      <div className="">
        <figure className="relative mx-auto block w-full max-w-full overflow-hidden object-cover">
          <iframe
            src={iframeSrc}
            frameBorder="0"
            allowFullScreen
            className="absolute inset-0 m-auto inline-block h-full w-full border-0 object-cover z-50"
            title={String(videoAlt ?? "").trim() || "Center video"}
          />
          <span
            aria-hidden
            className="relative block w-full"
            style={{ paddingBottom: "56.27659574468085%" }}
          />
        </figure>
      </div>
    </div>
  );
}
