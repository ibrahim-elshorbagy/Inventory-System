<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */


    'attributes' => [

        'product_quantities.*.name' => 'Product name in row :position',
        'product_quantities.*.quantity' => 'Quantity in row :position',
        'product_quantities.*.category_id' => 'Category in row :position',
        'product_quantities.*.subcategory_id' => 'Subcategory in row :position',
        'product_quantities.*.warehouse_id' => 'Warehouse in row :position',
        'product_quantities.*.image_url' => 'Product image URL in row :position',
        'product_quantities.*.image_file' => 'Product image file in row :position',

    ],
];
