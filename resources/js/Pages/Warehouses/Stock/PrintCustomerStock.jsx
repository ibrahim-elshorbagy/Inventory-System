import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";

const resources = {
  en: {
    translation: {},
  },
  ar: {
    translation: {
      "Products": "المنتجات",
      "ID": "الرقم التعريفي",
      "Name": "الاسم",
      "Create Date": "تاريخ الإنشاء",
      "Update Date": "تاريخ التحديث",
      "Product Name": "اسم المنتج",
      "Phone": "التليفون",
      "Address": "العنوان",
      "Warehouse": "المخزن",
      "Quantity": "الكمية",
      "Category": "الصنف",
      "Subcategory": "الصنف الفرعي",
      "Product Image": "صورة المنتج",
      "Warehouse Report For A Customer": "تقرير المخزن للعميل",
      "Customer Information": "معلومات العميل",
          "Print": "طباعة التقرير",
          "Description": "الوصف",
      'Notes': 'ملاحظات',
    },
  },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

function PrintCustomerStock({ auth,site_settings, user, products }) {
  const { t } = useTranslation();

  return (
    <>
      <Head title={site_settings.websiteName + " - " +t("Warehouse Report For A Customer")} />

    <div className="flex flex-col items-start justify-between gap-2 p-5 mb-5 text-sm font-semibold leading-tight border-b md:items-center md:flex-row md:text-lg dark:text-gray-200">
        <h2 >
            {t("Warehouse Report For A Customer")} <br/> {user.name} - ({user.phone})
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="p-2 text-white transition-all bg-green-500 rounded shadow leading-tig hover:bg-green-600"
          >
            {t("Print")}
          </button>
        </div>
    </div>
      {/* Apply the 'print' class to the container */}
      <div className=" print">
        <div className="mx-auto ">
          <div className="">
                      <div className="p-2 text-gray-900 dark:text-gray-100">

              <div className="p-3 mb-6 bg-gray-100 rounded-md dark:bg-gray-700">
                {/* Customer Information */}
                <h3 className="text-lg font-semibold">{t("Customer Information")}</h3>
                <p>{t("Name")}: {user.name}</p>
                <p>{t("Phone")}: {user.phone}</p>
                <p>{t("Address")}: {user.address}</p>
              </div>

              <div className="mx-auto overflow-auto bg-gray-100 rounded-md dark:bg-gray-700">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <td className="p-2">{t("ID")}</td>
                      <th className="p-2">{t("Warehouse")}</th>
                      <th className="p-2">{t("Product Name")}</th>
                      <th className="p-2">{t("Quantity")}</th>
                      <th className="p-2">{t("Category")}</th>
                      <th className="p-2">{t("Subcategory")}</th>
                      <th className="p-2">{t("Description")}</th>
                      <th className="p-2">{t("Notes")}</th>
                      <th className="p-2">{t("Create Date")}</th>
                      <th className="p-2">{t("Update Date")}</th>
                      <th className="p-2 text-center">{t("Product Image")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products && products.data && products.data.length > 0 ? (
                      products.data.map((product,index) => (
                        <tr
                            className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                            } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}

                          key={product.id}
                        >
                          <td className="p-2 ">{product.id}</td>
                          <td className="p-2 text-nowrap">{product.warehouse_name}</td>
                          <td className="p-2 text-nowrap">{product.product_name}</td>
                          <td className="p-2 text-nowrap">{product.quantity}</td>
                          <td className="p-2 text-nowrap">{product.category_name}</td>
                          <td className="p-2 text-nowrap">{product.subcategory_name}</td>
                          <td className="p-2 text-nowrap">{product.product_description}</td>
                          <td className="p-2 text-nowrap">{product.product_notes}</td>
                          <td className="p-2 text-nowrap">{product.created_at}</td>
                          <td className="p-2 text-nowrap">{product.updated_at}</td>
                          <td className="flex justify-center p-2">
                            <img
                              src={product.product_image}
                              alt={product.product_name}
                              className="object-cover w-24 rounded-md"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="p-2 px-1 text-center">
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
    </>
  );
}


PrintCustomerStock.layout = (page) => (
    <AuthenticatedLayout
        user={page.props.auth.user}
        site_settings={page.props.site_settings}


    >
        {page}
    </AuthenticatedLayout>
);

export default PrintCustomerStock;
