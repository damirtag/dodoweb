"use client";

import { FaXmark } from "react-icons/fa6";

export function PopupAbout({ open, onClose }: { open: boolean; onClose: () => void }) {
    if (!open) return null;

    return (
        <div
            className="
                fixed inset-0 z-50
                bg-black/60 backdrop-blur-sm
                flex items-center justify-center
                p-4
            "
            onClick={onClose}
        >
            <div
                className="
                    relative
                    bg-zinc-900 
                    rounded-2xl
                    p-6 sm:p-8
                    w-full max-w-lg
                    text-white
                    animate-fadeIn
                "
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="
                        absolute top-4 right-4 
                        text-gray-400 hover:text-white
                        transition-colors
                    "
                    onClick={onClose}
                >
                    <FaXmark className="w-5 h-5" />
                </button>

                <p className="text-gray-200 leading-relaxed mb-6 text-sm sm:text-base">
                    Так как в компании Додо верят, что прозрачность превыше всего, этот сайт отображает
                    <span className="text-orange-400 font-semibold"> интерактивную карту точек Dodo Pizza </span>
                    по всему миру с детальной информацией о пиццериях и их доходах. Также реализован удобный поиск по пиццериям для быстрого
                    нахождения нужного объекта.
                </p>

                <button
                    onClick={onClose}
                    className="
                        w-full py-3 
                        bg-orange-500 hover:bg-orange-600
                        text-white font-bold
                        rounded-xl
                        transition-colors
                    "
                >
                    Понятно
                </button>
            </div>
        </div>
    );
}
