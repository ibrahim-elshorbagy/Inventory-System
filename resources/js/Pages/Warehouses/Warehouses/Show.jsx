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
          'Description': "الوصف",
      "Notes": "ملاحظات",
    },
  },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function Show({ auth,site_settings, products, queryParams = null, success, warehouse }) {
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
                        site_settings={site_settings}

      header={
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold leading-tight md:text-lg dark:text-gray-200">
            {t("Warehouse")} - {warehouse.name}
          </h2>
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +t("Warehouse")} />

      <div className="">
        <div className="mx-auto ">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-2 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <TableHeading
                        name="id"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                        className="p-3"
                      >
                        {t("ID")}
                      </TableHeading>

                      <td className="p-3">{t("Customer Name")}</td>
                      <td className="p-3">{t("Products Name")}</td>
                      <td className="p-3">{t("Quantity")}</td>
                      <td className="p-3">{t("Category")}</td>
                      <td className="p-3">{t("Subcategory")}</td>
                      <td className="p-3">{t("Description")}</td>
                      <td className="p-3">{t("Notes")}</td>
                      <TableHeading
                        name="created_at"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                        className="p-3"
                      >
                        {t("Added Date")}
                      </TableHeading>
                      <TableHeading
                        name="updated_at"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                        className="p-3"
                      >
                        {t("Update Date")}
                                          </TableHeading>
                      <td className="text-center p3">{t("Product Image")}</td>

                    </tr>
                  </thead>

                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="p-3"></th>
                      <th className="p-3">
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
                      <th className="p-3">
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
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products && products.data.length > 0 ? (
                      products.data.map((product) => (
                        <tr
                          className="text-base bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          key={product.id}
                        >
                          <td className="p-3">{product.product_id}</td>
                          <td className="p-3 text-nowrap">{product.user_name}</td>
                          <td className="p-3 text-nowrap">{product.product_name}</td>
                          <td className="p-3 text-nowrap">{product.quantity}</td>
                          <td className="p-3 text-nowrap">{product.category_name}</td>
                          <td className="p-3 text-nowrap">{product.subcategory_name}</td>
                          <td className="p-3 text-nowrap">{product.product_description}</td>
                          <td className="p-3 text-nowrap">{product.product_notes}</td>

                          <td className="p-3 text-nowrap">{product.created_at}</td>
                            <td className="p-3 text-nowrap">{product.updated_at}</td>
                            <td className="flex justify-center p-3" colSpan="3">
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
                        <td colSpan="9" className="p-3 text-center">
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
