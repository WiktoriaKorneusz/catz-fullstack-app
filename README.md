# 😺 Catz Fullstack App

Hi! **Catz** is a full-stack social media application built with Angular 17 for the frontend and .NET 8 for the backend. It's a platform where cat enthusiasts can connect, share adorable cat photos, and engage in lively discussions about their feline companions. You can see demo [there](catz.azurewebsites.net).


# 💪 Key features

 - Real-time in app notifications and messaging
 - User profiles with customizable information
 - Post upload functionality with images
 - Role based authentication
 - Account verification via email
 - Forgot password functionality
 - Possibility of searching for users, post and messages based on name, location, description, interests and content
 - Paginated pages
 

## 🙌 Backend

Backend of Catz is built using C# and .NET 8. The data layer utilizes Entity Framework Core to interact with the MSSQL database, providing an object-oriented approach to data management.

### Core Technologies

-   **MSSQL (Azure SQL Edge):** Storing user data, cat profiles, posts, and other information in a reliable and scalable database.
-   **SignalR:** Enabling real-time communication for features like notifications and chat.
-   **Cloudinary:** Handling image uploads, storage, and optimization for efficient delivery.
-   **Outlook SMTP:** Sending emails for user verification, password resets, and data from contact form.

## 😽 Frontend
The Catz frontend is crafted using Angular 17, delivering a dynamic and engaging user experience. Component-based architecture helps with modularity and reusability. Responsive design adapts seamlessly to various screen sizes and devices.

### Core Technologies
-   **Signals:** The latest state management solution, offering a reactive and performant way to manage application state.
-   **Tailwind CSS:** A utility-first CSS framework for rapid and efficient styling.
-   **Toastr:** A notification library for displaying informative messages to users.
-   **Reactive Forms:** A powerful form handling solution for creating complex forms with validation and dynamic updates.
