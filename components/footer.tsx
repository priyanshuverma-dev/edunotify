import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="text-sm">
          <span>&copy; {currentYear} EduNotify</span>
          <span className="mx-2">•</span>
          <span>Created by Priyanshu Verma</span>
        </div>
        <div>
          <a
            href="https://github.com/priyanshuverma-dev/edunotify"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 0C5.37 0 0 5.37 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.82-.26.82-.577 0-.285-.011-1.04-.016-2.04-3.338.725-4.042-1.614-4.042-1.614C4.422 17.727 3.633 17.4 3.633 17.4c-1.087-.744.083-.729.083-.729 1.205.085 1.839 1.237 1.839 1.237 1.07 1.835 2.805 1.305 3.49.998.108-.774.418-1.305.76-1.606-2.665-.306-5.466-1.332-5.466-5.932 0-1.31.47-2.381 1.235-3.221-.124-.303-.535-1.524.116-3.176 0 0 1.008-.322 3.302 1.23a11.52 11.52 0 013.005-.403c1.02.004 2.048.137 3.005.403 2.293-1.552 3.3-1.23 3.3-1.23.653 1.652.242 2.873.118 3.176.767.84 1.235 1.911 1.235 3.221 0 4.61-2.803 5.624-5.475 5.921.43.371.814 1.102.814 2.222 0 1.605-.014 2.899-.014 3.293 0 .32.218.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z"
                clipRule="evenodd"
              />
            </svg>
            <span>Star on GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
