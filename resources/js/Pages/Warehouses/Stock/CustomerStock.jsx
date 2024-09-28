import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";
import { useState, useEffect } from "react";

const resources = {
  en: {
    translation: {},
  },
  ar: {
    translation: {
        "Products": "المنتجات",
        "Add new": "إضافة جديد",
        "ID": "الرقم التعريفي",
        "Product Name": "اسم المنتج",
        "Quantity": "الكمية",
        "Warehouse": "المخزن",
        "Create Date": "تاريخ الإنشاء",
        'Update Date': 'تاريخ التحديث',
        "Actions": "الإجراءات",
        "Products Name": "اسم المنتج",
        "Edit": "تعديل",
        "Delete": "حذف",
        "Are you sure you want to delete the Product From Customer Stock?": "هل أنت متأكد أنك تريد حذف المنتج من المخزن؟",
        "No products available": "لا يوجد منتجات متاحة",
        "Phone": "التليفون",
        "Address": "العنوان",
        "Category": "الصنف",
        "Subcategory": "الصنف الفرعي",
        "Image": "الصورة",
        "Warehouse Report For A Customer": "تقرير المخزن للعميل",
        "Print Report": "طباعة التقرير",
          "New Add Order": "طلب أضافة جديد",
          "Description": "الوصف",
        'Notes': 'ملاحظات',
    },
  },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function Index({ auth, user, products, queryParams = null }) {
  const { t } = useTranslation();
    queryParams = queryParams || {};



  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    router.get(route("customer.stock.show", user.id), queryParams);
  };

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;

    searchFieldChanged(name, e.target.value);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            {t("Warehouse Report For A Customer")} - {user.name} - ({user.phone})
          </h2>
          <div className="flex gap-3">
            <Link
              href={route("customer.stock.print", user.id)}
              className="px-3 py-1 text-white transition-all bg-green-500 rounded shadow hover:bg-green-600"
            >
              {t("Print Report")}
            </Link>
            {auth.user.permissions.includes("add-stock-order") && (
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
      <Head title={t("Warehouse Report For A Customer")} />

      <div className="py-12">
        <div className="mx-auto sm:px-6 lg:px-8">


          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                      <div className="p-6 text-gray-900 dark:text-gray-100">

              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3">{t("ID")}</th>
                      <th className="px-3 py-3">{t("Product Name")}</th>
                      <th className="px-3 py-3">{t("Quantity")}</th>
                      <th className="px-3 py-3">{t("Category")}</th>
                      <th className="px-3 py-3">{t("Subcategory")}</th>
                      <th className="px-3 py-3">{t("Description")}</th>
                      <th className="px-3 py-3">{t("Notes")}</th>
                      <th className="px-3 py-3">{t("Warehouse")}</th>
                      <th className="px-3 py-3">{t("Create Date")}</th>
                      <th className="px-3 py-3">{t("Update Date")}</th>
                      <th className="px-3 py-3 text-center" colSpan="3">{t("Image")}</th>
                    </tr>
                </thead>

                                                    <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.name}
                          placeholder={t("Products Name")}
                          onBlur={(e) =>
                            searchFieldChanged("name", e.target.value)
                          }
                          onKeyPress={(e) => onKeyPress("name", e)}
                        />
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.data.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="px-6 py-4 text-center">
                          {t("No products available")}
                        </td>
                      </tr>
                    ) : (
                      products.data.map((product) => (
                        <tr key={product.id} className="text-base bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <td className="px-3 py-2">{product.id}</td>
                          <td className="px-3 py-2">{product.product_name}</td>
                          <td className="px-3 py-2">{product.quantity}</td>
                          <td className="px-3 py-2">{product.category_name}</td>
                          <td className="px-3 py-2">{product.subcategory_name}</td>
                          <td className="px-3 py-2">{product.product_notes}</td>
                          <td className="px-3 py-2">{product.product_description}</td>
                          <td className="px-3 py-2">{product.warehouse_name}</td>
                          <td className="px-3 py-2">{product.created_at}</td>
                          <td className="px-3 py-2">{product.updated_at}</td>
                              <td className="flex justify-center px-3 py-2" colSpan="3">
                            {product.product_image ? (
                              <img className="object-cover w-32 rounded-md" src={product.product_image} alt={product.product_name}  />
                            ) : (
                              <span>{t("No Image")}</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {products.meta && <Pagination links={products.meta.links} />}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
