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
                "Products": "المنتجات",
                "Add new": "إضافة جديد",
                "ID": "الرقم التعريفي",
                "Name": "الاسم",
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
                "Warehouse": "المخزن",
                "Product Name": "اسم المنتج",
                "Quantity": "الكمية",
            "Warehouse Report For A Customer": "تقرير المخزن للعميل",
            "Print Report": "طباعة التقرير",
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);


export default function Index({ auth,user, products, queryParams = null, success }) {
  const { t } = useTranslation();


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
    router.get(route("customer.stock.show",user.id), queryParams);
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

    const deleteproduct = (product) => {
    const confirmationMessage = t("Are you sure you want to delete the Product From Customer Stock?");
    if (!window.confirm(confirmationMessage)) {
      return;
    }

    router.delete(route("stock.destroy", product.id), {
      onSuccess: (page) => {
        setVisibleSuccess(page.props.success);
      }
    });
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
                  {auth.user.permissions.includes("create-stock") && (
                    <Link
                        href={route("stock.create", user.id)}
                        className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
                    >
                        {t("Add new")}
                    </Link>
                  )}
                  {auth.user.permissions.includes("update-stock") && (
                      <Link
                          href={route("stock.edit", user.id)}
                          className="px-3 py-1 text-white transition-all bg-indigo-500 rounded shadow hover:bg-indigo-600"
                      >
                          {t("Edit")}
                      </Link>
                  )}
            </div>
        </div>
      }
    >
      <Head title={t("Warehouse Report For A Customer")} />

      <div className="py-12">
        <div className="mx-auto sm:px-6 lg:px-8">
          {visibleSuccess && (
            <div className="px-4 py-2 mb-4 text-white rounded bg-burntOrange">
              {visibleSuccess}
            </div>
                  )}
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap ">
                      <td className="px-3 py-3">
                        {t("ID")}
                      </td>
                      <th className="px-3 py-3">{(t("Warehouse"))}</th>
                      <th className="px-3 py-3">{(t("Product Name"))}</th>
                      <th className="px-3 py-3">{(t("Quantity"))}</th>
                      <th className="px-3 py-3">{(t("Create Date"))}</th>
                      <th className="px-3 py-3">{(t("Update Date"))}</th>

                      <th className="px-3 py-3">{t("Actions")}</th>
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
                    </tr>
                  </thead>
                    <tbody>
                        {products && products.data.length > 0 ? (
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
                                    <td className="px-3 py-2 text-nowrap">
                                        {auth.user.permissions.includes("delete-stock") && (
                                            <button
                                                onClick={(e) => deleteproduct(product)}
                                                className="mx-1 font-medium text-red-600 dark:text-red-500 hover:underline"
                                            >
                                                {t("Delete")}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                           <tr>
                                <td colSpan="5" className="px-3 py-2 text-center">
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
