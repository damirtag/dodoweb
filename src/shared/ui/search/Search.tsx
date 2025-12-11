"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { Command, CommandInput } from "@/shared/ui/command";
import type { Pizzeria } from "@/entities/pizzeria/model/pizzeria";

interface SearchbarProps {
    items: Pizzeria[];
    onSelect?: (pizzeria: Pizzeria) => void;
}

export function Searchbar({ items, onSelect }: SearchbarProps) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    // Фильтрация по имени, алиасу, адресу
    const filteredItems = useMemo(() => {
        const q = query.toLowerCase();
        return items.filter(
            (p) => p.name.toLowerCase().includes(q) || p.alias.toLowerCase().includes(q) || p.address.text.toLowerCase().includes(q)
        );
    }, [query, items]);

    const handleSelect = (item: Pizzeria) => {
        setQuery(item.name);
        setOpen(false);
        onSelect?.(item);
    };

    const handleNavigate = (item: Pizzeria) => {
        navigate(`/pizzeria/${item.countryId}/${item.id}`);
    };

    return (
        <div className="relative w-full">
            <Command className="rounded-lg border border-neutral-800 bg-[#111] text-white shadow-none">
                <CommandInput
                    placeholder="Искать пиццерию..."
                    value={query}
                    onValueChange={(v) => {
                        setQuery(v);
                        setOpen(v.length > 0);
                    }}
                    onFocus={() => query.length > 0 && setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 200)}
                    className="h-9 placeholder:text-neutral-500"
                />
            </Command>

            {open && (
                <div className="absolute left-0 right-0 top-full mt-1 z-50">
                    <div className="bg-[#1a1a1a] border border-neutral-800 rounded-lg shadow-xl overflow-hidden">
                        <div className="max-h-[400px] overflow-y-auto">
                            {filteredItems.length === 0 ? (
                                <div className="text-neutral-400 py-3 px-4 text-sm text-center">Ничего не найдено</div>
                            ) : (
                                <div className="py-1">
                                    {filteredItems.map((item) => (
                                        <div
                                            key={item.uuid}
                                            className="flex items-center justify-between px-4 py-2.5 hover:bg-neutral-800 transition-colors group cursor-pointer"
                                            onClick={() => handleSelect(item)}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="text-white text-sm font-medium truncate">
                                                    {item.name}
                                                    {item.alias && <span className="text-neutral-400 ml-1.5">({item.alias})</span>}
                                                </div>
                                                <div className="text-neutral-500 text-xs mt-0.5 truncate">{item.address.text}</div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleNavigate(item);
                                                }}
                                                className="ml-3 flex items-center gap-1.5 px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-md text-xs font-medium text-white transition-colors whitespace-nowrap"
                                            >
                                                Перейти
                                                <FaArrowRightLong className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
