import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next"; // Import translation hook
import i18n from "@/i18nConfig";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

const resources = {
    en: {
        translation: {},
    },
    ar: {
        translation: {
            "Edit Stock for": " تعديل المخزون ل",
            "Stocks": "التخزين",
            "Stock Name": "اسم االتخزين",
            "Status": "الحالة",
            "Select Status": "اختر الحاله",
            "Cancel": "إلغاء",
            "Submit": "إرسال",
            'Active': 'نشط',
            'Inactive': 'غير نشط',
            "Warehouse": 'المخزن',
            "Select Warehouse": "اختر المخزن",
            "Quantity": "الكميه",
            "Product": "المنتج",
            "Select Product": "اختر المنتج",
            "Delete": "حذف",
            "Add Another Product": "اضافة منتج اخر",
            "Unit": "الوحدة",
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function Edit({ auth, customer, warehouses, products, myProducts }) {
    const { t } = useTranslation();

    const { data, setData, put, errors } = useForm({
        user_id: customer.user.id,
        warehouse_id: myProducts.length > 0 ? myProducts[0].warehouse_id : "",
        product_quantities: myProducts.map(product => ({
            product_id: product.product_id,
            quantity: product.quantity,
            unit: product.product.unit,
        })),
    });

    const [productSelections, setProductSelections] = useState(data.product_quantities);

    useEffect(() => {
        setData("product_quantities", productSelections);
    }, [productSelections]);

    const handleProductChange = (index, field, value) => {
        const newSelections = [...productSelections];
        newSelections[index][field] = value;

        if (field === "product_id") {
            const selectedProduct = products.find(product => product.id === parseInt(value));
            newSelections[index]["unit"] = selectedProduct ? selectedProduct.unit : "";
        }

        setProductSelections(newSelections);
    };

    const addProductSelection = () => {
        setProductSelections([
            ...productSelections,
            { product_id: "", quantity: "", unit: "" },
        ]);
    };

    const deleteProductSelection = (index) => {
        const newSelections = productSelections.filter((_, i) => i !== index);
        setProductSelections(newSelections);
    };

    const filteredProducts = (selectedProductId) => {
        return products.filter(
            (product) => !productSelections.some(
                (selection) => selection.product_id == product.id
            ) || product.id == selectedProductId
        );
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setData("product_quantities", productSelections);
        put(route("stock.update", customer.user.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
                        {t("Edit Stock for")} {customer.user.name}
                    </h2>
                </div>
            }
        >
            <Head title={t("Stocks")} />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <form
                            onSubmit={onSubmit}
                            className="p-4 bg-white shadow sm:p-8 dark:bg-gray-800 sm:rounded-lg"
                        >

                            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-6">
                                <div className="mt-4">
                                    <InputLabel htmlFor="warehouse" value={t("Warehouse")} />

                                    <SelectInput
                                        name="warehouse"
                                        id="warehouse"
                                        className="block w-full mt-1"
                                        value={data.warehouse_id}
                                        onChange={(e) => setData("warehouse_id", e.target.value)}
                                    >
                                        <option value="">{t("Select Warehouse")}</option>
                                        {warehouses.map((warehouse) => (
                                            <option key={warehouse.id} value={warehouse.id}>
                                                {warehouse.name}
                                            </option>
                                        ))}
                                    </SelectInput>

                                    <InputError message={errors.warehouse_id} className="mt-2" />
                                </div>


                            </div>


                            <hr className="my-6 dark:border-gray-600" />
                            {errors.product_quantities && (
                                <div className="mb-4">
                                    <InputError message={errors.product_quantities} className="mb-4" />
                                </div>
                            )}
                            {productSelections.map((selection, index) => (
                                <div
                                    key={index}
                                    className="grid items-center justify-center grid-cols-8 gap-4 m-4 mb-4 text-center sm:gap-6 sm:mb-6"
                                >
                                    <div className="grid items-center w-full grid-cols-1 col-span-3 ">
                                        <div className="flex items-center justify-center gap-2">
                                        <InputLabel htmlFor={`product_${index}`} value={t("Product")} />
                                        <SelectInput
                                            name={`product_${index}`}
                                            id={`product_${index}`}
                                            className="block w-full mt-1"
                                            value={selection.product_id}
                                            onChange={(e) =>
                                                handleProductChange(
                                                    index,
                                                    "product_id",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">{t("Select Product")}</option>
                                            {filteredProducts(selection.product_id).map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name}
                                                </option>
                                            ))}
                                            </SelectInput>
                                            </div>
                                        <InputError message={errors[`product_quantities.${index}.product_id`]} className="mt-2" />
                                    </div>

                                    <div
                                        className={`flex items-center justify-center  gap-2 ${
                                            errors[`product_quantities.${index}.product_id`] ? 'mb-6' : ''
                                        }`}
                                    >
                                        <InputLabel htmlFor={`unit_${index}`} value={t("Unit")} />
                                        <TextInput
                                            id={`unit_${index}`}
                                            type="text"
                                            name={`unit_${index}`}
                                            value={selection.unit}
                                            className="block w-full mt-1"
                                            readOnly
                                        />
                                    </div>


                                    <div className="grid items-center w-full grid-cols-1 col-span-3">
                                        <div className="flex items-center justify-center gap-2">
                                        <InputLabel htmlFor={`quantity_${index}`} value={t("Quantity")} />
                                        <TextInput
                                            id={`quantity_${index}`}
                                            type="number"
                                            name={`quantity_${index}`}
                                            value={selection.quantity}
                                            className="block w-full mt-1"
                                            onChange={(e) =>
                                                handleProductChange(
                                                    index,
                                                    "quantity",
                                                    e.target.value
                                                )
                                            }
                                            />
                                            </div>
                                        <InputError message={errors[`product_quantities.${index}.quantity`]} className="mt-2" />
                                    </div>

                                    <div
                                        className={`flex items-center pt-1 justify-left ${
                                            errors[`product_quantities.${index}.quantity`] ? 'mb-6' : ''
                                        }`}
                                    >

                                            <Button
                                            type="button"
                                            variant="outline"
                                            className="ml-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-800"
                                            onClick={() => deleteProductSelection(index)}

                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>

                                </div>
                            ))}

                            <button
                                type="button"
                                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                onClick={addProductSelection}
                            >
                                {t("Add Another Product")}
                            </button>

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
