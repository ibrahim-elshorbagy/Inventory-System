import { useState } from "react";
import { Sidebar, Menu, SubMenu } from "react-pro-sidebar";
import { MdDashboard, MdChevronLeft, MdChevronRight,MdOutlineCategory,MdInventory } from "react-icons/md";
import {FaUser,FaUserCircle,} from "react-icons/fa";
import SideNavLink from "@/Components/SideNavLink";
import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";
import { AiOutlineProduct } from "react-icons/ai";
import { FaWarehouse } from "react-icons/fa6";
import { VscRequestChanges } from "react-icons/vsc";
import { FaBox } from "react-icons/fa";
import { IoLogoDropbox,IoNewspaperOutline } from "react-icons/io5";
import { RiNewspaperLine } from "react-icons/ri";
import { BsBoxes } from "react-icons/bs";
import { SiSpringsecurity } from "react-icons/si";
import { IoSettingsSharp } from "react-icons/io5";

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

const MySidebar = ({ user, direction,site_settings }) => {
    const { t } = useTranslation();
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        { // admin
            type: "section",
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
                {
                    text: t("Site Info"),
                    href: "admin.settings.index",
                    icon: <IoSettingsSharp />,
                    permissions: ["for-SystemAdmin-manage-site-settings"],
                },
            ],
            icon: <MdDashboard />,
        },
        { // customer
            type: "section",
            title: t("Dashboard"),
            links: [
                {
                    text: t("Dashboard"),
                    href: "customer.dashboard",
                    icon: <MdDashboard />,
                    permissions: ["for-customer-view-dashboard"],
                },
                {
                    text: t("My Products Report"),
                    href: "for-customer-my-products-report",
                    icon: <BsBoxes />,
                    permissions: ["for-customer-my-products-report"],
                },
                {
                    text: t("My Orders"),
                    href: "customer.show.my-requests",
                    icon: <RiNewspaperLine  />,
                    permissions: ["for-customer-my-products-report"],
                },
            ],
            icon: <MdDashboard />,
            permissions:['for-customer-view-dashboard']
        },
        // only for admins to manage products
        {
            type: "section",
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
            type: "section",
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
            type: "section",
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
    const filteredMenuItems = menuItems
        .filter((item) => {
            if (item.type === "link") {
                return item.permissions.some((permission) => user.permissions.includes(permission));
            } else if (item.type === "section") {
                const filteredLinks = item.links.filter((link) =>
                    link.permissions.some((permission) => user.permissions.includes(permission))
                );
                return filteredLinks.length > 0 && (!item.permissions || item.permissions.every((permission) => user.permissions.includes(permission)));
            }
            return false;
        })
        .map((item) => {
            if (item.type === "section") {
                return {
                    ...item,
                    links: item.links.filter((link) =>
                        link.permissions.some((permission) => user.permissions.includes(permission))
                    ),
                };
            }
            return item;
        });

    return (
        <div className=" bg-indigoBlue dark:bg-gray-900 sm:flex">
            <Sidebar
                rtl={direction === "rtl"}
                collapsed={collapsed}
                width="270px"
                collapsedWidth="80px"
                className="transition-all duration-300 border-0 "
                transitionDuration={300}
                backgroundColor="white dark:bg-gray-800"
            >
                <div className="flex items-center justify-between p-6 pt-4 pb-12 overflow-hidden">
                    <h1
                        className={`flex gap-2 text-xl font-bold text-white dark:text-white transition-all duration-300 ${
                            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                        }`}
                    >
                        <span className="pt-1">{site_settings.websiteName}</span>
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
                    <hr className="border-gray-300 dark:border-gray-500" />
                </div>
                <Menu iconShape="square" className="pt-2 text-white bg-transparent ">
                    {filteredMenuItems.map((item, index) => {
                        if (item.type === "link") {
                            return (
                                <MenuItem
                                    key={`link-${index}`}
                                    icon={item.icon}
                                    component={<Link href={route(item.href)} />}
                                    className="py-2 my-2 "
                                >
                                    {item.text}
                                </MenuItem>
                            );
                        } else if (item.type === "section") {
                            return (
                                <SubMenu
                                    key={`section-${index}`}
                                    icon={item.icon}
                                    label={item.title}
                                    className="py-2 my-2 dark:bg-gray-900 hover:bg-transparent hover:text-black dark:hover:text-indigoBlue dark:hover:bg-transparent bg-indigoBlue dark:text-white"


                                >
                                    {item.links.map((link, idx) => (
                                        <SideNavLink
                                            key={`${idx}-${link.href}`}
                                            href={route(link.href)}
                                            active={link.href === route().current()}
                                        >
                                                {link.icon}
                                                {link.text}
                                        </SideNavLink>
                                    ))}
                                </SubMenu>
                            );
                        }
                    })}
                </Menu>
                <div className="px-6 pb-8">
                    <hr className="border-gray-300 dark:border-gray-900" />
                </div>
                <Link href={route("profile.edit")}>
                    <div className="flex items-center p-6 pt-2 mx-auto overflow-hidden ">
                        <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
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
