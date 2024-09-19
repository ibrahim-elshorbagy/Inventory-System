import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";
import { useState, useEffect } from "react";


//this to see all customers orders (one or all customers)

const resources = {
    en: {
        translation: {},
    },
    ar: {
        translation: {
            "Products": "المنتجات",
            "Add new": "إضافة جديد",
            "ID": "الرقم التعريفي",
            "Name": "الاسم",
            "Create Date": "تاريخ الإنشاء",
            'Update Date': 'تاريخ التحديث',
            "Actions": "الإجراءات",
            "Products Name": "اسم المنتج",
            "Edit": "تعديل",
            "Delete": "حذف",
            "Are you sure you want to delete the order?": "هل أنت متأكد أنك تريد حذف الطلب؟",
            "No Orders available": "لا يوجد طلبات متاحة",
            "Phone": "التليفون",
            "Address": "العنوان",
            "Product Name": "اسم المنتج",
            "Quantity": "الكمية",
            "Additions Orders": "طلبات الاضافة",
            "Status": "الحالة",
            "Approved": "موافقة",
            "Rejected": "مرفوضة",
            "Pending": "قيد الانتظار",
            "Details": "تفاصيل",
            "New Add Order": "طلب أضافة جديد",

        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function Index({ auth, user = null, orders, queryParams = null, success }) {
    const { t } = useTranslation();

    queryParams = queryParams || {};

    const [visibleSuccess, setVisibleSuccess] = useState(success);

    useEffect(() => {
        if (success) {
            setVisibleSuccess(success);

            const timer = setTimeout(() => {
                setVisibleSuccess(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [success]);

    const deleteOrder = (order) => {
        const confirmationMessage = t("Are you sure you want to delete the order?");
        if (!window.confirm(confirmationMessage)) {
            return;
        }

        router.delete(route("stock.destroy.order", order), {
            onSuccess: (page) => {
                setVisibleSuccess(page.props.success);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
                        {t("Additions Orders")}  {user ? " - " + user.name : ""}
                    </h2>
                    <div className="flex gap-3">
                        {auth.user.permissions.includes("add-stock-order") && user && (
                            <Link
                                href={route("stock.add.page", user.id)}
                                className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
                            >
                                {t("New Add Order")}
                            </Link>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={t("Additions Orders")} />

            <div className="py-12">
                <div className="mx-auto sm:px-6 lg:px-8">
                    {visibleSuccess && (
                        <div className="px-4 py-2 mb-4 text-white rounded bg-burntOrange">
                        {visibleSuccess}
                        </div>
                            )}
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr className="text-nowrap">
                                            <td className="px-3 py-3">
                                                {t("ID")}
                                            </td>
                                            <th className="px-3 py-3">{t("Status")}</th>
                                            <th className="px-3 py-3">{t("Create Date")}</th>
                                            <th className="px-3 py-3">{t("Update Date")}</th>
                                            <th className="px-3 py-3">{t("Actions")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders && orders.data.length > 0 ? (
                                            orders.data.map((order) => (
                                                <tr
                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                    key={order.id}
                                                >
                                                    <td className="px-3 py-2">{order.id}</td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        <span
                                                            className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                                                                order.status === 'pending' ? 'bg-yellow-500 text-black' :
                                                                order.status === 'rejected' ? 'bg-red-500 text-white' :
                                                                order.status === 'approved' ? 'bg-green-500 text-white' :
                                                                'bg-gray-500 text-white'
                                                            }`}
                                                        >
                                                            {order.status === 'pending' ? t('Pending') :
                                                            order.status === 'rejected' ? t('Rejected') :
                                                            order.status === 'approved' ? t('Approved') :
                                                            t('Unknown')}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">{order.created_at}</td>
                                                    <td className="px-3 py-2 text-nowrap">{order.updated_at}</td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        <div className="flex gap-3">
                                                        {auth.user.permissions.includes("show-stock-order") &&  (
                                                            <Link
                                                                href={route("stock.show.order", { order: order.id })}
                                                                className="font-medium text-emerald-600 dark:text-emerald-500 hover:underline"
                                                            >
                                                                {t("Details")}
                                                            </Link>
                                                        )}
                                                        {auth.user.permissions.includes("edit-stock-order") && order.status === 'pending' && (
                                                            <Link
                                                                href={route("stock.edit.page", { order: order.id })}
                                                                className="font-medium text-blue-500 hover:underline"
                                                            >
                                                                {t("Edit")}
                                                            </Link>
                                                            )}
                                                            {auth.user.permissions.includes("delete-stock-order") && order.status !== 'approved'  && (
                                                            <button
                                                                    onClick={(e) => deleteOrder(order.id)}
                                                                    className="mx-1 font-medium text-red-600 dark:text-red-500 hover:underline"
                                                                    >
                                                                    {t("Delete")}
                                                            </button>
                                                            )}
                                                            </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-3 py-2 text-center">
                                                    {t("No Orders available")}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {orders && <Pagination links={orders.meta.links} />}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
