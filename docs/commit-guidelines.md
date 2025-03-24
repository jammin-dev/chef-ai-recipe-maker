# Commit Message Guidelines

Below is a concise version of the **commit message guidelines** (following the [Conventional Commits](https://www.conventionalcommits.org/) approach):

---

1. **Format**:

   ```
   type(scope?): description
   ```

   - **type**: A keyword indicating the type of change (e.g., `feat`, `fix`, `docs`, etc.).
   - **scope**: (optional) A short context for the change (e.g., `auth`, `api`, `ui`).
   - **description**: A concise summary of the change, in the **imperative mood**.

2. **Keep it short**: First line ideally under 50 characters.

3. **Imperative mood**:

   - Correct: “Add authentication middleware”
   - Incorrect: “Added authentication middleware”

4. **Body (Optional)**: If you need to explain more, add a blank line after the first line and then provide details in the next line(s). Focus on the **what** and **why**, not the how.

---

### Common Commit Types

| **Type**   | **Description**                                          | **Example**                                               |
| ---------- | -------------------------------------------------------- | --------------------------------------------------------- |
| `feat`     | Introducing a **new feature**                            | `feat(auth): add OAuth login functionality`               |
| `fix`      | A **bug fix**                                            | `fix(api): handle null inputs to user endpoint`           |
| `docs`     | **Documentation**-only changes                           | `docs: update README with installation instructions`      |
| `style`    | **Formatting** changes (no code logic alterations)       | `style: fix ESLint warnings and tidy up indentation`      |
| `refactor` | **Refactoring** (neither fixes a bug nor adds a feature) | `refactor: simplify data-fetching in dashboard component` |
| `perf`     | **Performance** improvements                             | `perf: cache user data to reduce load times`              |
| `test`     | **Tests** – adding or updating tests                     | `test: add unit tests for form validations`               |
| `chore`    | **Miscellaneous** tasks (build process, dependencies)    | `chore: update dependencies to latest versions`           |
| `build`    | Changes affecting the **build system**                   | `build: add webpack configuration for production build`   |
| `ci`       | Changes to **CI/CD** configuration                       | `ci: update GitHub Actions to run tests on PRs`           |
| `revert`   | **Reverts** a previous commit                            | `revert: fix(api): handle null inputs to user endpoint`   |

**Example commit message**:

```
feat(search): add fuzzy matching for partial queries

Implements a fuzzy matching algorithm that improves user experience
by allowing searches for partial or misspelled terms.
```

---

Use these guidelines to ensure your commit history is clear and consistent. Remember to keep commit messages meaningful and to the point!
