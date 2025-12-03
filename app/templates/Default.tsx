import Footer from "../components/Footer";
import Header from "../components/Header";

export default function ({
  className,
  children
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className="w-full min-h-dvh flex flex-col">

      <main className={`${className}`}>

        {/* Fixed Header */}
        <div className="shrink-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-all duration-500">
          <Header />
        </div>

        {/* Main Content*/}
        {children}

        {/* Footer */}
        <div className="shrink-0 py-4 opacity-80 hover:opacity-100 transition-opacity">
          <Footer />
        </div>

      </main>
    </div>
  )
}