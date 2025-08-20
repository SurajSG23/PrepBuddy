export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-14">
        <div className="flex flex-col items-center lg:flex-row lg:justify-between gap-10">
          
          <div className="text-center lg:text-left max-w-sm">
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              PrepBuddy
            </h1>
            <p className="mt-2 text-gray-400 text-base">
              Helping you prepare for your next big test with confidence and ease.
            </p>
          </div>

          <div className="flex space-x-6">
            <a href="https://www.instagram.com/suraj_sg23/" className="p-3 rounded-full bg-slate-800/70 hover:bg-blue-600 hover:text-white transition transform hover:scale-110">
              <i className="fab fa-instagram" />
            </a>
            <a href="https://www.linkedin.com/in/suraj-s-g-dhanva-995a23298/" className="p-3 rounded-full bg-slate-800/70 hover:bg-blue-600 hover:text-white transition transform hover:scale-110">
              <i className="fab fa-linkedin" />
            </a>
            <a href="https://github.com/SurajSG23" className="p-3 rounded-full bg-slate-800/70 hover:bg-blue-600 hover:text-white transition transform hover:scale-110">
              <i className="fab fa-github" />
            </a>
          </div>

          <div className="text-center lg:text-right text-sm text-gray-500">
            © 2025 <span className="text-blue-400">PrepBuddy</span>. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
