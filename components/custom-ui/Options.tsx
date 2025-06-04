import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical } from 'lucide-react'

interface MenuOption {
    label: string
    icon: React.ReactNode
    onClick: (e?: React.MouseEvent) => void
}

interface OptionsProps {
    menuOptions: MenuOption[]
    position?: 'above' | 'below' // New prop for position control
    isHovered?: boolean // Optional prop to control hover state
}

const Options: React.FC<OptionsProps> = ({ menuOptions, position = 'below', isHovered }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (!isHovered)  {
            setIsMenuOpen(false)
        }
    }, [isHovered])

    // Dynamic positioning classes
    const positionClasses = position === 'above' 
        ? 'bottom-full mb-2' 
        : 'top-full mt-2'

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={toggleMenu}
                className="p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
                aria-label="More options"
            >
                <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>

            {isMenuOpen && (
                <div
                    ref={menuRef}
                    className={`absolute right-0 w-64 rounded-lg bg-white shadow-lg z-[1000] border border-gray-100 overflow-hidden ${positionClasses}`}
                    onClick={closeMenu}
                >
                    <div className="py-1">
                        {menuOptions.map((item, index) => (
                            <button
                                key={index}
                                className="w-full cursor-pointer text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    item.onClick(e); // Pass the event to the onClick handler
                                    closeMenu();
                                }}
                            >
                                {item.icon}
                                <span className="text-gray-700">
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Options