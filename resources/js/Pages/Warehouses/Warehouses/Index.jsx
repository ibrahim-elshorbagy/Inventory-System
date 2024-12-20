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
                "Warehouses": "المخازن",
                "Add new": "إضافة جديد",
                "ID": "الرقم التعريفي",
                "Name": "الاسم",
                "Create Date": "تاريخ الإنشاء",
                'Update Date': 'تاريخ التحديث',
                "Actions": "الإجراءات",
                "Warehouses Name": "اسم المخزن",
                "Edit": "تعديل",
                "Delete": "حذف",
                "Are you sure you want to delete the Warehouses?": "هل أنت متأكد أنك تريد حذف المخزن",
                "No warehouses available": "لا يوجد مخازن متاحة",
                'Active': 'نشط',
                "Inactive": 'غير نشط',
                "Phone": "التليفون",
                "Address": "العنوان",
                "Report": "تقرير",
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);


function Index({ auth,site_settings, warehouses, queryParams = null }) {


  const { t } = useTranslation();

  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
      delete queryParams.page;
    router.get(route("warehouse.index"), queryParams);
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
    router.get(route("warehouse.index"), queryParams);
  };






    const deletewarehouse = (warehouse) => {
    const confirmationMessage = t("Are you sure you want to delete the Warehouses?");
    if (!window.confirm(confirmationMessage)) {
      return;
    }

    router.delete(route("warehouse.destroy", warehouse.id), {

    });
  };

  return (
    <>
      <Head title={site_settings.websiteName + " - " +t("Warehouses")} />

        <div className="">
            <div className="flex items-start justify-between p-5 mb-5 text-sm font-semibold leading-tight border-b md:text-lg dark:text-gray-200">
                    <h2>
                        {t("Warehouses")}
                    </h2>
                    <div>
                        {auth.user.permissions.includes("create-warehouse") && (

                            <Link
                                href={route("warehouse.create")}
                                className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
                            >
                                {t("Add new")}
                            </Link>
                        )}
                    </div>
                </div>
        <div className="mx-auto ">

          <div className="">
            <div className="p-2 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <TableHeading
                        name="id"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        {t("ID")}
                      </TableHeading>
                      <TableHeading
                        name="name"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        {t("Name")}
                      </TableHeading>
                    <td className="text-center text-nowrap">{t('Phone')}</td>
                    <td className="text-center text-nowrap">{t('Address')}</td>
                    <td className="text-center text-nowrap">{t('Active')}</td>
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

                      <th className="p-3">{t("Actions")}</th>
                    </tr>
                                  </thead>

                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="p-3"></th>
                      <th className="p-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.name}
                          placeholder={t("Warehouses Name")}
                          onBlur={(e) =>
                            searchFieldChanged("name", e.target.value)
                          }
                          onKeyPress={(e) => onKeyPress("name", e)}
                        />
                      </th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                    <tbody>
                        {warehouses && warehouses.data.length > 0 ? ( warehouses.data.map((warehouse,index) => (
                        <tr
                            className={`${
                                index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}

                            key={warehouse.id}
                        >
                            <td className="p-3">{warehouse.id}</td>
                            <th className="p-3 text-nowrap">{warehouse.name}</th>
                            <td className="p-3 text-nowrap">
                            {warehouse.phone}
                                </td>
                                <td className="p-3 text-nowrap">
                            {warehouse.address}
                            </td>
                           <th className="p-3 text-center text-nowrap">
                            <span
                                className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                                warehouse.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}
                            >
                                {warehouse.is_active ? t('Active') : t('Inactive')}
                            </span>
                            </th>

                            <td className="p-3 text-nowrap">
                            {warehouse.created_at}
                            </td>
                                <td className="p-3 text-nowrap">
                            {warehouse.updated_at}
                            </td>
                            <td className="flex gap-2 p-3 text-nowrap">
                            {/* Check if the user has permission to update the warehouse */}
                            {auth.user.permissions.includes("update-warehouse") && (
                                <Link
                                href={route("warehouse.edit", warehouse.id)}
                                className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                >
                                {t("Edit")}
                                </Link>
                                    )}
                            {auth.user.permissions.includes("read-warehouse") && (
                                <Link
                                href={route("warehouse.show", warehouse.id)}
                                className="mx-1 font-medium text-emerald-600 dark:text-emerald-500 hover:underline"
                                >
                                {t("Report")}
                                </Link>
                            )}

                            {/* Check if the user has permission to delete the warehouse */}
                            {auth.user.permissions.includes("delete-warehouse") && (
                                <button
                                onClick={(e) => deletewarehouse(warehouse)}
                                className="mx-1 font-medium text-red-600 dark:text-red-500 hover:underline"
                                >
                                {t("Delete")}
                                </button>
                            )}
                            </td>

                        </tr>
                        ))) : (
                           <tr>
                                <td colSpan="5" className="p-3 text-center">
                                    {t("No warehouses available")}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
              </div>
              {warehouses && <Pagination links={warehouses.meta.links} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Index.layout = (page) => (
    <AuthenticatedLayout
        user={page.props.auth.user}
        site_settings={page.props.site_settings}


    >
        {page}
    </AuthenticatedLayout>
);

export default Index;
