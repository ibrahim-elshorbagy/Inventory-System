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
      "Update Date": "تاريخ التحديث",
      "Actions": "الإجراءات",
      "Product Name": "اسم المنتج",
      "Purchase Price": "سعر الشراء",
      "Min Price": "السعر الأدنى",
      "Retail Price": "سعر التجزئة",
      "Block Price": "سعر الكتلة",
      "Edit": "تعديل",
      "Delete": "حذف",
      "Are you sure you want to delete the Product?": "هل أنت متأكد أنك تريد حذف المنتج؟",
      "No products available": "لا يوجد منتجات متاحة",
      "Save Changes": "حفظ التغييرات",
      "Cancel": "إلغاء",
      "Active": "نشط",
      "Inactive": "غير نشط",
    },
  },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function Index({ auth, products = { data: [] }, queryParams = null, success }) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState(
    products.data.map(product => ({
      id: product.id,
      product_name: product.name,
      purchase_price: product.purchase_price,
      minimum_price: product.minimum_price,
      retail_price: product.retail_price,
      block_price: product.block_price,
      is_active: product.is_active,
    }))
  );



    // search field
    queryParams = queryParams || {};
    const searchFieldChanged = (name, value) => {
        if (value) {
        queryParams[name] = value;
        } else {
        delete queryParams[name];
        }
        router.get(route("product.index"), queryParams);
    };

    const onKeyPress = (name, e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
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


        router.get(route("product.index"), queryParams);
    };

    // bulk update

        const updateFieldValue = (index, field, value) => {
        const updatedFormData = [...formData];
        if (field === 'is_active') {
            // Convert the value to a boolean, treating "true" as true and everything else as false
            updatedFormData[index][field] = value === 'true';
        } else {
            updatedFormData[index][field] = value;
        }
        setFormData(updatedFormData);
        };

    const handleSaveChanges = (e) => {
    e.preventDefault();
    router.post(route("product.bulkUpdate"), { products: formData }, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (page) => {
        setVisibleSuccess(page.props.success);

        setTimeout(() => {
            setVisibleSuccess(null);
        }, 3000);
        },
    });
    };

    // delete + success message
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
        const confirmationMessage = t("Are you sure you want to delete the Product?");
        if (!window.confirm(confirmationMessage)) {
            return;
        }

        router.delete(route("product.destroy", product.id), {
            onSuccess: (page) => {
                setVisibleSuccess(page.props.success);
            setFormData(prevData => prevData.filter(item => item.id !== product.id));

            }

        });
    }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            {t("Products")}
              </h2>
              {auth.user.permissions.includes("create-product") && (
          <Link
            href={route("product.create")}
            className="px-4 py-2 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
          >
            {t("Add new")}
                  </Link>
                  )}
        </div>
      }
    >
      <Head title={t("Products")} />

      <div className="py-12">
              <div className="mx-auto sm:px-6 lg:px-8">
                            {visibleSuccess && (
            <div className="px-4 py-2 mb-4 text-white rounded bg-burntOrange">
              {visibleSuccess}
            </div>
                  )}
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <form onSubmit={handleSaveChanges} className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <TableHeading
                        name="name"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        {t("Name")}
                      </TableHeading>
                      <td className="text-center">{t("Active")}</td>
                      <td
                      >
                        {t("Purchase Price")}
                      </td>
                      <td>
                        {t("Min Price")}
                      </td>
                      <td
                      >
                        {t("Retail Price")}
                      </td>
                      <td
                      >
                        {t("Block Price")}
                      </td>
                      <th className="px-3 py-3">{t("Actions")}</th>
                    </tr>
                    </thead>
                    <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.name}
                          placeholder={t("Product Name")}
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
                    </tr>
                  </thead>

                  <tbody>
                    {formData.length > 0 ? (
                      formData.map((product, index) => (
                        <tr key={product.id} className="bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-700">
                          <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">{product.product_name}</td>
                          <td className="px-4 py-2 text-center border-b border-gray-300 dark:border-gray-700">
                            <select
                              value={product.is_active}
                              onChange={(e) => updateFieldValue(index, 'is_active', e.target.value)}

                            >
                              <option value="true">{t("Active")}</option>
                              <option value="false">{t("Inactive")}</option>
                            </select>
                          </td>
                          <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">
                            <TextInput
                              className="w-full"
                              value={product.purchase_price}
                              onChange={(e) => updateFieldValue(index, 'purchase_price', e.target.value)}
                              placeholder={t("Purchase Price")}
                            />
                          </td>
                          <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">
                            <TextInput
                              className="w-full"
                              value={product.minimum_price}
                              onChange={(e) => updateFieldValue(index, 'minimum_price', e.target.value)}
                              placeholder={t("Min Price")}
                            />
                          </td>
                          <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">
                            <TextInput
                              className="w-full"
                              value={product.retail_price}
                              onChange={(e) => updateFieldValue(index, 'retail_price', e.target.value)}
                              placeholder={t("Retail Price")}
                            />
                          </td>
                          <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">
                            <TextInput
                              className="w-full"
                              value={product.block_price}
                              onChange={(e) => updateFieldValue(index, 'block_price', e.target.value)}
                              placeholder={t("Block Price")}
                            />
                          </td>
                            <td className="flex gap-2 py-3 text-center">
                            {/* Check if the user has permission to update the product */}
                            {auth.user.permissions.includes("update-product") && (
                                <Link
                                href={route("product.edit", product.id)}
                                className="px-3 py-1 text-xs text-white transition-all bg-blue-600 rounded shadow hover:bg-blue-700"
                                >
                                {t("Edit")}
                                </Link>
                            )}

                            {/* Check if the user has permission to delete the product */}
                            {auth.user.permissions.includes("delete-product") && (
                                <button
                                type="button"
                                onClick={() => deleteproduct(product)}
                                className="px-3 py-1 text-xs text-white transition-all bg-red-600 rounded shadow hover:bg-red-700"
                                >
                                {t("Delete")}
                                </button>
                            )}
                            </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-4 py-2 text-center text-gray-500 dark:text-gray-400">
                          {t("No products available")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
                >
                  {t("Save Changes")}
                </button>
              </div>
            </form>

            {products && <Pagination links={products.meta.links} />}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

