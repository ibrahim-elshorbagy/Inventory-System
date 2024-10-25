import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";

    const resources = {
    en: {
        translation: {},
    },
    ar: {
        translation: {
            "Create Sub Category": "انشاء صنف فرعي",
            "Categories": "الاصناف",
            "Sub Category Name": " اسم الصنف الفرعي",
            "Main Category": "الصنف الرئيسي",
            "Select Main Category": "اختر الصنف الرئيسية",
            "Status": "الحالة",
            "Select Status": "اختر الحاله",
            "Cancel": "إلغاء",
            "Submit": "إرسال",
            'Active': 'نشط',
            'Inactive': 'غير نشط',
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

function Create({ auth,site_settings, user,mainCategories }) {
  const { t } = useTranslation();

  const { data, setData, post, errors, reset } = useForm({
    name: "",
    is_active: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();

    post(route("subCategory.store"));
  };

  return (
    <>
          <Head title={site_settings.websiteName + " - " +t("Sub Categories")} />

          <div className="">
                <div className="flex items-start justify-between p-5 mb-5 text-sm font-semibold leading-tight border-b md:text-lg dark:text-gray-200">
                    <h2>
                        {t("Create Sub Category")}
                    </h2>
                </div>
        <div className="mx-auto max-w-7xl ">
          <div className="m-2 bg-gray-100 rounded-md shadow-md sm:p-4 dark:bg-gray-700">
            <form
              onSubmit={onSubmit}
              className="p-4 "
            >
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-6">
            <div className="mt-4">
                <InputLabel htmlFor="category_name" value={t("Category Name")} />

                <TextInput
                  id="category_name"
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
                  <InputLabel htmlFor="mainCategory" value={t("Main Category")} />
                  <SelectInput
                    name="mainCategory"
                    id="mainCategory"
                    className="block w-full mt-1"
                    value={data.catgeory_id}
                    onChange={(e) => setData("category_id", e.target.value)}
                  >
                    <option value="">{t("Select Main Category")}</option>
                    {mainCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </SelectInput>
                  <InputError message={errors.catgeory_id} className="mt-2" />
                </div>
              <div className="mt-4">
                <InputLabel htmlFor="is_active" value={t("Status")} />

                    <SelectInput
                        name="is_active"
                        id="is_active"
                        className="block w-full mt-1"
                        value={data.is_active}
                        onChange={(e) => setData("is_active", e.target.value === "true") }
                    >
                        <option value="">{t("Select Status")}</option>
                        <option value="true" key="1">{t('Active')}</option>
                        <option value="false" key="2">{t('Inactive')}</option>
                    </SelectInput>

                <InputError message={errors.is_active} className="mt-2" />
              </div>
              </div>

              <div className="flex gap-2 mt-4 text-right">
                <Link
                  href={route("subCategory.index")}
                  className="px-3 py-1 mr-2 text-gray-800 transition-all bg-gray-100 rounded shadow hover:bg-gray-200"
                >
                  {t("Cancel")}
                </Link>
                <button className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover">
                  {t("Submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

Create.layout = (page) => (
    <AuthenticatedLayout
        user={page.props.auth.user}
        site_settings={page.props.site_settings}


    >
        {page}
    </AuthenticatedLayout>
);

export default Create;
