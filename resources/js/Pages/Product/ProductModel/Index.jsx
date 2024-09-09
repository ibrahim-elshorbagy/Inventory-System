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
                "Models": "النماذج",
                "Add new": "إضافة جديد",
                "ID": "الرقم التعريفي",
                "Name": "الاسم",
                "Create Date": "تاريخ الإنشاء",
                'Update Date': 'تاريخ التحديث',
                "Actions": "الإجراءات",
                "Model Name": "اسم النموذج",
                "Edit": "تعديل",
                "Delete": "حذف",
                "Are you sure you want to delete the Model?": "هل أنت متأكد أنك تريد حذف النموذج؟",
                "No models available": "لا يوجد نماذج متاحة",
                'Active': 'نشط',
                "Inactive":'غير نشط',
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);


export default function Index({ auth, models, queryParams = null, success }) {


  const { t } = useTranslation();

  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    router.get(route("model.index"), queryParams);
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
    router.get(route("model.index"), queryParams);
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

    const deletemodel = (model) => {
    const confirmationMessage = t("Are you sure you want to delete the Model?");
    if (!window.confirm(confirmationMessage)) {
      return;
    }

    router.delete(route("model.destroy", model.id), {
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
            {t("Models")}
              </h2>
              {auth.user.permissions.includes("create-model") && (

                  <Link
                      href={route("model.create")}
                      className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover"
                  >
                      {t("Add new")}
                  </Link>
              )}
        </div>
      }
    >
      <Head title={t("Models")} />

      <div className="py-12">
        <div className="mx-auto sm:px-6 lg:px-8">
          {visibleSuccess && (
            <div className="px-4 py-2 mb-4 text-white rounded bg-burntOrange">
              {visibleSuccess}
            </div>
                  )}
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
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

                      <th className="px-3 py-3">{t("Actions")}</th>
                    </tr>
                                  </thead>

                  <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.name}
                          placeholder={t("Model Name")}
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
                    </tr>
                  </thead>
                    <tbody>
                        {models && models.data.length > 0 ? ( models.data.map((model) => (
                        <tr
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            key={model.id}
                        >
                            <td className="px-3 py-2">{model.id}</td>
                            <th className="px-3 py-2 text-nowrap">{model.name}</th>
                           <th className="px-3 py-2 text-center text-nowrap">
                            <span
                                className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                                model.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}
                            >
                                {model.is_active ? t('Active') : t('Inactive')}
                            </span>
                            </th>

                            <td className="px-3 py-2 text-nowrap">
                            {model.created_at}
                                </td>
                                <td className="px-3 py-2 text-nowrap">
                            {model.updated_at}
                            </td>
                            <td className="px-3 py-2 text-nowrap">
                            {/* Check if the user has permission to update the model */}
                            {auth.user.permissions.includes("update-model") && (
                                <Link
                                href={route("model.edit", model.id)}
                                className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                >
                                {t("Edit")}
                                </Link>
                            )}

                            {/* Check if the user has permission to delete the model */}
                            {auth.user.permissions.includes("delete-model") && (
                                <button
                                onClick={(e) => deletemodel(model)}
                                className="mx-1 font-medium text-red-600 dark:text-red-500 hover:underline"
                                >
                                {t("Delete")}
                                </button>
                            )}
                            </td>

                        </tr>
                        ))) : (
                           <tr>
                                <td colSpan="5" className="px-3 py-2 text-center">
                                    {t("No models available")}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
              </div>
              {models && <Pagination links={models.meta.links} />}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
