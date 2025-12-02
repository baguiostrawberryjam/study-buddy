export default function Footer() {
  return (
    <footer className="w-full bg-transparent text-white">
      <div className="max-w-7xl mx-auto p-4 text-center">
        Copyright &copy; {new Date().getFullYear()}
      </div>
    </footer>
  );
}
