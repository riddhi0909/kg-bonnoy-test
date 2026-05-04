export default function Loading() {
  return (
    <div
      className="mx-auto w-full max-w-7xl px-4 py-10"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading page…</span>
      <div
        className="pointer-events-none mb-8 h-1 w-full overflow-hidden rounded-full bg-zinc-200"
        aria-hidden
      >
        <div className="h-full w-1/3 animate-pulse rounded-full bg-zinc-500/80 motion-reduce:animate-none" />
      </div>
      <div className="space-y-4">
        <div className="h-9 w-2/3 max-w-md animate-pulse rounded-md bg-zinc-200 motion-reduce:animate-none" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded-md bg-zinc-100 motion-reduce:animate-none" />
        <div className="h-4 w-5/6 max-w-lg animate-pulse rounded-md bg-zinc-100 motion-reduce:animate-none" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="aspect-[4/3] animate-pulse rounded-lg bg-zinc-100 motion-reduce:animate-none" />
          <div className="aspect-[4/3] animate-pulse rounded-lg bg-zinc-100 motion-reduce:animate-none" />
          <div className="aspect-[4/3] hidden animate-pulse rounded-lg bg-zinc-100 motion-reduce:animate-none lg:block" />
        </div>
      </div>
    </div>
  );
}
