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
    FaBoxes,
    FaShoppingCart,
    FaClipboardCheck,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";

const resources = {
    en: {
        translation: {},
    },
    ar: {
        translation: {
            Dashboard: "لوحة التحكم",
            "Products": "المخزون",
            "Total number of products in stock": "عدد المنتجات في المخزن",
            "Orders": "الطلبات",
            "Pending and approved orders": "الطلبات المعلقة والموافقة عليها",
            "Delivered Orders": "الطلبات المسلمة",
            "Total delivered orders": "عدد الطلبات المسلمة",

        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);


const Dashboard = ({ auth,site_settings, productsCount, ordersCount, deliveredOrdersCount }) => {
    const { t } = useTranslation();

    return (
        <>
            <Head title="Dashboard" />
            <div className="">
                <div className="p-5 mb-5 text-sm font-semibold leading-tight border-b md:text-lg dark:text-gray-200">
                    <h2 >
                        {t("Dashboard")}
                    </h2>
                </div>
                <div className="">
                    <div className="">
                        <div className="gap-4 p-2 text-gray-900 dark:text-gray-100">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">

                                {/* Products Count */}
                                <Card className="bg-white">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <FaBoxes className="mr-3 text-3xl text-blue-500" />
                                            <div>
                                                <CardTitle>{t("Products")}</CardTitle>
                                                <CardDescription>{t("Total number of products in stock")}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-3xl font-bold">{productsCount}</p>
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
                                            <FaClipboardCheck className="mr-3 text-3xl text-green-500" />
                                            <div>
                                                <CardTitle>{t("Delivered Orders")}</CardTitle>
                                                <CardDescription>{t("Total delivered orders")}</CardDescription>
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


Dashboard.layout = (page) => (
    <AuthenticatedLayout
        user={page.props.auth.user}
        site_settings={page.props.site_settings}
    >
        {page}
    </AuthenticatedLayout>
);

export default Dashboard;
