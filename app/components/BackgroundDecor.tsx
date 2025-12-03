export default function BackgroundDecor() {
  return (
    // Fixed position z-[-1] puts it behind everything
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden bg-white dark:bg-[#0a0a0a]">

      {/* Left Side Gradient - Zinc/Gray Glow */}
      <div className="absolute top-0 left-0 w-[25%] h-full bg-gradient-to-r from-zinc-200/60 to-transparent dark:from-zinc-900 dark:to-transparent blur-2xl" />

      {/* Right Side Gradient - Zinc/Gray Glow */}
      <div className="absolute top-0 right-0 w-[25%] h-full bg-gradient-to-l from-zinc-200/60 to-transparent dark:from-zinc-900 dark:to-transparent blur-2xl" />

      {/* Subtle Top-Left Orb */}
      <div className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] bg-zinc-200/40 dark:bg-zinc-800/20 rounded-full blur-[100px] opacity-70" />

      {/* Subtle Bottom-Right Orb */}
      <div className="absolute -bottom-[10%] -right-[5%] w-[40vw] h-[40vw] bg-zinc-200/40 dark:bg-zinc-800/20 rounded-full blur-[100px] opacity-70" />

    </div>
  );
}