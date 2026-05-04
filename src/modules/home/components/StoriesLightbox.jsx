"use client";

export function StoriesLightbox({
  isOpen,
  activeItem,
  storyItems,
  activeIndex,
  progressPct,
  profileAvatar,
  profileTitle,
  isMuted,
  isPaused,
  videoRef,
  closeLightbox,
  goPrev,
  goNext,
  togglePause,
  setIsMuted,
  setVideoError,
  setProgressPct,
}) {
  if (!isOpen || !activeItem) return null;

  return (
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        className="absolute inset-0 bg-[#001122]/50 backdrop-blur-[10px]"
        onClick={closeLightbox}
        aria-label="Fermer le lightbox"
      />

      <div className="relative mx-auto flex h-full w-full max-w-[440px] items-center justify-center px-3 py-4">
        <div className="relative h-full max-h-[92vh] w-full overflow-hidden rounded-[18px] bg-black">
          {activeItem.videoSrc && activeItem.videoSrc.includes("mp4") ? (
            <video
              key={activeItem.id}
              ref={videoRef}
              className="h-full w-full object-cover"
              src={activeItem.videoSrc}
              poster={activeItem.displaySrc || activeItem.src}
              autoPlay
              muted={isMuted}
              playsInline
              preload="metadata"
              onError={() => setVideoError(true)}
              onTimeUpdate={(event) => {
                const { currentTime, duration } = event.currentTarget;
                if (!duration || Number.isNaN(duration)) return;
                setProgressPct(Math.min(100, (currentTime / duration) * 100));
              }}
              onEnded={goNext}
            />
          ) : (
            <img
              src={activeItem.displaySrc || activeItem.src}
              alt={activeItem.caption}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          )}

          <div className="absolute left-3 right-3 top-3 z-30 flex gap-1.5">
            {storyItems.map((item, index) => {
              const barPct =
                index < activeIndex
                  ? 100
                  : index === activeIndex
                    ? progressPct
                    : 0;
              return (
                <span
                  key={item.id}
                  className="relative h-0.5 flex-1 overflow-hidden rounded bg-white/35"
                >
                  <span
                    className="absolute inset-y-0 left-0 bg-white"
                    style={{ width: `${barPct}%` }}
                  />
                </span>
              );
            })}
          </div>

          <div className="absolute left-3 right-3 top-7 z-30 mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={profileAvatar}
                alt={profileTitle}
                className="h-8 w-8 rounded-full border border-white/40 object-cover"
              />
              <p className="text-sm font-semibold text-white">{profileTitle}</p>
            </div>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#001122]/70 text-white cursor-pointer"
              onClick={closeLightbox}
              aria-label="Fermer"
            >
              ×
            </button>
          </div>

          <div className="absolute inset-y-0 left-0 z-20 w-1/2">
            <button
              type="button"
              className="h-full w-full cursor-pointer"
              onClick={goPrev}
              aria-label="Story precedente"
            />
          </div>
          <div className="absolute inset-y-0 right-0 z-20 w-1/2">
            <button
              type="button"
              className="h-full w-full cursor-pointer"
              onClick={goNext}
              aria-label="Story suivante"
            />
          </div>

          <div className="absolute bottom-4 left-3 right-3 z-30 flex items-center justify-between">
            <p className="max-w-[75%] text-xs text-white/90">{activeItem.caption}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#001122]/70 text-white cursor-pointer"
                onClick={togglePause}
                aria-label={isPaused ? "Reprendre" : "Pause"}
              >
                {isPaused ? "▶" : "II"}
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#001122]/70 text-white cursor-pointer"
                onClick={() => {
                  setIsMuted((prev) => !prev);
                  if (videoRef.current) {
                    videoRef.current.muted = !videoRef.current.muted;
                  }
                }}
                aria-label={isMuted ? "Activer le son" : "Couper le son"}
              >
                {isMuted ? "🔇" : "🔊"}
              </button>
            </div>
          </div>
        </div>

        {storyItems.length > 1 ? (
          <>
            {activeIndex > 0 ? (
              <button
                type="button"
                className="absolute -left-[30px] top-1/2 z-40 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#001122] backdrop-blur-sm transition-all hover:bg-[#001122] hover:text-white min-[768px]:flex"
                onClick={goPrev}
                aria-label="Story precedente"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                >
                  <path
                    d="M12.7072 6.35351L0.707154 6.35352M0.707154 6.35352L6.70715 12.3535M0.707154 6.35352L6.70715 0.353515"
                    stroke="currentColor"
                    strokeMiterlimit="10"
                  />
                </svg>
              </button>
            ) : null}

            {activeIndex < storyItems.length - 1 ? (
              <button
                type="button"
                className="absolute -right-[30px] top-1/2 z-40 hidden h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#001122] backdrop-blur-sm transition-all hover:bg-[#001122] hover:text-white min-[768px]:flex cursor-pointer"
                onClick={goNext}
                aria-label="Story suivante"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                >
                  <path
                    d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                    stroke="currentColor"
                    strokeMiterlimit="10"
                  />
                </svg>
              </button>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
