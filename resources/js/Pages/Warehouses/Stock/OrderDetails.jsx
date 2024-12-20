import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";
import React from "react";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import { useState, useEffect } from "react";


//Details for order


const resources = {
    en: {
        translation: {},
    },
    ar: {
        translation: {
            "Addition Order": "طلب اضافة",
            "ID": "الرقم التعريفي",
            "Product Name": "اسم المنتج",
            "Quantity": "الكمية",
            "Warehouse": "المخزن",
            "Create Date": "تاريخ الإنشاء",
            'Update Date': 'تاريخ التحديث',
            "Category": "الصنف",
            "Subcategory": "الصنف الفرعي",
            "Description": "بيان",
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

function Index({ auth,site_settings, products,order,danger }) {
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
        <>
            <Head title={site_settings.websiteName + " - " +t("Addition Order")} />

            <div className="">
                <div className="flex items-start justify-between p-5 mb-5 text-sm font-semibold leading-tight border-b md:text-lg dark:text-gray-200">
                    <h2>
                        {t("Addition Order")}
                    </h2>
                </div>

                <div className="m-2 ">

                    <div className="p-6 mb-6 bg-gray-100 rounded-md shadow-md dark:text-white dark:bg-gray-700">
                    {/* Customer Info Section */}

                        <h3 className="text-lg font-semibold">{t("Customer Info")}</h3>
                        <p>{t("Customer Name")}: {products.data[0].user.name}</p>
                        <p>{t("Customer Email")}: {products.data[0].user.email}</p>
                        <p>{t("Customer Phone")}: {products.data[0].user.phone}</p>
                        <br/>
                        <p>{data.description && (t("Order Description"))  }</p>
                        <p className="my-2">{data.description}</p>

                    {/* Status Change Form */}
                    <form onSubmit={onSubmit} className="">
                            <div className="flex flex-col gap-3">
                                    <div className="w-full lg:w-1/5">
                                        <InputLabel htmlFor="status" value={t("Status")} />

                                        <SelectInput
                                            name="status"
                                            id="status"
                                            className="block w-full mt-1"
                                            value={data.status}
                                            onChange={handleStatusChange}
                                            disabled={!auth.user.permissions.includes("confirme-stock-order") || status === "approved"}

                                        >
                                            <option value="pending">{t("Pending")}</option>
                                            <option value="approved">{t("Approved")}</option>
                                            <option value="rejected">{t("Rejected")}</option>
                                        </SelectInput>
                                    </div>
                        {auth.user.permissions.includes("confirme-stock-order") && status !== "approved" && (
                                < div className="w-full lg:w-2/5">
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

                    <div className="bg-gray-100 rounded-md shadow-md dark:text-white dark:bg-gray-700">
                        <div className="text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">

                                {/* Orders Table */}
                                <table className="w-full mt-6 text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 md:text-base bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th className="p-3 text-nowrap">{t("ID")}</th>
                                            <th className="p-3 text-nowrap">{t("Product Name")}</th>
                                            <th className="p-3 text-nowrap">{t("Quantity")}</th>
                                            <th className="p-3 text-nowrap">{t("Category")}</th>
                                            <th className="p-3 text-nowrap">{t("Subcategory")}</th>
                                            <th className="p-3 text-nowrap">{t("Warehouse")}</th>
                                            <th className="p-3 text-nowrap">{t("Description")}</th>
                                            <th className="p-3 text-nowrap">{t("Notes")}</th>
                                            <th className="p-3 text-center text-nowrap" colSpan="3">{t("Image")}</th>
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
                                            products.data.map((product,index) => (
                                                <tr
                                                    key={product.id}
                                                    className={`${
                                                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                                        } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}

                                                >
                                                    <td className="p-3">{product.id}</td>
                                                    <td className="p-3">{product.name}</td>
                                                    <td className="p-3">{product.quantity}</td>
                                                    <td className="p-3">{product.category.name}</td>
                                                    <td className="p-3">{product.subcategory.name}</td>
                                                    <td className="p-3">{product.warehouse.name}</td>
                                                    <td className="p-3">{product.description}</td>
                                                    <td className="p-3">{product.notes}</td>
                                                    <td className="flex justify-center p-3" colSpan="3">
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
        </>
    );
}


Index.layout = (page) => (
    <AuthenticatedLayout
        user={page.props.auth.user}
        site_settings={page.props.site_settings}


    >
        {page}
    </AuthenticatedLayout>
);

export default Index;
