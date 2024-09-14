import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";
import { useState, useEffect } from "react";

const resources = {
  en: {
    translation: {},
  },
  ar: {
    translation: {
      "Warehouse": "المخزن",
      "ID": "الرقم التعريفي",
      "Name": "الاسم",
      "Added Date": "تاريخ الاضافة",
      'Update Date': 'تاريخ التحديث',
      "Products Name": "اسم المنتج",
      "No products in the warehouse": "لا يوجد منتجات في المخزن",
      "Quantity": "الكمية",
      "Category": "الصنف",
      "Subcategory": "الصنف الفرعي",
      "Product Image": "صورة المنتج",
      "Customer Name": "اسم العميل",
    },
  },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function Show({ auth, products, queryParams = null, success, warehouse }) {
  const { t } = useTranslation();

  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    router.get(route("warehouse.show", warehouse.id), queryParams);
  };

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;
    searchFieldChanged(name, e.target.value);
  };

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === "asc") {
        queryParams.sort_direction = "desc";
      } else {
        queryParams.sort_direction = "asc";
      }
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = "asc";
    }
    router.get(route("warehouse.show", warehouse.id), queryParams);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            {t("Warehouse")} - {warehouse.name}
          </h2>
        </div>
      }
    >
      <Head title={t("Warehouse")} />

      <div className="py-12">
        <div className="mx-auto sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <TableHeading
                        name="id"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        {t("ID")}
                      </TableHeading>

                      <td>{t("Customer Name")}</td>
                      <td>{t("Products Name")}</td>
                      <td>{t("Quantity")}</td>
                      <td>{t("Category")}</td>
                      <td>{t("Subcategory")}</td>
                      <TableHeading
                        name="created_at"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        {t("Added Date")}
                      </TableHeading>
                      <TableHeading
                        name="updated_at"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        {t("Update Date")}
                                          </TableHeading>
                      <td className="px-3 py-2 text-center">{t("Product Image")}</td>

                    </tr>
                  </thead>

                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.customer_name}
                          placeholder={t("Customer Name")}
                          onBlur={(e) =>
                            searchFieldChanged("customer_name", e.target.value)
                          }
                          onKeyPress={(e) => onKeyPress("customer_name", e)}
                        />
                      </th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.product_name}
                          placeholder={t("Products Name")}
                          onBlur={(e) =>
                            searchFieldChanged("product_name", e.target.value)
                          }
                          onKeyPress={(e) => onKeyPress("product_name", e)}
                        />
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products && products.data.length > 0 ? (
                      products.data.map((product) => (
                        <tr
                          className="text-base bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          key={product.id}
                        >
                          <td className="px-3 py-2">{product.product_id}</td>
                          <td className="px-3 py-2 text-nowrap">{product.user_name}</td>
                          <td className="px-3 py-2 text-nowrap">{product.product_name}</td>
                          <td className="px-3 py-2 text-nowrap">{product.quantity}</td>
                          <td className="px-3 py-2 text-nowrap">{product.category_name}</td>
                          <td className="px-3 py-2 text-nowrap">{product.subcategory_name}</td>

                          <td className="px-3 py-2 text-nowrap">{product.created_at}</td>
                            <td className="px-3 py-2 text-nowrap">{product.updated_at}</td>
                            <td className="flex justify-center px-3 py-2" colSpan="3">
                            <img
                              src={product.product_image}
                              alt={product.product_name}
                              className="object-cover w-32 rounded-md"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="px-3 py-2 text-center">
                          {t("No products in the warehouse")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {products && <Pagination links={products.meta.links} />}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
