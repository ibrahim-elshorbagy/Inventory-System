import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";
import React from "react";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import { useState } from 'react';
import TextAreaInput from "@/Components/TextAreaInput";



//Details for order


const resources = {
    en: {
        translation: {},
    },
    ar: {
        translation: {
            "Orders": "المنتجات",
            "ID": "الرقم التعريفي",
            "Product Name": "اسم المنتج",
            "Quantity": "الكمية",
            "Warehouse": "المخزن",
            "Create Date": "تاريخ الإنشاء",
            'Update Date': 'تاريخ التحديث',
            "Category": "الصنف",
            "Subcategory": "الصنف الفرعي",
            "Description": "الوصف",
            "Notes": "الملاحظات",
            "Image": "الصورة",
            "No orders available": "لا يوجد طلبات متاحة",
            "Customer Info": "معلومات العميل",
            "Customer Name": "اسم العميل",
            "Customer Email": "البريد الإلكتروني للعميل",
            "Customer Phone": "تليفون العميل",
            "Update Status": "تحديث الحالة",
            "Status": "الحالة",
            "Approved": "موافقة",
            "Rejected": "مرفوضة",
            "Pending": "قيد الانتظار",
            "You Can't Undo This Action. Are You Sure?": "لا يمكن التراجع عن هذا الإجراء. هل أنت متاكد؟",
            "Order Description":"بيان"


        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function Index({ auth, products,order }) {
    const { t } = useTranslation();

    const { data, setData, post } = useForm({
        status: order.status,
        description:order.description,
    });

    const [status,setStatus]= useState(order.status);
    const handleStatusChange = (e) => {
        setData("status", e.target.value);
    };

    const onSubmit = (e) => {
        const confirmationMessage = t("You Can't Undo This Action. Are You Sure?");
        if (data.status === "approved") {
            if (!window.confirm(confirmationMessage)) {
            return;
        }
        }


        e.preventDefault();
        post(route("stock.change.status", { order: order.id }));
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
                        {t("Orders")}
                    </h2>
                </div>
            }
        >
            <Head title={t("Orders")} />

            <div className="py-12">
                <div className="mx-auto sm:px-6 lg:px-8">

                    <div className="p-6 mb-6 bg-white shadow-sm dark:text-white dark:bg-gray-800 sm:rounded-lg">
                    {/* Customer Info Section */}

                        <h3 className="text-lg font-semibold">{t("Customer Info")}</h3>
                        <p>{t("Customer Name")}: {products.data[0].user.name}</p>
                        <p>{t("Customer Email")}: {products.data[0].user.email}</p>
                        <p>{t("Customer Phone")}: {products.data[0].user.phone}</p>
                        <br/>
                        <p>{t("Order Description")}:</p>
                        <p>{data.description}</p>

                    {/* Status Change Form */}
                    <form onSubmit={onSubmit} className="grid grid-cols-6 gap-6">
                            <div className="grid grid-cols-2 col-span-2">
                                    <div className="col-span-1 mt-4">
                                        <InputLabel htmlFor="status" value={t("Status")} />

                                        <SelectInput
                                            name="status"
                                            id="status"
                                            className="block w-full mt-1"
                                            value={data.status}
                                            onChange={handleStatusChange}
                                            disabled={!auth.user.permissions.includes("ChangeStatus-stock-order") || status === "approved"}

                                        >
                                            <option value="pending">{t("Pending")}</option>
                                            <option value="approved">{t("Approved")}</option>
                                            <option value="rejected">{t("Rejected")}</option>
                                        </SelectInput>
                                    </div>
                        {auth.user.permissions.includes("ChangeStatus-stock-order") && status !== "approved" && (
                                < div className="col-span-2">
                                    <div>
                                    <InputLabel htmlFor={`description`} value={t("Description")} />
                                    <TextAreaInput
                                        id={`description`}
                                        name="description"
                                        value={data.description}
                                        className="block w-full mt-1 dark:bg-gray-700 dark:text-gray-200"
                                        onChange={(e) => setData("description", e.target.value)}
                                    />
                                            </div>

                                    <div className="mt-4">
                                        <button type="submit" className="px-4 py-2 text-white rounded bg-burntOrange">
                                            {t("Update Status")}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </form>
                    </div>


                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">

                                {/* Orders Table */}
                                <table className="w-full mt-6 text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th className="px-3 py-3">{t("ID")}</th>
                                            <th className="px-3 py-3">{t("Product Name")}</th>
                                            <th className="px-3 py-3">{t("Quantity")}</th>
                                            <th className="px-3 py-3">{t("Category")}</th>
                                            <th className="px-3 py-3">{t("Subcategory")}</th>
                                            <th className="px-3 py-3">{t("Warehouse")}</th>
                                            <th className="px-3 py-3">{t("Description")}</th>
                                            <th className="px-3 py-3">{t("Notes")}</th>
                                            <th className="px-3 py-3 text-center" colSpan="3">{t("Image")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.data.length === 0 ? (
                                            <tr>
                                                <td colSpan="11" className="px-6 py-4 text-center">
                                                    {t("No orders available")}
                                                </td>
                                            </tr>
                                        ) : (
                                            products.data.map((product) => (
                                                <tr
                                                    key={product.id}
                                                    className="text-base bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                >
                                                    <td className="px-3 py-2">{product.id}</td>
                                                    <td className="px-3 py-2">{product.name}</td>
                                                    <td className="px-3 py-2">{product.quantity}</td>
                                                    <td className="px-3 py-2">{product.category.name}</td>
                                                    <td className="px-3 py-2">{product.subcategory.name}</td>
                                                    <td className="px-3 py-2">{product.warehouse.name}</td>
                                                    <td className="px-3 py-2">{product.description}</td>
                                                    <td className="px-3 py-2">{product.notes}</td>
                                                    <td className="flex justify-center px-3 py-2" colSpan="3">
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="object-cover w-32 rounded-md"
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                <div className="mt-6">
                                    <Pagination links={products.meta.links} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
