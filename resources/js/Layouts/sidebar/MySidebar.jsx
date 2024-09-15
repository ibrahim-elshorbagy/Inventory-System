import { useState } from "react";
import { Sidebar, Menu, SubMenu } from "react-pro-sidebar";
import { MdDashboard, MdChevronLeft, MdChevronRight,MdOutlineCategory,MdInventory } from "react-icons/md";
import {
    FaChartBar,
    FaBell,
    FaThLarge,
    FaShoppingCart,
    FaRocket,
    FaInfoCircle,
    FaUser,
    FaUserCircle,
} from "react-icons/fa";
import SideNavLink from "@/Components/SideNavLink";
import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";
import { AiOutlineProduct } from "react-icons/ai";
import { TbBrandAirtable } from "react-icons/tb";
import { CgPathUnite } from "react-icons/cg";
import { AiFillProduct } from "react-icons/ai";
import { FaWarehouse } from "react-icons/fa6";
import { CiSquareQuestion } from "react-icons/ci";
import { VscRequestChanges } from "react-icons/vsc";
import { FaBox } from "react-icons/fa";
import { IoLogoDropbox,IoNewspaperOutline } from "react-icons/io5";
import { RiNewspaperLine } from "react-icons/ri";
import { BsBoxes } from "react-icons/bs";
import { SiSpringsecurity } from "react-icons/si";

const resources = {
    en: {
        translation: {},
    },
    ar: {
        translation: {
            "Admin Dashboard": "لوحة تحكم ",
            "Dashboard": "لوحة التحكم",
            "All Users": "جميع المستخدمين",
            "E-Commerce": "التجارة الإلكترونية",
            "Products": "المنتجات",
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
            "Additions Orders":'طلبات الاضافة'
        },
    },
};


i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

