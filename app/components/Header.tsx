import Link from "next/link";

export default function Home() {
    return <header className="container mx-auto flex flex-row justify-between items-center bg-gray-900 text-white p-4">
        

        <div className="container flex items-center justify-between mx-auto p-5">
            {/** Logo */}
            <div className="font-bold">StudyBuddy</div>
        </div>

        <div className="flex gap-3 ">
            {/** Action Buttons */}
                <Link href="/login" className="button">Login</Link>
                <Link href="/signup" className="button">Sign-up</Link>
        </div>

    </header>
}