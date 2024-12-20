import { useState, useEffect } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import ThemeToggleButton from "../Components/ThemeToggleButton";
import NavLink from "@/Components/NavLink";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";
import { FaFlagUsa } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import SelectInput from "@/Components/SelectInput";
import { FaWhatsapp } from 'react-icons/fa';
import { FaBars } from "react-icons/fa6";

const resources = {
    en: {
        translation: {
            Login: "Login",
            Register: "Register",
        },
    },
    ar: {
        translation: {
            Login: "تسجيل الدخول",
            Register: "التسجيل",
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function Guest({ children ,site_settings}) {
    const { t } = useTranslation();
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [direction, setDirection] = useState("ltr");

    useEffect(() => {
        const newDirection = i18n.language === "ar" ? "rtl" : "ltr";
        setDirection(newDirection);
        document.documentElement.dir = newDirection;
    }, [i18n.language]);

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <div
            className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-800"
            style={{ direction }}
        >
            <nav className="bg-white border-b border-gray-300 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <div className="px-4 mx-auto max-w-7xl ">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex items-center shrink-0">
                                <Link href="/">
                                                <img
                                                    src={site_settings.websiteLogo}
                                                    alt="Logo"
                                                    className="block w-auto text-gray-800 fill-current h-9 dark:text-gray-200"
                                    />
                                </Link>
                            </div>
                        </div>

                        <div className="hidden gap-5 sm:flex sm:items-center sm:ml-6">
                            <NavLink
                                href={route("login")}
                                active={route().current("login")}
                            >
                                {t("Login")}
                            </NavLink>

                            <ThemeToggleButton />

                            {/* Language Selector */}
                            <div className="relative p-5 ml-3">
                                <SelectInput
                                    onChange={changeLanguage}
                                    value={i18n.language}
                                    className="border border-transparent rounded-md dark:text-gray-400 dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                                >
                                    <option value="en">
                                        English
                                    </option>
                                    <option value="ar">
                                        العربية
                                    </option>
                                </SelectInput>
                            </div>
                        </div>

                        <div className="flex items-center -mr-2 sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        !showingNavigationDropdown
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400"
                            >
                                <FaBars />
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href={route("login")}
                            className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                        >
                            {t("Login")}
                        </Link>
                        <div className="flex gap-5">
                            <ThemeToggleButton />
                            <SelectInput
                                    onChange={changeLanguage}
                                    value={i18n.language}
                                    className="border border-transparent rounded-md dark:text-gray-400 dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                                >
                                    <option value="en">
                                        English
                                    </option>
                                    <option value="ar">
                                        العربية
                                    </option>
                            </SelectInput>

                        </div>
                    </div>
                </div>
            </nav>

            {children}

        </div>
    );
}
