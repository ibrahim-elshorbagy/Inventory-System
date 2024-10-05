import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    FaUsers,
    FaShoppingCart,
    FaClipboardCheck,
    FaUserTie,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";

 ;

const resources = {
    en: {
        translation: {},
    },
    ar: {
        translation: {
            Dashboard: "لوحة التحكم",
            "Admins and System Admins": "المشرفين ومشرفين النظام",
            "Total number of Admins and System Admins": "عدد المشرفين ومشرفين النظام",
            "Delivered Orders": "الطلبات المسلمة",
            "Pending and approved orders": "الطلبات المعلقة والموافقة عليها",
            "Total number of delivered orders": "عدد الطلبات المسلمة",
            "Total number of customers": "عدد العملاء",
            "Orders": "الطلبات",

        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);


const Dashboard = ({ auth,site_settings, adminsAndSystemAdminsCount, customersCount, ordersCount, deliveredOrdersCount }) => {
    const { t } = useTranslation();

    return (
        <>
            <Head title="Dashboard" />
            <div className="">
                <div className="">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="gap-4 p-2 text-gray-900 dark:text-gray-100">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">

                                {/* Admins and System Admins Count */}
                                <Card className="bg-white">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <FaUserTie className="mr-3 text-3xl text-blue-500" />
                                            <div>
                                                <CardTitle>{t("Admins and System Admins")}</CardTitle>
                                                <CardDescription>{t("Total number of Admins and System Admins")}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-3xl font-bold">{adminsAndSystemAdminsCount}</p>
                                    </CardContent>
                                </Card>

                                {/* Customers Count */}
                                <Card className="bg-white">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <FaUsers className="mr-3 text-3xl text-green-500" />
                                            <div>
                                                <CardTitle>{t("Customers")}</CardTitle>
                                                <CardDescription>{t("Total number of customers")}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-3xl font-bold">{customersCount}</p>
                                    </CardContent>
                                </Card>

                                {/* Orders Count */}
                                <Card className="bg-white">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <FaShoppingCart className="mr-3 text-3xl text-orange-500" />
                                            <div>
                                                <CardTitle>{t("Orders")}</CardTitle>
                                                <CardDescription>{t("Pending and approved orders")}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-3xl font-bold">{ordersCount}</p>
                                    </CardContent>
                                </Card>

                                {/* Delivered Orders Count */}
                                <Card className="bg-white">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <FaClipboardCheck className="mr-3 text-3xl text-red-500" />
                                            <div>
                                                <CardTitle>{t("Delivered Orders")}</CardTitle>
                                                <CardDescription>{t("Total number of delivered orders")}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-3xl font-bold">{deliveredOrdersCount}</p>
                                    </CardContent>

                                </Card>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const DashboardHeader = () => {
    const { t } = useTranslation();
    return (
        <h2 className="text-sm font-semibold leading-tight text-white md:text-lg dark:text-gray-200">
            {t("Dashboard")}
        </h2>
    );
};

Dashboard.layout = (page) => (
    <AuthenticatedLayout
        user={page.props.auth.user}
        site_settings={page.props.site_settings}

        header={<DashboardHeader />}
    >
        {page}
    </AuthenticatedLayout>
);

export default Dashboard;
