# Contributing to EduNotify

First off, thank you for considering contributing to EduNotify! It's people like you that make this project great. We welcome any contributions including bug fixes, enhancements, or new features.

## How to Contribute

### Reporting Issues

If you encounter any bugs or have suggestions for improvements, please create an issue on GitHub. When reporting an issue, please include:

- A clear and descriptive title.
- A detailed description of the problem or suggestion.
- Steps to reproduce the issue, if applicable.
- Any relevant code snippets, logs, or screenshots.

### Forking the Repository

1. Fork the repository by clicking the "Fork" button on the top right of the GitHub page.
2. Clone your fork to your local machine:

   ```bash
   git clone https://github.com/yourusername/edunotify.git
   ```

3. Add the original repository as a remote:

   ```bash
   cd edunotify
   git remote add upstream https://github.com/yourusername/edunotify.git
   ```

### Setting Up the Development Environment

1. Install dependencies:

   ```bash
   bun install
   ```

2. Set up environment variables:

   Create a `.env` file in the root directory and add the required environment variables. Refer to the `.env.example` file for the list of variables needed.

3. Generate Prisma schemas

   ```bash
   npx prisma generate
   ```


3. Run the development server:

   ```bash
   bun run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

### Making Changes

1. Create a new branch for your changes:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the new branch.
3. Ensure your code adheres to the project's coding standards.
4. Test your changes thoroughly.

### Submitting Pull Requests

1. Push your changes to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a pull request (PR) from your branch to the `main` branch of the original repository.
3. In your PR description, include:

   - A clear and descriptive title.
   - A detailed description of the changes you made.
   - Any relevant issue numbers (e.g., `Closes #123`).
   - Screenshots or GIFs of the changes, if applicable.

### Code Review

Your pull request will be reviewed by one of the project maintainers. They may ask you to make some changes before merging the PR. Once your changes are approved, your PR will be merged into the main branch.

## Coding Standards

- Follow the existing code style.
- Write clear, concise, and descriptive commit messages.
- Ensure all new and existing tests pass.
- Add tests for your changes where applicable.

## License

By contributing to EduNotify, you agree that your contributions will be licensed under the [MIT License](LICENSE).

Thank you for contributing to EduNotify!
