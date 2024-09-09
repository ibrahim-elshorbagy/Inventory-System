import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";
const resources = {
  en: {
    translation: {},
  },
  ar: {
    translation: {
      "Manage Permissions": "ادارة الأذونات",
      "Manage Permissions for": "ادارة الأذونات ل",
      "Permission": "الأذونات",
      "Assign": "تعيين",
    },
  },
};
i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function EditPermissions({ auth, role, groupedPermissions, rolePermissions }) {
  const { t } = useTranslation();
  const { data, setData, put } = useForm({ permissions: rolePermissions });

  const handleCheckboxChange = (permission) => {
    if (data.permissions.includes(permission)) {
      setData("permissions", data.permissions.filter((perm) => perm !== permission));
    } else {
      setData("permissions", [...data.permissions, permission]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route("admin.roles-permissions.update", role.id), { preserveScroll: true });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={t("Manage Permissions")} />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <h2 className="text-xl font-semibold dark:text-gray-200">
              {t("Manage Permissions for")}: {role.name}
            </h2>
            <form onSubmit={handleSubmit} className="mt-6">
              {Object.keys(groupedPermissions).map((category) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h3>
                  <div className="overflow-auto">
                    <table className="w-full mt-4 text-sm text-right text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th className="w-1/2 px-6 py-3">{t("Permission")}</th>
                          <th className="w-1/2 px-6 py-3 ">{t("Assign")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedPermissions[category].map((permission) => (
                          <tr
                            key={permission.id}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          >
                            <td className="px-6 py-4">{permission.name}</td>
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={data.permissions.includes(permission.name)}
                                onChange={() => handleCheckboxChange(permission.name)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              <div className="mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  {t("Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
