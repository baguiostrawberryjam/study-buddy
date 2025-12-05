import Footer from "../components/Footer";
import Header from "../components/Header";

export default function ({
  className,
  children,
  hideStageLights = false
}: {
  className?: string
  children: React.ReactNode
  hideStageLights?: boolean
}) {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative">

      {/* Stage Light Effect - Light Mode Bottom Left */}
      <div
        className={`fixed left-0 bottom-0 w-[40rem] h-[60vh] pointer-events-none z-[5] dark:hidden transition-opacity duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] ${hideStageLights ? 'stage-light-hiding opacity-0' : 'stage-light-fade-in'}`}
        style={{
          background: 'radial-gradient(ellipse 1200px 800px at bottom left, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.05) 60%, transparent 100%)',
          filter: 'blur(40px)',
          ...(hideStageLights ? {} : { animationDelay: '200ms' }),
        }}
      />

      {/* Stage Light Effect - Light Mode Bottom Right */}
      <div
        className={`fixed right-0 bottom-0 w-[40rem] h-[60vh] pointer-events-none z-[5] dark:hidden transition-opacity duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] ${hideStageLights ? 'stage-light-hiding opacity-0' : 'stage-light-fade-in'}`}
        style={{
          background: 'radial-gradient(ellipse 1200px 800px at bottom right, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.05) 60%, transparent 100%)',
          filter: 'blur(40px)',
          ...(hideStageLights ? {} : { animationDelay: '400ms' }),
        }}
      />

      {/* Stage Light Effect - Dark Mode Bottom Left */}
      <div
        className={`fixed left-0 bottom-0 w-[40rem] h-[60vh] pointer-events-none z-[15] hidden dark:block transition-opacity duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] ${hideStageLights ? 'stage-light-hiding opacity-0' : 'stage-light-fade-in'}`}
        style={{
          background: 'radial-gradient(ellipse 1200px 800px at bottom left, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.03) 60%, transparent 100%)',
          filter: 'blur(50px)',
          ...(hideStageLights ? {} : { animationDelay: '200ms' }),
        }}
      />

      {/* Stage Light Effect - Dark Mode Bottom Right */}
      <div
        className={`fixed right-0 bottom-0 w-[40rem] h-[60vh] pointer-events-none z-[15] hidden dark:block transition-opacity duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] ${hideStageLights ? 'stage-light-hiding opacity-0' : 'stage-light-fade-in'}`}
        style={{
          background: 'radial-gradient(ellipse 1200px 800px at bottom right, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.03) 60%, transparent 100%)',
          filter: 'blur(50px)',
          ...(hideStageLights ? {} : { animationDelay: '400ms' }),
        }}
      />

      <main className={`${className} flex flex-col flex-1 min-h-0 overflow-hidden relative z-[10]`}>

        {/* Fixed Header */}
        <div className="shrink-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 transition-all duration-500">
          <Header />
        </div>

        {/* Main Content*/}
        {children}

        {/* Footer */}
        <div className="shrink-0">
          <Footer />
        </div>

      </main>
    </div>
  )
}