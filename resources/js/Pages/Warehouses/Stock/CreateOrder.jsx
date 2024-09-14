import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import TextAreaInput from "@/Components/TextAreaInput";
import Input from "@/Components/ui/input";


//this page for start new adding order with products to customer page


const resources = {
    en: {
        translation: {},
    },
    ar: {
        translation: {
            "Add Items Order To": " طلب اضافة منتجات الي",
            "Stocks": "التخزين",
            "Item Name": "اسم المنتج",
            "Cancel": "إلغاء",
            "Submit": "إرسال",
            "Warehouse": "المخزن",
            "Select Warehouse": "اختر المخزن",
            "Quantity": "الكميه",
            "Delete": "حذف",
            "Add Another Product": "اضافة منتج اخر",
            "Description": "وصف",
            "Select Category": "اختر الصنف",
            "Select Subcategory": "اختر الصنف الفرعي",
            "Upload Image": "رفع صورة",
            "Notes": "ملاحظات",
            "Category": "الصنف",
            "Subcategory": "الصنف الفرعي",
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function Create({ auth, customer, warehouses, categories = [] }) {
    const { t } = useTranslation();

    const { data, setData, post, errors } = useForm({
        user_id: customer.user.id,
        product_quantities: [],
    });

    const [productSelections, setProductSelections] = useState([
        { name: "", quantity: "", description: "", notes: "", category_id: "", subcategory_id: "", warehouse_id: "", image_url: "" },
    ]);

    useEffect(() => { setData("product_quantities", productSelections); }, [productSelections]);

    const handleProductChange = (index, field, value) => {
        const newSelections = [...productSelections];
        newSelections[index][field] = value;

        // Clear subcategory if category is changed
        if (field === "category_id") {
            newSelections[index]["subcategory_id"] = "";
        }

        setProductSelections(newSelections);
    };

    const handleImageUpload = (index, file) => {
        const newSelections = [...productSelections];
        newSelections[index].image_url = file; // Store the file directly

        newSelections[index].image_show = URL.createObjectURL(file);

        setProductSelections(newSelections);
    };

    const addProductSelection = () => {
        setProductSelections([
            ...productSelections,
            { name: "", quantity: "", description: "", notes: "", category_id: "", subcategory_id: "", warehouse_id: "", image_url: "" },
        ]);
    };

    const deleteProductSelection = (index) => {
        const newSelections = productSelections.filter((_, i) => i !== index);
        setProductSelections(newSelections);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setData("product_quantities", productSelections);
        post(route("stock.add"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
                        {t("Add Items Order To")} {customer.user.name}
                    </h2>
                </div>
            }
        >
            <Head title={t("Stocks")} />
            <div className="py-12">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <form onSubmit={onSubmit} className="p-4 bg-white shadow sm:p-8 dark:bg-gray-800 sm:rounded-lg">

                            <hr className="my-6 dark:border-gray-600" />

                            <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th>{t("Item Name")}</th>
                                        <th>{t("Description")}</th>
                                        <th>{t("Notes")}</th>
                                        <th>{t("Category")}</th>
                                        <th>{t("Subcategory")}</th>
                                        <th className="w-24">{t("Quantity")}</th>
                                        <th>{t("Warehouse")}</th>
                                        <th>{t("Upload Image")}</th>
                                        <th>{t("Delete")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productSelections.map((selection, index) => (
                                        <tr key={index} className="border-b dark:border-gray-700">
                                            <td className="p-1">
                                                <TextInput
                                                    id={`name_${index}`}
                                                    type="text"
                                                    name={`name_${index}`}
                                                    value={selection.name}
                                                    onChange={(e) => handleProductChange(index, "name", e.target.value)}
                                                    placeholder={t("Item Name")}
                                                    className="block w-full mt-1"
                                                />
                                            </td>
                                            <td className="p-1">
                                                <TextAreaInput
                                                    id={`description_${index}`}
                                                    type="text"
                                                    name={`description_${index}`}
                                                    value={selection.description}
                                                    onChange={(e) => handleProductChange(index, "description", e.target.value)}
                                                    placeholder={t("Description")}
                                                    className="block w-full mt-1"
                                                />
                                            </td>
                                            <td className="p-1">
                                                <TextAreaInput
                                                    id={`notes_${index}`}
                                                    type="text"
                                                    name={`notes_${index}`}
                                                    value={selection.notes}
                                                    onChange={(e) => handleProductChange(index, "notes", e.target.value)}
                                                    placeholder={t("Notes")}
                                                    className="block w-full mt-1"
                                                />
                                            </td>
                                            <td className="p-1">
                                                <SelectInput
                                                    name={`category_${index}`}
                                                    id={`category_${index}`}
                                                    className="block w-full mt-1"
                                                    value={selection.category_id}
                                                    onChange={(e) => handleProductChange(index, "category_id", e.target.value)}
                                                >
                                                    <option value="">{t("Select Category")}</option>
                                                    {categories.map((category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </SelectInput>
                                            </td>
                                            <td className="p-1">
                                                <SelectInput
                                                    name={`subcategory_${index}`}
                                                    id={`subcategory_${index}`}
                                                    className="block w-full mt-1"
                                                    value={selection.subcategory_id}
                                                    onChange={(e) => handleProductChange(index, "subcategory_id", e.target.value)}
                                                    disabled={!selection.category_id} // Disable until category is selected
                                                >
                                                    <option value="">{t("Select Subcategory")}</option>
                                                    {categories
                                                        .find((category) => category.id == selection.category_id)
                                                        ?.sub_categories.map((subcategory) => (
                                                            <option key={subcategory.id} value={subcategory.id}>
                                                                {subcategory.name}
                                                            </option>
                                                        ))}
                                                </SelectInput>
                                            </td>
                                            <td className="p-1">
                                                <TextInput
                                                    id={`quantity_${index}`}
                                                    type="number"
                                                    name={`quantity_${index}`}
                                                    value={selection.quantity}
                                                    onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                                                    placeholder={t("Quantity")}
                                                    className="block w-full mt-1"
                                                />
                                            </td>
                                            <td className="p-1">
                                                <SelectInput

                                                    name={`warehouse_${index}`}
                                                    id={`warehouse_${index}`}
                                                    className="block w-full mt-1"
                                                    value={selection.warehouse_id}
                                                    onChange={(e) => handleProductChange(index, "warehouse_id", e.target.value)}
                                                >
                                                    <option value="">{t("Select Warehouse")}</option>
                                                    {warehouses.map((warehouse) => (
                                                        <option key={warehouse.id} value={warehouse.id}>
                                                            {warehouse.name}
                                                        </option>
                                                    ))}
                                                </SelectInput>
                                            </td>
                                            <td className="w-56 p-1">
                                                <div className="flex w-full gap-2">

                                                <Input
                                                    type="file"
                                                    id={`image_${index}`}
                                                    className="block w-full mt-1"
                                                    onChange={(e) => handleImageUpload(index, e.target.files[0])}
                                                />
                                                 {(selection.image_url || selection.image_show) && (
                                                            <img
                                                                src={selection.image_show || selection.image_url}
                                                                alt="Product Image"
                                                                className="object-cover w-1/4 h-10 rounded"
                                                            />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-1">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-800"
                                                    onClick={() => deleteProductSelection(index)}
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <button
                                type="button"
                                className="px-4 py-2 mt-10 text-white bg-blue-500 rounded hover:bg-blue-600"
                                onClick={addProductSelection}
                            >
                                {t("Add Another Product")}
                            </button>

                            {/* Error Section */}
                            {Object.keys(errors).length > 0 && (
                                <div className="px-4 py-2 my-4 text-white bg-red-600 rounded">
                                    <ul>
                                        {Object.entries(errors).map(([field, errorMessage], index) => (
                                            <li key={index}>{errorMessage}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex gap-2 mt-4 text-right">
                                <Link
                                    href={route("customer.index")}
                                    className="px-3 py-1 mr-2 text-gray-800 transition-all bg-gray-100 rounded shadow hover:bg-gray-200"
                                >
                                    {t("Cancel")}
                                </Link>
                                <button className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover">
                                    {t("Submit")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}