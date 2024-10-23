import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"

    const resources = {
    en: {},
    ar: {
        translation: {
                "Users": "العملاء",
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
                "No Users Found": "لا يوجد عملاء موجودين",
                "Phone": "الهاتف",
                "Address": "العنوان",
                "Info": "بيانات العميل",
                "Stock": "المخزن",
                "View Products": "منتجاته",
                "Edit Products": "تعديل المنتجات",
                "Orders": "الطلبات",
                "Add Order": "اضافة طلب",
                "Add Products Order": "اضافة منتجات",
            "Additions Orders": "طلبات الاضافة ",
            "Release Orders": 'طلبات الاسترجاع',
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);


export default function Index({ auth, users,site_settings, queryParams = null}) {


  const { t } = useTranslation();

  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    delete queryParams.page;
    router.get(route("customer.index"), queryParams);
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


    router.get(route("customer.index"), queryParams);
  };



    const deleteUser = (user) => {
       const confirmationMessage = t("Are you sure you want to delete the user?");
    if (!window.confirm(t(confirmationMessage))) {
      return;
    }

    router.delete(route("customer.destroy", user.id), {

    });
  };

  return (
      <AuthenticatedLayout
              site_settings={site_settings}

      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold leading-tight md:text-lg dark:text-gray-200">
            {t("Users")}
          </h2>
          <Link
            href={route("customer.create")}
            className="px-3 py-1 text-sm text-white transition-all rounded shadow bg-burntOrange md:text-lg hover:bg-burntOrangeHover"
          >
            {t("Add new")}
          </Link>
        </div>
      }
    >
      <Head title={site_settings.websiteName + " - " + t("Users")} />

      <div className="">
        <div className="mx-auto ">

          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-2 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-xs text-left text-gray-500 md:text-base rtl:text-right dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <TableHeading
                        name="id"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                        className="w-5"
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

                      <th className="p-3">{t("Phone")}</th>
                      <th className="p-3">{t("Address")}</th>

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
                        <td className="p-3">{user.phone}</td>
                        <td className="p-3 text-nowrap">{user.address}</td>
                        <td className="p-3 text-nowrap">
                          {user.created_at}
                            </td>
                            <td>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="text-emerald-700 dark:text-emerald-300 ">{t("Actions")}</DropdownMenuTrigger>
                                <DropdownMenuContent>

                                    {/* Check if the user has Info permission */}

                                    {(auth.user.permissions.includes("update-customer") || auth.user.permissions.includes("delete-customer")) && (
                                        <>
                                            <DropdownMenuLabel>{t("Info")}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}

                                        {/* Check if the user has permission to edit customers */}
                                        {auth.user.permissions.includes("update-customer") && (
                                            <DropdownMenuItem>
                                                <Link
                                                    href={route("customer.edit", user.id)}
                                                    className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                                >
                                                    {t("Edit")}
                                                </Link>
                                            </DropdownMenuItem>
                                        )}

                                    {/* Check if the user has permission to delete customers */}
                                    {auth.user.permissions.includes("delete-customer") && (
                                        <DropdownMenuItem>
                                            <button
                                                onClick={(e) => deleteUser(user)}
                                                className="mx-1 font-medium text-red-600 dark:text-red-500 hover:underline"
                                            >
                                                {t("Delete")}
                                            </button>
                                        </DropdownMenuItem>
                                    )}


                                    {(auth.user.permissions.includes("add-stock-order") || auth.user.permissions.includes("all-stock-orders")|| auth.user.permissions.includes("all-stock-orders")) && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel>{t("Stock")}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}
                                    {auth.user.permissions.includes("add-stock-order") && (
                                        <DropdownMenuItem>
                                            <Link
                                                    href={route("stock.add.page", user.id)}
                                                    className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                                >
                                                    {t("Add Products Order")}
                                            </Link>
                                        </DropdownMenuItem>
                                        )}
                                    {auth.user.permissions.includes("all-stock-orders") && (
                                        <DropdownMenuItem>
                                            <Link
                                                    href={route("stock.customer.orders", user.id)}
                                                    className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                                >
                                                    {t("Additions Orders")}
                                            </Link>
                                        </DropdownMenuItem>
                                        )}
                                        {auth.user.permissions.includes("read-stock") && (
                                        <DropdownMenuItem>
                                            <Link
                                                    href={route("customer.stock.show", user.id)}
                                                    className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                                >
                                                    {t("View Products")}
                                            </Link>
                                        </DropdownMenuItem>
                                        )}

                                        {auth.user.permissions.includes("admin-orders-make") && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuLabel>{t("Release Orders")}</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                            </>
                                        )}
                                        {auth.user.permissions.includes("admin-orders-make") && (
                                        <DropdownMenuItem>
                                            <Link
                                                    href={route("admin.make-order", user.id)}
                                                    className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                                >
                                                    {t("Add Order")}
                                            </Link>
                                        </DropdownMenuItem>
                                        )}

                                </DropdownMenuContent>
                            </DropdownMenu>


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
    </AuthenticatedLayout>
  );
}
