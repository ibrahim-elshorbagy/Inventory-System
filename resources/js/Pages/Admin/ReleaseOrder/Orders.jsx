import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";
import { useState, useEffect } from "react";
import TableHeading from "@/Components/TableHeading";

    const resources = {
    en: {
        translation: {},
    },
    ar: {
        translation: {
                "Orders": "المنتجات",
                "Add new": "إضافة جديد",
                "ID": "الرقم التعريفي",
                "Name": "الاسم",
                "Create Date": "تاريخ الإنشاء",
                'Update Date': 'تاريخ التحديث',
                "Actions": "الإجراءات",
                "Edit": "تعديل",
                "Delete": "حذف",
                "No orders available": "لا يوجد طلبات متاحة",
                "Phone": "التليفون",
                "Address": "العنوان",
                "Warehouse": "المخزن",
                "Order Name": "اسم الطلب",
                "Quantity": "الكمية",
                "Orders Report": "تقرير الطلبات",
            "Order Orders Release": "طلب ارجاع منتجات",
            "description": "البيان",
            "Status": "الحالة",
            "Pending": "قيد الانتظار",
            "Approved": "موافقة",
            "Rejected": "مرفوضة",
            "Are you sure you want Cancel the Order?": "هل تريد الغاء الطلب؟",
            "Details": "تفاصيل",
            "Delivery Address": "عنوان التسليم",
            "Customer Name": "اسم العميل",
            "Admin Confirmation": "تأكيد الادارة",

        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);


export default function Index({ auth, orders, queryParams = null, success ,danger}) {
  const { t } = useTranslation();


  queryParams = queryParams || {};

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
    router.get(route("admin.index.orders"), queryParams);
  };

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
      delete queryParams.page;
    router.get(route("admin.index.orders"), queryParams);
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

const deleteorder = (order) => {
    const confirmationMessage = t("Are you sure you want Cancel the Order?");
    if (!window.confirm(confirmationMessage)) {
      return;
    }

    router.delete(route("admin.delete-order", order.id), {
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
            {t("Orders Report")}
              </h2>
              <div className="flex gap-3">
          {/* <Link
            href={route("customer.make-release-order")}
            className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
          >
            {t("Order Orders Release")}
              </Link> */}

            </div>
        </div>
      }
    >
      <Head title={t("Orders Report")} />

      <div className="py-12">
        <div className="mx-auto sm:px-6 lg:px-8">
          {visibleSuccess && (
            <div className="px-4 py-2 mb-4 text-white rounded bg-burntOrange">
              {visibleSuccess}
            </div>
                  )}
        {danger && (
        <div className="px-4 py-2 mb-4 text-white bg-red-600 rounded">
            {danger}
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
                      <th className="px-3 py-3">{(t("Customer Name"))}</th>

                      <th className="px-3 py-3">{(t("description"))}</th>
                      <th className="px-3 py-3">{(t("Delivery Address"))}</th>

                      <TableHeading
                        name="created_at"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        {t("Create Date")}
                        </TableHeading>
                        <TableHeading
                        name="updated_at"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                                              {t("Update Date")}
                                          </TableHeading>
                        <th className="text-center">{t("Status")}</th>
                        <th className="text-center">{t("Admin Confirmation")}</th>

                        <th className="px-3 py-3">{t("Actions")}</th>

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
                        {orders && orders.data.length > 0 ? (
                            orders.data.map((order) => (
                                <tr
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                    key={order.id}
                                >
                                    <td className="px-3 py-2">{order.id}</td>
                                    <td className="px-3 py-2">{order.customer_name}</td>
                                    <td className="px-3 py-2 text-nowrap">{order.description}</td>
                                    <td className="px-3 py-2 text-nowrap">{order.delivery_address}</td>
                                    <td className="px-3 py-2 text-nowrap">{order.created_at}</td>
                                    <td className="px-3 py-2 text-nowrap">{order.updated_at}</td>
                                    <th className="px-3 py-2 text-center text-nowrap">
                                        <span
                                            className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                                                order.status === 'pending' ? 'bg-yellow-500 text-black' :
                                                order.status === 'rejected' ? 'bg-red-500 text-white' :
                                                order.status === 'approved' ? 'bg-green-500 text-white' :
                                                order.status === 'delivered' ? 'bg-blue-500 text-white' :
                                                'bg-gray-500 text-white'
                                            }`}
                                        >
                                            {order.status === 'pending' ? t('Pending') :
                                            order.status === 'rejected' ? t('Rejected') :
                                            order.status === 'approved' ? t('Approved') :
                                            order.status === 'delivered' ? t('Delivered') :
                                            t('Unknown')}
                                        </span>
                                    </th>
                                    <th className="px-3 py-2 text-center text-nowrap">
                                        <span
                                            className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                                                order.confirmed === 'pending' ? 'bg-yellow-500 text-black' :
                                                order.confirmed === 'rejected' ? 'bg-red-500 text-white' :
                                                order.confirmed === 'approved' ? 'bg-green-500 text-white' :
                                                'bg-gray-500 text-white'
                                            }`}
                                        >
                                            {
                                            order.confirmed === 'pending' ? t('Pending') :
                                            order.confirmed === 'rejected' ? t('Rejected') :
                                            order.confirmed === 'approved' ? t('Approved') :
                                            t('Unknown')}
                                        </span>
                                    </th>
                                    <td>
                                <div className="flex gap-3">
                                    {auth.user.permissions.includes("admin-orders-index") && (

                                            <div className="flex gap-3">

                                            <Link
                                            href={route("admin.show.order", order.id)}
                                            className="font-medium text-emerald-600 dark:text-emerald-500 hover:underline"
                                            >{t("Details")}</Link>


                                            </div>)
                                            }

                                    {auth.user.permissions.includes("admin-orders-index") && !order.created_by_user && !(order.confirmed === 'approved') && (
                                        <div className="flex gap-3">
                                            <Link
                                                href={route("admin.edit-order", { orderId: order.id, customerId: order.customer_id })}
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            >
                                                {t("Edit")}
                                            </Link>
                                        </div>
                                    )}

                                    {auth.user.permissions.includes("admin-orders-delete") && !order.created_by_user && !(order.confirmed === 'approved') && (
                                        <button
                                            onClick={(e) => deleteorder(order)}
                                            className="mx-1 font-medium text-red-600 dark:text-red-500 hover:underline"
                                        >
                                            {t("Delete")}
                                        </button>
                                    )}


                                    </div>

                                    </td>
                                </tr>
                            ))
                        ) : (
                           <tr>
                                <td colSpan="5" className="px-3 py-2 text-center">
                                    {t("No orders available")}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
              </div>
              {orders && <Pagination links={orders.meta.links} />}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
