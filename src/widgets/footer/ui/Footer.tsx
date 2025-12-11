import { FaGithub } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa6";

export function Footer() {
    return (
        <footer className="w-full max-w-6xl px-4 py-4 text-gray-400 text-sm border-t border-gray-800 mt-6 flex flex-col sm:flex-row justify-between items-center">
            <span className="text-center sm:text-left">
                Проект создан исключительно в ознакомительных целях и не связан с брендом Dodo Pizza.
            </span>

            <div className="flex mt-2 sm:mt-0 gap-4">
                <a
                    href="https://github.com/damirtag/dodoweb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-700 transition-colors"
                >
                    <FaGithub className="w-5 h-5" />
                </a>

                <a
                    href="https://t.me/dodois_simplebot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-700 transition-colors"
                >
                    <FaTelegram className="w-5 h-5" />
                </a>
            </div>
        </footer>
    );
}
