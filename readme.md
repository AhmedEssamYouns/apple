# AppleStore

**AppleStore** is an e-commerce application built using **React Native** with **Expo** for the frontend and **Firebase** for the backend. The app offers seamless shopping experiences for users, focusing on Apple products like iPhones, Watches, and MacBooks. Below is a breakdown of the features:

## 📄 Detailed PDF

Check out this detailed PDF that explains the features of the **AppleStore** app: [AppleStore Features PDF](https://eu.docs.wps.com/module/common/loadPlatform/?sid=sIJPcsqyTAtvw8LcG&v=v2)

## 🎥 Demo Video

Watch the demo video here: [AppleStore Demo Video](https://drive.google.com/file/d/1e5UqYlzItr76iczMyUPsqmp8Sp0sD1u6/view)

## 🛍️ User View Features

- **User Sign-Up:** Users must sign up with a unique username and verify their email address for account security.
- **Product Search & Filters:** Easily search products by name, filter by category or price range, and set custom price filters.
- **Stock Availability:** Clearly displayed stock levels, with "Out of Stock" status when applicable.
- **Cart Quantity Management:** Add up to 10 items of a product to the cart; cancel orders before shipping.
- **Order Management:** Cancel orders before shipping; automatic quantity updates in the database upon cancellation.
- **Product Reviews:** Leave, edit, or delete reviews for purchased products; only one review per product allowed.
- **Favorites & Offers:** Add products to favorites and benefit from special offer prices or best-seller promotions.
- **Profile Customization:** Edit profile details, including adding a profile picture, phone number, and address.
- **Discount Codes:** Apply discount codes (5%, 10%, 50%) during checkout, managed by admins.
- **Secure Checkout:** Verification of personal details during checkout for accurate shipping.

## 🛠️ Admin Dashboard Features

- **Product Management:** Add, edit, or delete products; mark items as best-sellers or apply offer prices.
- **Order Control:** Manage order statuses, including marking orders as "Ready," "Shipped," or "Canceled."
- **Review Moderation:** Review and moderate user feedback as needed.
- **Customer Support:** Admins review and respond to messages from the "Contact Us" page for excellent customer service.
- **Discount Management:** Admins manage discount codes for a better shopping experience.

## 🚀 Installation

1. Clone the repository.
2. Create a Firebase Cloud project and obtain the configuration details.
3. In the root directory of your project, create a new file named `.env` and add the following:

   ```plaintext
   API_KEY=<Your API Key>
   AUTH_DOMAIN=<Your Auth Domain>
   PROJECT_ID=<Your Project ID>
   STORAGE_BUCKET=<Your Storage Bucket>
   MESSAGING_SENDER_ID=<Your Messaging Sender ID>
   APP_ID=<Your App ID>
   
4. Install dependencies using npm install
5. Start the app with expo start.

## Technology Stack

- **Frontend:** React Native with Expo
- **Backend:** Firebase Firstore add emoges
