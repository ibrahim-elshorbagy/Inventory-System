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
            "Category": "الصنف",
            "Subcategory": "الصنف الفرعي",
            "Image": "الصورة",
            "Admin Confirmation": "تأكيد الادارة",
            "You Can't Undo This Action. Are You Sure?":"لا يمكن التراجع عن هذا الإجراء. هل أنت متاكد؟",



        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function Index({ auth,site_settings, order, error,success }) {
    const { t } = useTranslation();


    const { data, setData, post } = useForm({

        status: order.status,
        confirmed: order.confirmed,
    });


    const onSubmit = (e) => {
        console.log(data.status === "delivered")
        console.log(data.confirmed === "approved")
        if (data.status === "delivered" && data.confirmed === "approved") {
            const confirmationMessage = t("You Can't Undo This Action. Are You Sure?");

            if (!window.confirm(confirmationMessage)) {
            return;

        }
        }

        e.preventDefault();
        post(route("admin.orders.changeStatus", order.id));
    };

    const [confirmed,setConfirmed]= useState(order.confirmed);

    return (
        <AuthenticatedLayout
            user={auth.user}
            site_settings={site_settings}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold leading-tight md:text-lg dark:text-gray-200">
                        {t("Orders Report")}
                    </h2>
                    <div className="flex gap-3">
                        {/* Additional buttons can go here */}
                    </div>
                </div>
            }
        >
            <Head title={site_settings.websiteName + " - " +t("Orders Report")} />


            <div className="">
                <div className="mx-auto ">

                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-2 text-gray-900 dark:text-gray-100">
                            <div className="">
                                {/* Customer and Order Description Section */}
                                <section className="mb-6">
                                    <h3 className="text-lg font-semibold">{t("Customer Info")}</h3>
                                    <p>{t("Customer Name")}: {order.customer_name}</p>
                                    <p>{t("Customer Phone")}: {order.customer_phone}</p>
                                    <p>{t("Customer Address")}: {order.customer_address}</p>
                                    <p>{t("Order Description")}: {order.description}</p>
                                    <p>{t("Delivery Address")}: {order.delivery_address}</p>
                                    <div className="flex gap-3 mt-4 text-xs md:text-sm">
                                        <p className={`inline-block px-2 py-1 rounded-full  font-semibold ${
                                            order.status === 'pending' ? 'bg-yellow-500 text-black' :
                                            order.status === 'rejected' ? 'bg-red-500 text-white' :
                                            order.status === 'approved' ? 'bg-green-500 text-white' :
                                            order.status === 'delivered' ? 'bg-blue-500 text-white' :
                                            'bg-gray-500 text-white'
                                        }`}>
                                            {t("Status")}:
                                            {order.status === 'pending' ? t('Pending') :
                                            order.status === 'rejected' ? t('Rejected') :
                                            order.status === 'approved' ? t('Approved') :
                                            order.status === 'delivered' ? t('Delivered') :
                                            t('Unknown')}
                                        </p>

                                        <p className={`inline-block px-2 py-1 rounded-full  font-semibold ${
                                            order.confirmed === 'pending' ? 'bg-yellow-500 text-black' :
                                            order.confirmed === 'approved' ? 'bg-green-500 text-white' :
                                            order.confirmed === 'rejected' ? 'bg-red-500 text-white' :
                                            'bg-gray-500 text-white'
                                        }`}>
                                            {t("Admin Confirmation")}:
                                            {order.confirmed === 'pending' ? t('Pending') :
                                            order.confirmed === 'rejected' ? t('Rejected') :
                                            order.confirmed === 'approved' ? t('Approved') :
                                            t('Unknown')}
                                            </p>
                                    </div>
                                </section>

                                {/* Orders Table */}
                                <div className="overflow-auto">
                                    <table className="w-full mt-6 text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr className="text-nowrap">
                                                <th className="p-3">{t("ID")}</th>
                                                <th className="p-3">{t("Product Name")}</th>
                                                <th className="p-3">{t("Orderd Quantity")}</th>
                                                <th className="p-3">{t("Max Quantity")}</th>
                                                <th className="p-3">{t("Category")}</th>
                                                <th className="p-3">{t("Subcategory")}</th>
                                                <th className="p-3">{t("Warehouse")}</th>
                                                <th className="p-3 text-center" colSpan="3">{t("Image")}</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                order.requests.map((request, index) => (
                                                    <tr
                                                        className={`${
                                                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                                            } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}
                                                        key={index}
                                                    >
                                                        <td className="p-3">{request.id}</td>
                                                        <td className="p-3 text-nowrap">{request.product_name}</td>
                                                        <td className="p-3 text-nowrap">{request.quantity}</td>
                                                        <td className="p-3 text-nowrap">{request.max_quantity}</td>
                                                        <td className="p-3 text-nowrap">{request.product_category}</td>
                                                        <td className="p-3 text-nowrap">{request.product_subcategory}</td>
                                                        <td className="p-3 text-nowrap">{request.warehouse_name}</td>
                                                        <td className="flex justify-center p-3" colSpan="3">
                                                            <img
                                                                src={request.product_image}
                                                                alt={request.product_name}
                                                                className="object-cover w-32 rounded-md"
                                                            />
                                                        </td>

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
            </div>
        </AuthenticatedLayout>
    );
}
