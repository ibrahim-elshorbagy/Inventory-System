# Laravel Reactjs Inertiajs Inventory Management System (Warehouses)





# Overview
This project provides a robust solution for managing an inventory system, including product management, customer orders, and product releases. It supports both Arabic and English languages to cater to a broader audience.

# Features
Products
CRUD operations for managing product , Categoy , Warehouses information .
Add products in both Arabic and English.
Upload product images and descriptions.

![pic](Readme/images/s2.jpeg)
![pic](Readme/images/s3.PNG)
![pic](Readme/images/s4.jpeg)
![pic](Readme/images/s5.jpeg)

# Product Release
Ability to release products based on stock availability.
Manage and track product releases.
Option for customers to request product releases through their account.
Automated notifications for customers when a product is released.

![pic](Readme/images/s6.jpeg)
![pic](Readme/images/s7.jpeg)
![pic](Readme/images/s8.jpeg)
![pic](Readme/images/s9.jpeg)

# Customer Accounts
CRUD operations for managing customer accounts.
Customers can view their products, order history, and pending releases.
Customers can request a release of products from their account.
Option for customers to update their information, including billing and shipping details.

![pic](Readme/images/s11.jpeg)


 
 
 
# Inventory Reports
Generate comprehensive reports on product stock, sales, and customer orders.
Reports available in both Arabic and English.
Export reports as PDF or Excel files for further analysis.

![pic](Readme/images/s12.png)


# Notifications System
Customers and admins receive notifications for stock updates, order statuses, and product releases.

# Administrative Panel
Comprehensive admin panel to manage the entire inventory system.
Access to customer information, product details, stock levels, and order management.
Role-based access control to restrict or allow specific functionalities for different admin users.

# Technologies Used
Backend: Laravel 11 <br>
Frontend: React with Inertia.js <br>
Database: MySQL <br>
Languages: Arabic and English Support <br>


![pic](Readme/images/s1.jpeg)
![pic](Readme/images/s10.jpeg)


### Installation

1. Set up your database credentials in the `.env`
2. Run `composer install` to install dependencies
3. Run `npm install` to install dependencies
4. Run `php artisan migrate --seed` to create the database tables
5. Run `npm install` to install the frontend dependencies
6. Run `npm run dev`
7. Run `php artisan serve`
8. Generate a new application key with `php artisan key:generate`



