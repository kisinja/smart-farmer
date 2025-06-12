"use client";

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface CustomDropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: 'start' | 'center' | 'end';
    className?: string;
}

const CustomDropdown = ({
    trigger,
    children,
    align = 'end',
    className,
}: CustomDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className="flex items-center gap-1 p-0 hover:bg-transparent focus:outline-none"
                aria-expanded={isOpen}
            >
                {trigger}
                <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 cursor-pointer ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div
                    className={`absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white border border-gray-100 ${className}`}
                    style={{
                        right: align === 'end' ? 0 : undefined,
                        left: align === 'start' ? 0 : undefined,
                        transform: align === 'center' ? 'translateX(-50%)' : undefined,
                    }}
                >
                    {children}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;