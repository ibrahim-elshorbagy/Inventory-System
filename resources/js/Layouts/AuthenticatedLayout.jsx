import { useState, useEffect } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import SelectInput from "@/Components/SelectInput";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import MySidebar from "./sidebar/MySidebar";
import ThemeToggleButton from "../Components/ThemeToggleButton";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";
import { FaBell } from "react-icons/fa"; // Notification bell icon
import { router } from '@inertiajs/react';
import { FaWhatsapp } from 'react-icons/fa';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion"
import { FaBars } from "react-icons/fa6";

const resources = {
    en: {},
    ar: {
        translation: {
            "Dashboard": "لوحة القيادة",
            "Profile": "الملف الشخصي",
            "Log Out": "تسجيل خروج",
            "No New Notifications": "لا يوجد أشعارات جديدة",
            "Admin Dashboard": "لوحة تحكم ",
            "Dashboard": "لوحة التحكم",
            "All Users": "جميع المستخدمين",
            "E-Commerce": "التجارة الإلكترونية",
            "Products": "الاصناف",
            'Main Categories': 'الاصناف الرئيسية ',
            'Sub Categories': 'الاصناف الفرعية',
            "Inventory Management": 'ادارة المخازن',
            "Customers": 'العملاء',
            "Warehouses": 'المخازن',
            "My Products Report": 'تقرير المنتجات',
            "My Orders": 'طلبات ارجاع المنتجات',
            "Requests Management": 'ادارة الطلبات',
            "Release Orders": 'طلبات الاسترجاع',
            "Permissions": 'الصلاحيات',
            "Additions Orders": 'طلبات الاضافة',
            "Site Info": "بيانات الموقع",

        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function Authenticated({ user, header, children ,site_settings}) {

    const [notifications, setNotifications] = useState(user.notifications || []);


    const handleNotificationClick = (id, e, url) => {
        e.preventDefault();

        router.post(route('notifications.markAsRead', { id: id }), { url: url }, {
            preserveScroll: true,
            onSuccess: () => {
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification.id !== id)
                );
            }
        });


    };

    const { t } = useTranslation();
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [direction, setDirection] = useState("ltr");

    useEffect(() => {
        const newDirection = i18n.language === "ar" ? "rtl" : "ltr";
        setDirection(newDirection);
        document.documentElement.dir = newDirection;
    }, [i18n.language]);

    const changeLanguage = (e) => {
        const selectedLanguage = e.target.value;

        i18n.changeLanguage(selectedLanguage);

        router.post(route('language.change'), { language: selectedLanguage }, {
            headers: {
                'X-Custom-Language-Header': selectedLanguage,
            },
        });
    };


    const menuItems = [
        // Admin Dashboard Section
        {
            type: "link",
            text: t("Dashboard"),
            href: "admin.dashboard",
            permissions: ["view-admin-dashboard"],
        },
        // Admin Users and Permissions Section
        {
            type: "section",
            title: t("Admin Dashboard"),
            permissions: ["for-SystemAdmin-manage-users", "for-SystemAdmin-manage-roles-permissions"],
            links: [
                { text: t("All Users"), href: "user.index", permissions: ["for-SystemAdmin-manage-users"] },
                { text: t("Permissions"), href: "admin.roles-permissions.index", permissions: ["for-SystemAdmin-manage-roles-permissions"] },
                { text: t("Site Info"), href: "admin.settings.index", permissions: ["for-SystemAdmin-manage-site-settings"] },
            ],
        },
        // Customer Dashboard Section
        {
            type: "section",
            title: t("Customer Dashboard"),
            permissions: ["for-customer-view-dashboard"],
            links: [
                { text: t("Dashboard"), href: "customer.dashboard", permissions: ["for-customer-view-dashboard"] },
                { text: t("My Products Report"), href: "for-customer-my-products-report", permissions: ["for-customer-my-products-report"] },
                { text: t("My Orders"), href: "customer.show.my-requests", permissions: ["for-customer-my-products-report"] },
            ],
        },
        // Products Section
        {
            type: "section",
            title: t("Products"),
            permissions: ["read-main-category", "read-sub-category"],
            links: [
                { text: t("Main Categories"), href: "category.index", permissions: ["read-main-category"] },
                { text: t("Sub Categories"), href: "subCategory.index", permissions: ["read-sub-category"] },
            ],
        },
        // Inventory Management Section
        {
            type: "section",
            title: t("Inventory Management"),
            permissions: ["read-customer", "read-warehouse"],
            links: [
                { text: t("Customers"), href: "customer.index", permissions: ["read-customer"] },
                { text: t("Warehouses"), href: "warehouse.index", permissions: ["read-warehouse"] },
            ],
        },
        // Requests Management Section
        {
            type: "section",
            title: t("Requests Management"),
            permissions: ["all-stock-orders", "admin-orders-index"],
            links: [
                { text: t("Additions Orders"), href: "stock.all.orders", permissions: ["all-stock-orders"] },
                { text: t("Release Orders"), href: "admin.index.orders", permissions: ["admin-orders-index"] },
            ],
        },
    ];

    const hasSectionPermission = (sectionPermissions) => {
            return sectionPermissions.some(permission => user.permissions.includes(permission));
    };


    return (
        <div className={`flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 ${direction === "rtl" ? "rtl" : "ltr"}`}>
            <nav className="fixed top-0 left-0 z-10 w-full bg-white border-b border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div className="mx-auto max-w-7xl">
                    <div className="flex justify-between h-16 px-6">
                        <div className="flex gap-2">
                            <div className="flex items-center shrink-0">
                                {user.permissions.includes("view-admin-dashboard") && (
                                    <Link href={route("admin.dashboard")}>
                                                                                    <img
                                                    src={site_settings.websiteLogo}
                                                    alt="Logo"
                                                    className="block w-auto text-gray-800 fill-current h-9 dark:text-gray-200"
                                        />

                                    </Link>
                                )}
                                {user.permissions.includes("for-customer-view-dashboard") && (
                                    <Link href={route("customer.dashboard")}>
                                                <img
                                                    src={site_settings.websiteLogo}
                                                    alt="Logo"
                                                    className="block w-auto text-gray-800 fill-current h-9 dark:text-gray-200"
                                        />

                                    </Link>
                                )}
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                {user.permissions.includes("view-admin-dashboard") && (
                                    <NavLink
                                        href={route("admin.dashboard")}
                                        active={route().current("admin.dashboard")}
                                    >
                                        {t("Dashboard")}
                                    </NavLink>
                                )}
                                {user.permissions.includes("for-customer-view-dashboard") && (
                                    <NavLink
                                        href={route("customer.dashboard")}
                                        active={route().current("customer.dashboard")}
                                    >
                                        {t("Dashboard")}
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        {/* Notifications for Desktop */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <ThemeToggleButton />

                            <div className="relative p-5 ml-3">
                                <SelectInput
                                    onChange={changeLanguage}
                                    value={i18n.language}
                                    className="border border-transparent rounded-md dark:text-gray-400 dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                                >
                                    <option value="en">English</option>
                                    <option value="ar">العربية</option>
                                </SelectInput>
                            </div>

                            {/* Notification Bell for Desktop */}
                            <div className="relative ml-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="relative inline-flex items-center p-2 text-sm font-medium text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-full dark:text-gray-400 dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
                                            <FaBell className="w-5 h-5" />
                                            {notifications.length > 0 && (
                                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                                                    {notifications.length}
                                                </span>
                                            )}
                                        </button>
                                    </Dropdown.Trigger>


                                    <Dropdown.Content>
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <Dropdown.Link
                                                    key={notification.id}
                                                    onClick={(e) => handleNotificationClick(notification.id, e, notification.data.url)} // Pass both notification.id and the event
                                                    as="button"
                                                >
                                                    {direction === "rtl" ? notification.data.message.ar : notification.data.message.en}

                                                </Dropdown.Link>
                                            ))
                                        ) : (
                                            <div className="p-2 text-gray-500">{t("No New Notifications")}</div>
                                        )}
                                    </Dropdown.Content>


                                </Dropdown>
                            </div>
                            {/* Profile and Log Out Links */}
                            <div className="relative ml-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md dark:text-gray-400 dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                                            >
                                                {user.name}
                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            {t("Profile")}
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            {t("Log Out")}
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Notification Bell for Mobile */}
                        <div className="relative flex items-center -mr-2 sm:hidden">
                            {/* Notification Bell for Desktop */}
                            <div className="relative ml-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="relative inline-flex items-center p-2 text-sm font-medium text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-full dark:text-gray-400 dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
                                            <FaBell className="w-5 h-5" />
                                            {notifications.length > 0 && (
                                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                                                    {notifications.length}
                                                </span>
                                            )}
                                        </button>
                                    </Dropdown.Trigger>


                                    <Dropdown.Content>
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <Dropdown.Link
                                                    key={notification.id}
                                                    onClick={(e) => handleNotificationClick(notification.id, e, notification.data.url)} // Pass both notification.id and the event
                                                    as="button"
                                                >
                                                    {direction === "rtl" ? notification.data.message.ar : notification.data.message.en}

                                                </Dropdown.Link>
                                            ))
                                        ) : (
                                            <div className="p-2 text-gray-500">{t("No New Notifications")}</div>
                                        )}
                                    </Dropdown.Content>


                                </Dropdown>
                            </div>

                            {/* Navigation Button */}
                            <div className="flex items-center ml-5">
                                <button
                                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                    className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400"
                                >
                                    <FaBars />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Mobile Dropdown */}
                <div className={(showingNavigationDropdown ? "block" : "hidden") + " sm:hidden"}>


                    <Accordion type="single" collapsible>
                        {menuItems.map((item, index) => {
                            // Render individual links based on permissions
                            if (item.type === "link" && hasSectionPermission(item.permissions)) {
                                return (
                                    <ResponsiveNavLink key={index} href={route(item.href)} active={route().current(item.href)}>
                                        {item.text}
                                    </ResponsiveNavLink>
                                );
                            }

                            // Render sections only if the user has any permission for the section or its links
                            if (item.type === "section" && hasSectionPermission(item.permissions)) {
                                return (
                                    <AccordionItem className='px-3 text-gray-700 dark:text-gray-200' key={index} value={`item-${index}`}>
                                        <AccordionTrigger>{item.title}</AccordionTrigger>
                                        <AccordionContent>
                                            {item.links.map((link, linkIndex) => (
                                                hasSectionPermission(link.permissions) && (
                                                    <ResponsiveNavLink key={linkIndex} href={route(link.href)} active={route().current(link.href)}>
                                                        {link.text}
                                                    </ResponsiveNavLink>
                                                )
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            }

                            return null;
                        })}
                    </Accordion>








                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                {t("Profile")}
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                {t("Log Out")}
                            </ResponsiveNavLink>
                        </div>

                        <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                            <div className="px-4">
                                <div className="grid justify-between grid-cols-3">
                                    <ThemeToggleButton />
                                    <SelectInput
                                        onChange={changeLanguage}
                                        value={i18n.language}
                                        className="col-span-2 border border-transparent rounded-md dark:text-gray-400 dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                                    >
                                        <option value="en">English</option>
                                        <option value="ar">العربية</option>
                                    </SelectInput>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>




            </nav>

            {/* <div className="flex flex-1 pt-16 bg-white">


                <MySidebar user={user} direction={direction} />
                <div className="flex-1 overflow-x-hidden bg-white dark:bg-gray-800">
                    {header && (
                        <header className="bg-indigoBlue dark:bg-gray-900">
                            <div className="px-4 py-6 mx-auto text-red-50 sm:px-6 lg:px-14">
                                {header}
                            </div>
                        </header>
                    )}
                    <main className="flex flex-col flex-1 bg-white dark:bg-gray-800">{children}</main>
                </div>
            </div> */}

            <div className="flex-1 pt-16 sm:flex">
                <div className="hidden sm:flex">
                    <MySidebar user={user} direction={direction} site_settings={site_settings} />
                </div>

                <div className="flex-1 overflow-x-hidden bg-white dark:bg-gray-800">
                {header && (
                    <header className="bg-indigoBlue dark:bg-gray-900">
                    <div className="px-4 py-6 mx-auto text-red-50 sm:px-6 lg:px-14">
                        {header}
                    </div>
                    </header>
                )}
                <main className="flex flex-col flex-1 bg-white dark:bg-gray-800">{children}</main>
                </div>
            </div>

            <footer dir="ltr" className="py-6 text-white bg-gray-950">
                <div className="container flex flex-col items-center justify-between px-4 mx-auto lg:gap-2">
                    <div className="flex flex-col items-center justify-center mb-4 text-sm md:text-base md:mb-0 md:block">
                        Inventory System By &nbsp;<a href="https://mostaql.com/u/ibrahim_shorbgy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Ibrahim Elshorbagy</a>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>All rights reserved © 2024</div>
                            <div className="flex flex-col sm:flex-row">
                                <div>For support</div>
                                <div><a href="https://wa.me/201096321477" target="_blank" rel="noopener noreferrer" className="flex items-center ml-2 text-green-400 hover:text-green-300">
                                    <FaWhatsapp className="mr-1" />+201096321477 </a></div></div>
                    </div>
                </div>
            </footer>


        </div>
    );
}
