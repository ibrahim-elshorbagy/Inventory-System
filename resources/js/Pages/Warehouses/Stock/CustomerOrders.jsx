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

export default function Index({ auth,site_settings, user = null, orders, queryParams = null }) {
    const { t } = useTranslation();

    queryParams = queryParams || {};







    const deleteOrder = (order) => {
        const confirmationMessage = t("Are you sure you want to delete the order?");
        if (!window.confirm(confirmationMessage)) {
            return;
        }

        router.delete(route("stock.destroy.order", order), {

        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
                          site_settings={site_settings}

            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold leading-tight md:text-lg dark:text-gray-200">
                        {t("Additions Orders")}  {user ? " - " + user.name : ""}
                    </h2>
                    <div className="flex gap-3">
                        {auth.user.permissions.includes("add-stock-order") && user && (
                            <Link
                                href={route("stock.add.page", user.id)}
                                className="px-3 py-1 text-sm text-white transition-all rounded shadow md:text-lg text-nowrap bg-burntOrange hover:bg-burntOrangeHover"
                            >
                                {t("New Add Order")}
                            </Link>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={site_settings.websiteName + " - " +t("Additions Orders")} />

            <div className="">
                <div className="mx-auto ">

                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-2 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr className="text-nowrap">
                                            <td className="p-3">
                                                {t("ID")}
                                            </td>
                                            <th className="p-3">{t("Status")}</th>
                                            <th className="p-3">{t("Create Date")}</th>
                                            <th className="p-3">{t("Update Date")}</th>
                                            <th className="p-3">{t("Actions")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders && orders.data.length > 0 ? (
                                            orders.data.map((order,index) => (
                                                <tr
                                                    className={`${
                                                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                                        } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}

                                                    key={order.id}
                                                >
                                                    <td className="p-3">{order.id}</td>
                                                    <td className="p-3 text-nowrap">
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
                                                    <td className="p-3 text-nowrap">{order.created_at}</td>
                                                    <td className="p-3 text-nowrap">{order.updated_at}</td>
                                                    <td className="p-3 text-nowrap">
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
                                                <td colSpan="5" className="p-3 text-center">
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
