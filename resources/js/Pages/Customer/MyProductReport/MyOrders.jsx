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
                "Requests": "المنتجات",
                "Add new": "إضافة جديد",
                "ID": "الرقم التعريفي",
                "Name": "الاسم",
                "Create Date": "تاريخ الإنشاء",
                'Update Date': 'تاريخ التحديث',
                "Actions": "الإجراءات",
                "Requests Name": "اسم المنتج",
                "Edit": "تعديل",
                "Delete": "حذف",
                "No requests available": "لا يوجد طلبات متاحة",
                "Phone": "التليفون",
                "Address": "العنوان",
                "Warehouse": "المخزن",
                "Request Name": "اسم المنتج",
                "Quantity": "الكمية",
                "My Requests Report": "تقرير طلباتي",
                "Order Requests Release": "طلب ارجاع منتجات",
                "description": "البيان",
                "Status": "الحالة",
                "Pending": "قيد الانتظار",
                "Approved": "موافقة",
                "Delivered": "تم التسليم",
                "Rejected": "مرفوضة",
                "Are you sure you want to Cancel The Request?": "هل تريد الغاء الطلب؟",
            "Delivery Address": "عنوان التسليم",
            "Details": "تفاصيل",
            "Admin Confirmation": "تأكيد الادارة",

        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);


export default function Index({ auth, requests, queryParams = null, success,danger }) {
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
    router.get(route("customer.show.my-requests"), queryParams);
  };


    const [visibleSuccess, setVisibleSuccess] = useState(success);
    const [visibleDanger, setVisibleDanger] = useState(danger);

 useEffect(() => {
    if (success) {
      setVisibleSuccess(success);

      const timer = setTimeout(() => {
        setVisibleSuccess(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
 }, [success]);

    useEffect(() => {
  if (danger) {
    const timer = setTimeout(() => {
      setVisibleDanger(null);
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [danger]);



    const deleterequest = (request) => {
    const confirmationMessage = t("Are you sure you want to Cancel The Request?");
    if (!window.confirm(confirmationMessage)) {
      return;
    }

    router.delete(route("customer.destroy-release-order", request), {
      onSuccess: (page) => {
         if (page.props.success) {
        setVisibleSuccess(page.props.success);
        setVisibleDanger(null);
      } else if (page.props.danger) {
        setVisibleDanger(page.props.danger);
        setVisibleSuccess(null);
      }
      }
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-white">
            {t("My Requests Report")}
              </h2>
              <div className="flex gap-3">
          <Link
            href={route("customer.make-release-order")}
            className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
          >
            {t("Order Requests Release")}
              </Link>

            </div>
        </div>
      }
    >
          <Head title={t("My Requests Report")} />

      <div className="py-12">
        <div className="mx-auto sm:px-6 lg:px-8">
          {visibleSuccess && (
            <div className="px-4 py-2 mb-4 text-white rounded bg-burntOrange">
              {visibleSuccess}
            </div>
                  )}
        {visibleDanger && (
        <div className="px-4 py-2 mb-4 text-white bg-red-600 rounded">
            {visibleDanger}
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
                                          <th className="px-3 py-3">{(t("description"))}</th>
                        <th className="px-3 py-3">{t("Delivery Address")}</th>

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

                    <tbody>
                        {requests && requests.data.length > 0 ? (
                            requests.data.map((request) => (
                                <tr
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                    key={request.id}
                                >
                                    <td className="px-3 py-2">{request.id}</td>
                                    <td className="px-3 py-2 text-nowrap">{request.description}</td>
                                    <td className="px-3 py-2 text-nowrap">{request.delivery_address}</td>

                                    <td className="px-3 py-2 text-nowrap">{request.created_at}</td>
                                    <td className="px-3 py-2 text-nowrap">{request.updated_at}</td>
                                    <th className="px-3 py-2 text-center text-nowrap">
                                        <span
                                            className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                                                request.status === 'pending' ? 'bg-yellow-500 text-black' :
                                                request.status === 'rejected' ? 'bg-red-500 text-white' :
                                                request.status === 'approved' ? 'bg-green-500 text-white' :
                                                request.status === 'delivered' ? 'bg-blue-500 text-white' :
                                                'bg-gray-500 text-white'
                                            }`}
                                        >
                                            {request.status === 'pending' ? t('Pending') :
                                            request.status === 'rejected' ? t('Rejected') :
                                            request.status === 'approved' ? t('Approved') :
                                            request.status === 'delivered' ? t('Delivered') :
                                            t('Unknown')}
                                        </span>

                                    </th>
                                    <th className="px-3 py-2 text-center text-nowrap">
                                        <span
                                            className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                                                request.confirmed === 'pending' ? 'bg-yellow-500 text-black' :
                                                request.confirmed === 'rejected' ? 'bg-red-500 text-white' :
                                                request.confirmed === 'approved' ? 'bg-green-500 text-white' :
                                                'bg-gray-500 text-white'
                                            }`}
                                        >
                                            {request.confirmed === 'pending' ? t('Pending') :
                                            request.confirmed === 'rejected' ? t('Rejected') :
                                            request.confirmed === 'approved' ? t('Approved') :
                                            t('Unknown')}
                                        </span>

                                    </th>
                                    <td className="flex items-center gap-3 m-3">
                                        {auth.user.permissions.includes("for-customer-make-release-repuest") && !(request.confirmed === 'approved') && (

                                        < >
                                                <Link
                                                    href={route("customer.edit-release-order", request.id)}
                                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                                >
                                                {t("Edit")}
                                                </Link>

                                                <button
                                                        onClick={(e) => deleterequest(request.id)}
                                                        className="mx-1 font-medium text-red-600 dark:text-red-500 hover:underline"
                                                        >
                                                        {t("Delete")}
                                                </button>

                                        </>

                                        )}
                                                <Link
                                                href={route("customer.show-release-order", request.id)}
                                                className="font-medium text-emerald-600 dark:text-emerald-500 hover:underline"
                                            >
                                            {t("Details")}
                                                </Link>

                                    </td>
                                </tr>
                            ))
                        ) : (
                           <tr>
                                <td colSpan="5" className="px-3 py-2 text-center">
                                    {t("No requests available")}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
              </div>
              {requests && <Pagination links={requests.meta.links} />}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
