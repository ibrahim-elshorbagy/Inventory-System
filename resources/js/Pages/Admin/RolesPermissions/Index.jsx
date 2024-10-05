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

export default function Index({ auth,site_settings, roles, success }) {
  const { t } = useTranslation();

  return (
      <AuthenticatedLayout
    site_settings={site_settings}

        header={
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold leading-tight md:text-lg dark:text-gray-200">
            {t("Roles")}
            </h2>
        </div>
      }
          user={auth.user}>
      <Head title={site_settings.websiteName + " - " +t("Roles")} />

      <div className="">
        <div className="mx-auto max-w-7xl ">
          {success && (
            <div className="p-4 mb-4 text-white bg-green-500 rounded">
              {success}
            </div>
          )}

          <div className="p-6 overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">


            <div className="mt-6 overflow-auto">

            <table className="w-full mt-6 text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
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
    </AuthenticatedLayout>
  );
}
