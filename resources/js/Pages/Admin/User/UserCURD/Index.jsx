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
        translation: {
            "Users": "Users",
            "Add new": "Add new",
            "ID": "ID",
            "Name": "Name",
            "Email": "Email",
            "Create Date": "Create Date",
            "Actions": "Actions",
            "User Name": "User Name",
            "User Email": "User Email",
            "Edit": "Edit",
            "Delete": "Delete",
            "Are you sure you want to delete the user?": "Are you sure you want to delete the user?"
        },
    },
    ar: {
        translation: {
                "Users": "المستخدمين",
                "Add new": "إضافة جديد",
                "ID": "الرقم التعريفي",
                "Name": "الاسم",
                "Email": "البريد الإلكتروني",
                "Create Date": "تاريخ الإنشاء",
                "Actions": "الإجراءات",
                "User Name": "اسم المستخدم",
                "User Email": "بريد المستخدم",
                "Edit": "تعديل",
                "Delete": "حذف",
                "Are you sure you want to delete the user?": "هل أنت متأكد أنك تريد حذف المستخدم؟",
                "No Users Found": "لا يوجد مستخدمين"
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);


 function Index({ auth,site_settings, users, queryParams = null }) {


  const { t } = useTranslation();

  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
      delete queryParams.page;
    router.get(route("user.index"), queryParams);
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
    router.get(route("user.index"), queryParams);
  };



    const deleteUser = (user) => {
       const confirmationMessage = t("Are you sure you want to delete the user?");
    if (!window.confirm(t(confirmationMessage))) {
      return;
    }

    router.delete(route("user.destroy", user.id), {

    });
  };

  return (
    <>
      <Head title={site_settings.websiteName + " - " +t("Users")} />

      <div className="">
        <div className="mx-auto ">

        <div className="overflow-hidden overflow-y-auto bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-2 text-gray-900 dark:text-gray-100">
                <div className="flex items-start justify-between p-5 mb-5 text-sm font-semibold leading-tight border-b md:text-lg dark:text-gray-200">
                    <h2>
                        {t("Users")}
                    </h2>
                    <div>
                        <Link
                                href={route("user.create")}
                                className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
                            >
                                {t("Add new")}
                        </Link>
                    </div>
                </div>

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

                      <TableHeading
                        name="email"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        {t("Email")}
                      </TableHeading>

                      <TableHeading
                        name="created_at"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        {t("Create Date")}
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
                          placeholder={t("User Name")}
                          onBlur={(e) =>
                            searchFieldChanged("name", e.target.value)
                          }
                          onKeyPress={(e) => onKeyPress("name", e)}
                        />
                      </th>
                      <th className="p-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.email}
                          placeholder={t("User Email")}
                          onBlur={(e) =>
                            searchFieldChanged("email", e.target.value)
                          }
                          onKeyPress={(e) => onKeyPress("email", e)}
                        />
                      </th>
                      <th className="p-3"></th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.data.length > 0 ? (users.data.map((user,index) => (
                      <tr
                        className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                            } border-b dark:${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} dark:border-gray-700`}

                        key={user.id}
                      >
                        <td className="p-3">{user.id}</td>
                        <th className="p-3 text-nowrap">{user.name}</th>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3 text-nowrap">
                          {user.created_at}
                        </td>
                            <td className="p-3 text-nowrap">
                            {/* Check if the user has permission to manage users */}
                            {auth.user.permissions.includes("for-SystemAdmin-manage-users") && (
                                <>
                                <Link
                                    href={route("user.edit", user.id)}
                                    className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                >
                                    {t("Edit")}
                                </Link>
                                <button
                                    onClick={(e) => deleteUser(user)}
                                    className="mx-1 font-medium text-red-600 dark:text-red-500 hover:underline"
                                >
                                    {t("Delete")}
                                </button>
                                </>
                            )}
                            </td>

                      </tr>
                    ))) : (
                            <tr>
                                <td colSpan="5" className="p-3 text-center">
                                    {t("No Users Found")}
                                </td>
                            </tr>

                    )}
                  </tbody>
                </table>
              </div>
              {users && <Pagination links={users.meta.links} />}
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
