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
      "Name": "الاسم",
      "Create Date": "تاريخ الإنشاء",
      "Update Date": "تاريخ التحديث",
      "Actions": "الإجراءات",
      "Products Name": "اسم المنتج",
      "Edit": "تعديل",
      "Delete": "حذف",
      "No products available": "لا يوجد منتجات متاحة",
      "Phone": "التليفون",
      "Address": "العنوان",
      "Warehouse": "المخزن",
      "Product Name": "اسم المنتج",
      "Quantity": "الكمية",
      "Category": "الصنف",
      "Subcategory": "الصنف الفرعي",
      "Product Image": "صورة المنتج",
      "My Products Report": "تقرير المنتجات",
          "Order Products Release": "طلب ارجاع منتجات",
      "Description":"الوصف",
      "Notes":"ملاحظات",
    },
  },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function Index({ auth,site_settings, products, queryParams = null, success }) {
  const { t } = useTranslation();

  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    router.get(route("for-customer-my-products-report"), queryParams);
  };

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;

    searchFieldChanged(name, e.target.value);
  };

  const [visibleSuccess, setVisibleSuccess] = useState(success);

  useEffect(() => {
    if (success) {
      setVisibleSuccess(success);

      const timer = setTimeout(() => {
        setVisibleSuccess(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <AuthenticatedLayout
      user={auth.user}
                    site_settings={site_settings}

      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            {t("My Products Report")}
          </h2>
          <div className="flex gap-3">
            <Link
              href={route("customer.make-release-order")}
              className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
            >
              {t("Order Products Release")}
            </Link>
          </div>
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +t("My Products Report")} />

      <div className="">
        <div className="mx-auto ">
          {visibleSuccess && (
            <div className="px-4 py-2 mb-4 text-white rounded bg-burntOrange">
              {visibleSuccess}
            </div>
          )}
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-2 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <td className="px-3 py-3">{t("ID")}</td>
                      <th className="px-3 py-3">{t("Warehouse")}</th>
                      <th className="px-3 py-3">{t("Product Name")}</th>
                      <th className="px-3 py-3">{t("Quantity")}</th>
                      <th className="px-3 py-3">{t("Category")}</th>
                      <th className="px-3 py-3">{t("Subcategory")}</th>
                      <th className="px-3 py-3">{t("Description")}</th>
                      <th className="px-3 py-3">{t("Notes")}</th>
                      <th className="px-3 py-3">{t("Create Date")}</th>
                      <th className="px-3 py-3">{t("Update Date")}</th>
                      <th className="px-3 py-3 text-center">{t("Product Image")}</th>

                    </tr>
                  </thead>

                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.name}
                          placeholder={t("Products Name")}
                          onBlur={(e) => searchFieldChanged("name", e.target.value)}
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
                    </tr>
                  </thead>
                  <tbody>
                    {products && products.data.length > 0 ? (
                      products.data.map((product,index) => (
                        <tr
                        className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                            } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}

                          key={product.id}
                        >
                          <td className="px-3 py-2">{product.id}</td>
                          <td className="px-3 py-2 text-nowrap">{product.warehouse_name}</td>
                          <td className="px-3 py-2 text-nowrap">{product.product_name}</td>
                          <td className="px-3 py-2 text-nowrap">{product.quantity}</td>
                          <td className="px-3 py-2 text-nowrap">{product.category_name}</td>
                          <td className="px-3 py-2 text-nowrap">{product.subcategory_name}</td>
                          <td className="px-3 py-2 text-nowrap">{product.product_description}</td>
                          <td className="px-3 py-2 text-nowrap">{product.product_notes}</td>
                          <td className="px-3 py-2 text-nowrap">{product.created_at}</td>
                            <td className="px-3 py-2 text-nowrap">{product.updated_at}</td>
                              <td className="flex justify-center px-3 py-2" colSpan="3">
                            {product.product_image ? (
                              <img className="object-cover w-32 rounded-md" src={product.product_image} alt={product.product_name}  />
                            ) : (
                              <span>{t("No Image")}</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="px-3 py-2 text-center">
                          {t("No products available")}
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
