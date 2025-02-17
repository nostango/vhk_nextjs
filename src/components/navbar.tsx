'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, Globe } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'

const navItems = [
  { name: 'nav.about', href: '#about' },
  { name: 'nav.calendar', href: '#calendar' },
  { name: 'nav.classes', href: '#classes' },
  { name: 'nav.contact', href: '#contact' },
]

export function NavbarComponent() {
  const { t, i18n } = useTranslation('common')
  const [isOpen, setIsOpen] = useState(false)

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <nav className="bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-row justify-between items-center py-4 md:flex-col md:items-center">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <Link href="/">
              <Image src="/images/Valenzuela_Logo_White.png" alt="Logo" width={150} height={150} className="h-16 w-auto" priority />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 mt-4 items-center">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                className="relative"
                whileHover="hover"
              >
                <Link href={item.href} className="py-2 px-4">
                  {t(item.name)}
                </Link>
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ clipPath: 'inset(100% 0% 0% 100%)' }}
                  variants={{
                    hover: { clipPath: 'inset(0% 0% 0% 0%)' }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={item.href} className="py-2 px-4 text-black">
                    {t(item.name)}
                  </Link>
                </motion.div>
              </motion.div>
            ))}
            
            {/* Add Language Toggle to Desktop Menu */}
            <button
              onClick={toggleLanguage}
              className="p-2 hover:bg-gray-700 rounded-md flex items-center"
              aria-label="Toggle language"
            >
              <Globe className="h-5 w-5" />
              <span className="ml-1">
                {i18n.language ? i18n.language.toUpperCase() : 'EN'}
              </span>
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 hover:bg-gray-700 rounded-md"
              aria-label="Toggle language"
            >
              <Globe className="h-5 w-5" />
              <span className="ml-1">
                {i18n.language ? i18n.language.toUpperCase() : 'EN'}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Desktop Navigation Items (Centered Below Logo) */}
        {/* This section is already handled by the Desktop Menu above with `md:flex` and `mt-4` */}

        {/* White Line Divider */}
        <div className="w-[80%] h-px bg-white mx-auto"></div>


        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              >
                {t(item.name)}
              </Link>
            ))}
            
            {/* Language Toggle in Mobile Menu */}
            <button
              onClick={toggleLanguage}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              {t('language')}: {i18n.language === 'en' ? 'English' : 'Español'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
