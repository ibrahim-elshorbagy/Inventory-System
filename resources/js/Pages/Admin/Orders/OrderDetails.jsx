import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";
import { useState, useEffect } from "react";
import TableHeading from "@/Components/TableHeading";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";

const resources = {
    en: {
        translation: {},
    },
    ar: {
        translation: {
            "Orders": "المنتجات",
            "Add new": "إضافة جديد",
            "ID": "الرقم التعريفي",
            "Name": "الاسم",
            "Create Date": "تاريخ الإنشاء",
            'Update Date': 'تاريخ التحديث',
            "Actions": "الإجراءات",
            "Edit": "تعديل",
            "Delete": "حذف",
            "No orders available": "لا يوجد طلبات متاحة",
            "Phone": "التليفون",
            "Address": "العنوان",
            "Warehouse": "المخزن",
            "Product Name": "اسم المنتج",
            "Quantity": "الكمية",
            "Orders Report": "تقرير الطلبات",
            "Order Orders Release": "طلب ارجاع منتجات",
            "description": "البيان",
            "Status": "الحالة",
            "Pending": "قيد الانتظار",
            "Approved": "موافقة",
            "Rejected": "مرفوضة",
            "Are you sure you want to Cancel The Order?": "هل تريد الغاء الطلب؟",
            "Details": "تفاصيل",
            "Customer Info": "معلومات العميل",
            "Customer Name": "اسم العميل",
            "Customer Phone": "تليفون العميل",
            "Customer Address": "عنوان العميل",
            "Order Description": "وصف الطلب",
            "Select Status": "اختر الحالة",
            "Update Status": "تحديث الحالة",
            "Delivered": "تم التوصيل",
            "Max Quantity": "الكمية الكاملة",
            "Orderd Quantity": "الكمية المطلوبة",
            "Delivery Address": "عنوان التسليم",

        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function Index({ auth, order, error,success }) {
    const { t } = useTranslation();


    const { data, setData, post } = useForm({
        status: order.status,
    });

    const handleStatusChange = (e) => {
        setData("status", e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("admin.orders.changeStatus", order.id));
    };



    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
                        {t("Orders Report")}
                    </h2>
                    <div className="flex gap-3">
                        {/* Additional buttons can go here */}
                    </div>
                </div>
            }
        >
            <Head title={t("Orders Report")} />
            {JSON.stringify(error)}
            {JSON.stringify(success)}

            <div className="py-12">
                <div className="mx-auto sm:px-6 lg:px-8">

                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                {/* Customer and Order Description Section */}
                                <section className="mb-6">
                                    <h3 className="text-lg font-semibold">{t("Customer Info")}</h3>
                                    <p>{t("Customer Name")}: {order.customer_name}</p>
                                    <p>{t("Customer Phone")}: {order.customer_phone}</p>
                                    <p>{t("Customer Address")}: {order.customer_address}</p>
                                    <p>{t("Order Description")}: {order.description}</p>
                                    <p>{t("Delivery Address")}: {order.delivery_address}</p>
                                </section>

                                {/* Status Change Form */}
                                <form onSubmit={onSubmit} className="grid grid-cols-6 gap-6">
                                <div>
                                    <div className="mt-4">
                                        <InputLabel htmlFor="status" value={t("Status")} />

                                        <SelectInput
                                            name="status"
                                            id="status"
                                            className="block w-full mt-1"
                                            value={data.status}
                                            onChange={handleStatusChange}
                                        >
                                            <option value="pending">{t("Pending")}</option>
                                            <option value="approved">{t("Approved")}</option>
                                            <option value="rejected">{t("Rejected")}</option>
                                            <option value="delivered">{t("Delivered")}</option>
                                        </SelectInput>
                                    </div>

                                    <div className="mt-4">
                                        <button type="submit" className="px-4 py-2 text-white rounded bg-burntOrange">
                                            {t("Update Status")}
                                        </button>
                                        </div>
                                    </div>
                                </form>

                                {/* Orders Table */}
                                <table className="w-full mt-6 text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr className="text-nowrap">
                                            <th className="px-3 py-3">{t("ID")}</th>
                                            <th className="px-3 py-3">{t("Product Name")}</th>
                                            <th className="px-3 py-3">{t("Orderd Quantity")}</th>
                                            <th className="px-3 py-3">{t("Max Quantity")}</th>
                                            <th className="px-3 py-3">{t("Warehouse")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            order.requests.map((request, index) => (
                                                <tr
                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                    key={index}
                                                >
                                                    <td className="px-3 py-2">{request.id}</td>
                                                    <td className="px-3 py-2 text-nowrap">{request.product_name}</td>
                                                    <td className="px-3 py-2 text-nowrap">{request.quantity}</td>
                                                    <td className="px-3 py-2 text-nowrap">{request.max_quantity}</td>
                                                    <td className="px-3 py-2 text-nowrap">{order.warehouse_name}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
