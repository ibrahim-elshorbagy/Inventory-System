import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook
import i18n from "@/i18nConfig";
    const resources = {
    en: {
        translation: {},
    },
    ar: {
        translation: {
                "Categories": "الاصناف",
                "Edit Category": "تعديل الصنف",
                "ID": "الرقم التعريفي",
                "Name": "الاسم",
                "Email": "البريد الإلكتروني",
                "Create Date": "تاريخ الإنشاء",
                "Actions": "الإجراءات",
                "Select Status": "اختر الحاله",
                "Status": "الحالة",
                'Active': 'نشط',
                'Inactive': 'غير نشط',
                "Cancel": "إلغاء",
                "Submit": "إرسال",



        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function Create({ auth,site_settings, category,hasSubCategories  }) {
  const { t } = useTranslation();


  const { data, setData, post, errors, reset } = useForm({
    name: category.name || "",
    is_active: category.is_active !== undefined ? category.is_active : "",

    _method: "PUT",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("category.update", category.id));
  };

  return (
    <AuthenticatedLayout
          user={auth.user}
                        site_settings={site_settings}

      header={
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold leading-tight md:text-lg dark:text-gray-200">
            {t("Edit Category")} "{data.name}"
          </h2>
        </div>
      }
    >
          <Head title={site_settings.websiteName + " - " +t("Categories")} />


      <div className="">
        <div className="mx-auto max-w-7xl ">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 bg-white shadow sm:p-4 dark:bg-gray-800 sm:rounded-lg"
                      >
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-6">
              <div className="mt-4">
                <InputLabel htmlFor="name" value={t("Name")} />

                <TextInput
                  id="name"
                  type="text"
                  name="name"
                  value={data.name}
                  className="block w-full mt-1"
                  isFocused={true}
                  onChange={(e) => setData("name", e.target.value)}
                />

                <InputError message={errors.name} className="mt-2" />
                </div>
              <div className="mt-4">
                <InputLabel htmlFor="is_active" value={t("Status")} />

                    <SelectInput
                        name="is_active"
                        id="is_active"
                        className="block w-full mt-1"
                        value={data.is_active === true ? "true" : "false"}
                        onChange={(e) => setData("is_active", e.target.value === "true")}
                        disabled={hasSubCategories}
                    >
                        <option value="">{t("Select Status")}</option>
                        <option value="true" key="1">{t('Active')}</option>
                        <option value="false" key="2">{t('Inactive')}</option>
                    </SelectInput>

                <InputError message={errors.isactive} className="mt-2" />
                <InputError message={errors.is_active} className="mt-2" />
              </div>

              <div className="flex gap-2 mt-4 text-right">
                <Link
                  href={route("category.index")}
                  className="px-3 py-1 mr-2 text-gray-800 transition-all bg-gray-100 rounded shadow hover:bg-gray-200"
                >
                  {t("Cancel")}
                </Link>
                <button className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover">
                  {t("Submit")}
                </button>
                              </div>
                          </div>

            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
