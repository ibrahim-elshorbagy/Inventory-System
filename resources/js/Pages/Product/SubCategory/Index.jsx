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
            "Sub Categories": "الاصناف الفرعية",
            "Main Category": "الصنف الرئيسي",
                "Add new": "إضافة جديد",
                "ID": "الرقم التعريفي",
                "Name": "الاسم",
                "Email": "البريد الإلكتروني",
                "Create Date": "تاريخ الإنشاء",
                'Update Date': 'تاريخ التحديث',
                "Actions": "الإجراءات",
                "Category Name": "اسم الصنف",
                "Edit": "تعديل",
                "Delete": "حذف",
                "Are you sure you want to delete the Category?": "هل أنت متأكد أنك تريد حذف الصنف",
                "No categories available": "لا يوجد اصناف متاحة",
                'Active': 'نشط',
                "Inactive":'غير نشط',
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);


export default function Index({ auth,site_settings, subCategories, queryParams = null }) {


  const { t } = useTranslation();

  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
      delete queryParams.page;
    router.get(route("subCategory.index"), queryParams);
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
    router.get(route("subCategory.index"), queryParams);
  };




    const deletecategory = (category) => {
    const confirmationMessage = t("Are you sure you want to delete the Category?");
    if (!window.confirm(confirmationMessage)) {
      return;
    }

    router.delete(route("subCategory.destroy", category.id), {
      onSuccess: (page) => {
            setVisibleSuccess(page.props.success);
            setVisibleDanger(page.props.danger);

      }
    });
  };

  return (
    <AuthenticatedLayout
          user={auth.user}
                        site_settings={site_settings}

      header={
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold leading-tight md:text-lg dark:text-gray-200">
            {t("Sub Categories")}
              </h2>
              {auth.user.permissions.includes("create-sub-category") && (

                  <Link
                      href={route("subCategory.create")}
                      className="px-3 py-1 text-sm text-white transition-all rounded shadow md:text-lg bg-burntOrange hover:bg-burntOrangeHover"
                  >
                      {t("Add new")}
                  </Link>
              )}
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " +t("Sub Categories")} />

      <div className="">
        <div className="mx-auto ">

          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
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
                    <td className=" text-nowrap">{t('Main Category')}</td>
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
                          placeholder={t("Category Name")}

                          onKeyPress={(e) => onKeyPress("name", e)}
                        />
                      </th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                    <tbody>
                        {subCategories && subCategories.data.length > 0 ? ( subCategories.data.map((category,index) => (
                        <tr
                            className={`${
                                index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}

                            key={category.id}
                        >
                            <td className="p-3">{category.id}</td>
                            <th className="p-3 text-nowrap">{category.name}</th>
                            <th className="text-nowrap">{category.main_category_name}</th>
                           <th className="p-3 text-center text-nowrap">
                            <span
                                className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                                category.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}
                            >
                                {category.is_active ? t('Active') : t('Inactive')}
                            </span>
                            </th>

                            <td className="p-3 text-nowrap">
                            {category.created_at}
                                </td>
                                <td className="p-3 text-nowrap">
                            {category.updated_at}
                            </td>
                            <td className="p-3 text-nowrap">
                            {/* Check if the user has permission to update the category */}
                            {auth.user.permissions.includes("update-sub-category") && (
                                <Link
                                href={route("subCategory.edit", category.id)}
                                className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                >
                                {t("Edit")}
                                </Link>
                            )}

                            {/* Check if the user has permission to delete the category */}
                            {auth.user.permissions.includes("delete-sub-category") && (
                                <button
                                onClick={(e) => deletecategory(category)}
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
                                    {t("No categories available")}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
              </div>
              {subCategories && <Pagination links={subCategories.meta.links} />}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
