export default function BackgroundDecor() {
  return (
    // ADDED: bg-white dark:bg-[#0a0a0a] here to serve as the base layer
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden bg-white dark:bg-[#0a0a0a]">

      {/* Left Side Gradient */}
      <div className="absolute top-0 left-0 w-[30%] h-full bg-gradient-to-r from-zinc-100 to-transparent dark:from-zinc-900/80 dark:to-transparent blur-3xl" />

      {/* Right Side Gradient */}
      <div className="absolute top-0 right-0 w-[30%] h-full bg-gradient-to-l from-zinc-100 to-transparent dark:from-zinc-900/80 dark:to-transparent blur-3xl" />

      {/* Organic Orbs */}
      <div className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] bg-zinc-200/50 dark:bg-zinc-800/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-pulse" />

      <div className="absolute bottom-[10%] -right-[5%] w-[30vw] h-[30vw] bg-zinc-200/50 dark:bg-zinc-800/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-50" />

    </div>
  );
}