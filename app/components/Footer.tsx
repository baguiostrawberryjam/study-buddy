export default function Footer() {
  return (
    <footer className="w-full bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light">
            Copyright &copy; {new Date().getFullYear()} StudyBuddy
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-light">
            Your personal AI research assistant
          </p>
        </div>
      </div>
    </footer>
  );
}