const MySidebar = ({ user, direction }) => {
    const { t } = useTranslation();
    const [collapsed, setCollapsed] = useState(false);

    const sections = [
        { // admin
            title: t("Admin Dashboard"),
            links: [
                {
                    text: t("Dashboard"),
                    href: "admin.dashboard",
                    icon: <MdDashboard />,
                    permissions: ["view-admin-dashboard"],
                },
                {
                    text: t("All Users"),
                    href: "user.index",
                    icon: <FaUser />,
                    permissions: ["for-SystemAdmin-manage-users"],
                },
                {
                    text: t("Permissions"),
                    href: "admin.roles-permissions.index",
                    icon: <SiSpringsecurity />,
                    permissions: ["for-SystemAdmin-manage-roles-permissions"],
                },
            ],
            icon: <MdDashboard />,
        },
        { // customer
            title: t("Dashboard"),
            links: [
                {
                    text: t("Dashboard"),
                    href: "customer.dashboard",
                    icon: <MdDashboard />,
                    permissions: ["for-Acustomer-view-dashboard"],
                },
                {
                    text: t("My Products Report"),
                    href: "for-Acustomer-my-products-report",
                    icon: <BsBoxes />,
                    permissions: ["for-Acustomer-my-products-report"],
                },
                {
                    text: t("My Orders"),
                    href: "customer.show.my-requests",
                    icon: <RiNewspaperLine  />,
                    permissions: ["for-Acustomer-my-products-report"],
                },
            ],
            icon: <MdDashboard />,
            permissions:['for-Acustomer-view-dashboard']
        },
        // only for admins to manage products
        {
            title: t("Products"),
            links: [
                {
                    text: t("Main Categories"),
                    href: "category.index",
                    icon: <MdOutlineCategory />,
                    permissions: ["read-main-category"],
                },
                {
                    text: t("Sub Categories"),
                    href: "subCategory.index",
                    icon: <MdOutlineCategory />,
                    permissions: ["read-sub-category"],
                },
            ],
            icon: <AiOutlineProduct />,
        }, //manage warehouse
        {
            title: t("Inventory Management"),
            links: [
                {
                    text: t("Customers"),
                    href: "customer.index",
                    icon: <FaUserCircle />,
                    permissions: ["read-customer"],
                },
                {
                    text: t("Warehouses"),
                    href: "warehouse.index",
                    icon: <FaWarehouse />,
                    permissions: ["read-warehouse"],
                },


            ],
            icon: <IoLogoDropbox  />,
        },
        {
            title: t("Requests Management"),
            links: [
                {
                    text: t("Additions Orders"),
                    href: "stock.all.orders",
                    icon: <IoNewspaperOutline  />,
                    permissions: ["all-stock-orders"],
                },
                {
                    text: t("Release Orders"),
                    href: "admin.index.orders",
                    icon: <FaBox  />,
                    permissions: ["admin-orders-index"],
                },
            ],
            icon: <VscRequestChanges  />,
        },
    ];

    const filteredSections = sections
        .filter((section) =>
            !section.permissions || section.permissions.every((permission) => user.permissions.includes(permission))
        )
        .map((section) => ({
            ...section,
            links: section.links.filter((link) =>
                link.permissions.some((permission) =>
                    user.permissions.includes(permission)
                )
            ),
        }))
        .filter((section) => section.links.length > 0);
    return (
        <div>
            <Sidebar
                rtl={direction === "rtl"}
                collapsed={collapsed}
                width="270px"
                collapsedWidth="80px"
                className="h-full transition-all duration-300 bg-indigoBlue dark:bg-gray-800"
                transitionDuration={300}
                backgroundColor="white dark:bg-gray-800"
            >
                <div className="flex items-center justify-between p-4 overflow-hidden">
                    <h1
                        className={`flex gap-2 text-xl font-bold text-white dark:text-white transition-all duration-300 ${
                            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                        }`}
                    >
                         <img
                            src="/images/logo.PNG"
                            alt="Logo"
                            className="w-8 h-8"
                        />
                        <span className="pt-1">WebsiteName</span>
                    </h1>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`p-2 rounded-full bg-burntOrange dark:bg-burntOrange transition-all duration-300 ${
                            collapsed ? "rotate-180" : ""
                        }`}
                    >
                    {direction === "rtl" ? (
                        <MdChevronRight
                            size={24}
                            className="text-white "
                        />
                    ) : (
                        <MdChevronLeft
                            size={24}
                            className="text-white "
                        />
                    )}
                    </button>
                </div>
                <div className="px-6 pt-2">
                    <hr className="border-gray-300 dark:border-gray-900" />
                </div>
                <Menu
                    iconShape="square"
                    className="pt-2 text-white dark:text-white"
                >
                    {filteredSections.map((section, index) => (
                        <SubMenu
                            key={`${index}-${section.title}`}
                            icon={section.icon}
                            label={section.title}
                            className="py-2 my-2 dark:hover:text-white hover:text-black"
                        >
                            {section.links.map((link, idx) => (
                                <SideNavLink
                                    key={`${idx}-${link.href}`}
                                    href={route(link.href)}
                                    active={route().current(link.href)}
                                    className="flex items-center justify-between px-4 py-2"
                                >
                                    <div className="flex items-center gap-2 mt-2 ml-5 mr-5 text-base text-gray-400 dark:text-gray-500 hover:text-burntOrange dark:hover:text-burntOrange">
                                        {link.icon}{link.text}
                                    </div>
                                </SideNavLink>
                            ))}
                        </SubMenu>
                    ))}
                </Menu>
                <div className="px-6 pb-8">
                    <hr className="border-gray-300 dark:border-gray-900" />
                </div>
                <Link href={route("profile.edit")}>
                    <div className="flex items-center p-6 pt-2 mx-auto overflow-hidden ">
                        <div
                            className={`flex items-center ${
                                collapsed ? "" : "gap-3"
                            }`}
                        >
                            <img
                                className="rounded-full w-9 h-9"
                                src={user.profile_photo_url}
                                alt="User avatar"
                            />
                            {!collapsed && (
                                <div className="overflow-hidden">
                                    <div className="overflow-hidden text-sm font-medium text-white dark:text-gray-200 whitespace-nowrap text-ellipsis">
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-white dark:text-gray-400">
                                        {user.email}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            </Sidebar>
        </div>
    );
};

export default MySidebar;
