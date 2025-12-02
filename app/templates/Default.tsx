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
      <Header />
      <main className={`container mx-auto px-5 flex-1 ${className}`}>{children}</main>
      <Footer />
    </div>
  )
}