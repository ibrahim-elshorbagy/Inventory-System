import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import TextAreaInput from "@/Components/TextAreaInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook
import i18n from "@/i18nConfig";
import { useEffect, useState } from "react";

// Translation resources
const resources = {
  en: {
    translation: {
      "Edit Product": "Edit Product",
      "Products": "Products",
      "Product Name": "Product Name",
      "Status": "Status",
      "Category": "Category",
      "Brand": "Brand",
      "Model": "Model",
      "Unit": "Unit",
      "Select Category": "Select Category",
      "Select Brand": "Select Brand",
      "Select Model": "Select Model",
      "Select Unit": "Select Unit",
      "Cancel": "Cancel",
      "Submit": "Submit",
      "Active": "Active",
      "Inactive": "Inactive",
      "Product Details": "Product Details",
    },
  },
  ar: {
    translation: {
      "Edit Product": "تعديل المنتج",
      "Products": "المنتجات",
      "Product Name": "اسم المنتج",
      "Status": "الحالة",
      "Category": "الفئة",
      "Brand": "العلامة التجارية",
      "Model": "النموذج",
      "Unit": "الوحدة",
      "Select Category": "اختر الفئة",
      "Select Brand": "اختر العلامة التجارية",
      "Select Model": "اختر النموذج",
      "Select Unit": "اختر الوحدة",
      "Cancel": "إلغاء",
      "Submit": "إرسال",
      "Active": "نشط",
      "Inactive": "غير نشط",
      "Product Details": "تفاصيل المنتج",
    },
  },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function Edit({ auth, product, categories = [], brands = [], models = [], units = [] }) {
  const { t } = useTranslation();

  // Initialize the form with existing product data
  const { data, setData, post, errors } = useForm({
    name: product.name || "",
    category: product.category || "",
    brand: product.brand || "",
    model: product.model || "",
    unit: product.unit || "",
    is_active: product.is_active !== undefined ? product.is_active : "",
    details: product.details || "",
    _method: "PUT",
  });

    // Update product  based on category, brand, and model
      const [isEdited, setIsEdited] = useState(false);
    useEffect(() => {
    if (!isEdited) {
        const [category, brand, model, unit] = (product.name || "").split(" - ");
        setData(prevData => ({
        ...prevData,
        category: category || product.category || "",
        brand: brand || product.brand || "",
        model: model || product.model || "",
        unit: unit || product.unit || "",
        }));
    }
    }, [product, isEdited]);

    useEffect(() => {
    if (isEdited || (!product.name && !product.category && !product.brand && !product.model)) {
        const selectedName = [data.category, data.brand, data.model].filter(Boolean).join(" - ");
        setData("name", selectedName);
    }
    }, [data.category, data.brand, data.model, isEdited]);

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
    setIsEdited(true);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    post(route("product.update", product.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight  dark:text-gray-200">
            {t("Edit Product")}
          </h2>
        </div>
      }
    >
      <Head title={t("Products")} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 bg-white shadow sm:p-8 dark:bg-gray-800 sm:rounded-lg"
            >
              <div className="grid gap-4 mb-4 sm:grid-cols-1 sm:gap-6 sm:mb-6">
                {/* Product Name */}
                <div className="mt-4">
                  <InputLabel htmlFor="name" value={t("Product Name")} />
                  <TextInput
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="block w-full mt-1"
                    readOnly
                    disabled
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>

                {/* Category */}
                <div className="mt-4">
                  <InputLabel htmlFor="category" value={t("Category")} />
                  <SelectInput
                    name="category"
                    id="category"
                    className="block w-full mt-1"
                    value={data.category}
                     onChange={handleInputChange}
                     >
                    <option value="">{t("Select Category")}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </SelectInput>
                  <InputError message={errors.category} className="mt-2" />
                </div>

                {/* Brand */}
                <div className="mt-4">
                  <InputLabel htmlFor="brand" value={t("Brand")} />
                  <SelectInput
                    name="brand"
                    id="brand"
                    className="block w-full mt-1"
                    value={data.brand}
                    onChange={handleInputChange}
                  >
                    <option value="">{t("Select Brand")}</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </SelectInput>
                  <InputError message={errors.brand} className="mt-2" />
                </div>

                {/* Model */}
                <div className="mt-4">
                  <InputLabel htmlFor="model" value={t("Model")} />
                  <SelectInput
                    name="model"
                    id="model"
                    className="block w-full mt-1"
                    value={data.model}
                    onChange={handleInputChange}
                  >
                    <option value="">{t("Select Model")}</option>
                    {models.map((model) => (
                      <option key={model.id} value={model.name}>
                        {model.name}
                      </option>
                    ))}
                  </SelectInput>
                  <InputError message={errors.model} className="mt-2" />
                </div>

                {/* Unit */}
                <div className="mt-4">
                  <InputLabel htmlFor="unit" value={t("Unit")} />
                  <SelectInput
                    name="unit"
                    id="unit"
                    className="block w-full mt-1"
                    value={data.unit}
                    onChange={handleInputChange}
                  >
                    <option value="">{t("Select Unit")}</option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.name}>
                        {unit.name}
                      </option>
                    ))}
                  </SelectInput>
                  <InputError message={errors.unit} className="mt-2" />
                </div>

                {/* Status */}
                <div className="mt-4">
                  <InputLabel htmlFor="is_active" value={t("Status")} />
                  <SelectInput
                    name="is_active"
                    id="is_active"
                    className="block w-full mt-1"
                    value={data.is_active}
                    onChange={handleInputChange}
                  >
                    <option value="">{t("Select Status")}</option>
                    <option value="true">{t("Active")}</option>
                    <option value="false">{t("Inactive")}</option>
                  </SelectInput>
                  <InputError message={errors.is_active} className="mt-2" />
                </div>

                {/* Product details */}
                <div className="mt-4">
                  <InputLabel htmlFor="details" value={t("Product Details")} />
                  <TextAreaInput
                    id="details"
                    type="text"
                    name="details"
                    value={data.details}
                    className="block w-full mt-1"
                    onChange={handleInputChange}
                  />
                  <InputError message={errors.details} className="mt-2" />
                </div>
              </div>

              <div className="flex gap-2 mt-4 text-right">
                <Link
                  href={route("product.index")}
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
    </AuthenticatedLayout>
  );
}
