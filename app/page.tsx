import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
      <div className="w-full min-h-screen flex justify-center items-center">
        
        <div className="w-full min-h-screen flex">

          <h1>ChatGPT</h1>

          <div>
            <button type="button" className="text-white bg-brand box-border border border-gray hover:bg-brand-strong rounded-full focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-1.5 focus:outline-none">
              <Link href="/login">Login</Link>
            </button>
          </div>

        </div>

      </div>
  );
}
