import Header from "../components/Header";
import Footer from "../components/Footer";

export default function({
    children
}:{
    children: React.ReactNode
}) {
    return(
        <div className="w-full min-h-dvh flex flex-col">
            <Header />
            <main className="container mx-auto p-5 flex-1">{children}</main>
            <Footer />
        </div>
    )
}