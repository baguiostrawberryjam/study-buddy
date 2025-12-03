

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

        {/* Main Content*/}
        {children}

      </main>
    </div>
  )
}