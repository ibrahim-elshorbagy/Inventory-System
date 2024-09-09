import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";

const resources = {
  en: {
    translation: { },
  },
  ar: {
    translation: {
      "Products": "المنتجات",
      "Add new": "إضافة جديد",
      "ID": "الرقم التعريفي",
      "Name": "الاسم",
      "Create Date": "تاريخ الإنشاء",
      "Update Date": "تاريخ التحديث",
      "Products Name": "اسم المنتج",
      "Phone": "التليفون",
      "Address": "العنوان",
      "Warehouse": "المخزن",
      "Product Name": "اسم المنتج",
      "Quantity": "الكمية",
      "Warehouse Report For A Customer": "تقرير المخزن للعميل",
          "Customer Information": "معلومات العميل",
      "Print": "طباعة التقرير",
    },
  },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function PrintCustomerStock({ auth, user, products }) {
  const { t } = useTranslation();

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            {t("Warehouse Report For A Customer")} - {user.name} - ({user.phone})
          </h2>
          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="px-3 py-1 text-white transition-all bg-green-500 rounded shadow hover:bg-green-600"
          >
            {t("Print")}
          </button>
        </div>
      }
    >
      <Head title={t("Warehouse Report For A Customer")} />

      <div className="py-12">
        <div className="mx-auto sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm print dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="mb-6">
                {/* Customer Information */}
                <h3 className="text-lg font-semibold">{t("Customer Information")}</h3>
                <p>{t("Name")}: {user.name}</p>
                <p>{t("Phone")}: {user.phone}</p>
                <p>{t("Address")}: {user.address}</p>
              </div>

              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap ">
                      <td className="px-3 py-3">{t("ID")}</td>
                      <th className="px-3 py-3">{t("Warehouse")}</th>
                      <th className="px-3 py-3">{t("Product Name")}</th>
                      <th className="px-3 py-3">{t("Quantity")}</th>
                      <th className="px-3 py-3">{t("Create Date")}</th>
                      <th className="px-3 py-3">{t("Update Date")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products && products.data && products.data.length > 0 ? (
                      products.data.map((product) => (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          key={product.id}
                        >
                          <td className="px-3 py-2">{product.id}</td>
                          <td className="px-3 py-2 text-nowrap">{product.warehouse_name}</td>
                          <td className="px-3 py-2 text-nowrap">{product.product_name}</td>
                          <td className="px-3 py-2 text-nowrap">{product.quantity}</td>
                          <td className="px-3 py-2 text-nowrap">{product.created_at}</td>
                          <td className="px-3 py-2 text-nowrap">{product.updated_at}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-3 py-2 text-center">
                          {t("No products available")}
                        </td>
                      </tr>
                    )}
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
