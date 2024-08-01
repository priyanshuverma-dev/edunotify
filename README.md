> Important!
> This project is no more maintained by anyone and online preview is available. You can still see the code and build something new. For any collaboration feel free to contact [Priyanshu Verma](https://www.linkedin.com/in/priyanshuverma04/)


# EduNotify

EduNotify is a web application designed to provide a notice board feature for educational institutions, allowing users to manage notices with role-based access control. The application leverages technologies such as Permit.io, Clerk Authentication, Next.js, Tailwind CSS, and Shadcn-UI to deliver a seamless and intuitive user experience.

## Features

- **Notice Board Management**: Users can create, edit, and delete notices on the notice board.
- **Role-Based Access Control**: Different user roles (e.g., principal, teacher, student) have different permissions to manage notices.
- **Authentication**: Secure authentication and user management powered by Clerk Authentication.
- **Real-Time Updates**: Seamless updates and notifications when new notices are added or existing ones are modified.
- **Responsive Design**: Fully responsive design ensuring a consistent experience across devices.


[![Demo Video](https://img.youtube.com/vi/I2KNavXwWV8/0.jpg)](https://www.youtube.com/embed/I2KNavXwWV8)
## Technologies Used

- **Permit.io**: Provides fine-grained access control with a flexible permission system.
- **Clerk Authentication**: Handles user authentication and session management.
- **Next.js**: React framework for building server-rendered web applications.
- **Tailwind CSS**: Utility-first CSS framework for rapidly building custom designs.
- **Shadcn-UI**: UI component library for React, offering a collection of customizable components.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/edunotify.git
   ```

2. Navigate to the project directory:

   ```bash
   cd edunotify
   ```

3. Install dependencies:

   ```bash
   bun install
   ```

4. Set up environment variables:

   Create a `.env` file in the root directory and add the required environment variables. Refer to the `.env.example` file for the list of variables needed.

5. Initialize the database:

   ```bash
   npx prisma generate
   ```

6. Run the development server:

   ```bash
   bun run dev
   ```

7. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

1. Sign up or log in with your credentials.
2. Navigate to the school.
3. Depending on your role, you can perform actions such as creating, editing, or deleting notices.
4. Explore other features and functionalities tailored to your role.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).


## Contributors
- Priyanshu Verma ([@priyanshuverma-dev](https://github.com/priyanshuverma-dev))
