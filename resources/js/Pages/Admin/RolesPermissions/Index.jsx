import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";
import { useState, useEffect } from "react";

const resources = {
  en: {
    translation: {
      "Roles": "Roles",
      "Role": "Role",
      "Actions": "Actions",
      "Edit Permissions": "Edit Permissions",
    },
  },
  ar: {
    translation: {
      "Roles": "الأدوار",
      "Role": "الدور",
      "Actions": "الإجراءات",
      "Edit Permissions": "تعديل الأذونات",
    },
  },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

 function Index({ auth,site_settings, roles }) {
  const { t } = useTranslation();

  return (
      <>
      <Head title={site_settings.websiteName + " - " +t("Roles")} />

          <div className="">
                <div className="flex items-start justify-between p-5 mb-5 text-sm font-semibold leading-tight border-b md:text-lg dark:text-gray-200">
                    <h2>
                        {t("Roles")}
                    </h2>
                </div>

        <div className="mx-auto max-w-7xl ">

          <div className="p-6 overflow-hidden bg-gray-100 shadow-sm dark:bg-gray-700 sm:rounded-lg">


            <div className="overflow-auto ">

            <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                    <th className="px-6 py-3 ">{t("Role")}</th>
                    <th className="px-6 py-3 ">{t("Actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        roles.map((role, index) => (
                            <tr
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                key={index}
                            >
                                <td className="p-3 text-nowrap">{role.name}</td>
                                <td className="px-6 py-2 text-nowrap">
                                    <Link
                                        href={route("admin.roles-permissions.edit", role.id)}
                                        className="rounded text-burntOrange "
                                    >
                                        {t("Edit Permissions")}
                                     </Link>
                                </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
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
