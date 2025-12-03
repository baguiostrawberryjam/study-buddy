import Footer from "../components/Footer";
import Header from "../components/Header";
import BackgroundDecor from "../components/BackgroundDecor";

export default function Default({
  className,
  children
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    // REMOVED background colors here so the fixed BackgroundDecor is visible
    <div className="w-full min-h-dvh flex flex-col relative isolation-isolate">

      {/* The Gradient Background */}
      <BackgroundDecor />

      {/* Main Content */}
      <main className={`${className} relative z-0 flex-1 flex flex-col`}>

        {/* Fixed Header */}
        <div className="shrink-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/50 transition-all duration-500">
          <Header />
        </div>

        {/* Children */}
        {children}

        {/* Footer */}
        <div className="shrink-0 py-4 opacity-80 hover:opacity-100 transition-opacity">
          <Footer />
        </div>

      </main>
    </div>
  )
}