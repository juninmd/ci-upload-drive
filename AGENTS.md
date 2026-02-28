```markdown
# AGENTS.md File Guidelines

These guidelines are designed to ensure the consistent and high-quality development of the AGENTS repository. Adherence to these principles is crucial for maintainability, scalability, and reliability.

## 1. DRY (Don't Repeat Yourself)

*   All code should be reusable. Avoid duplication of logic, data structures, or utility functions.
*   Implement common patterns and abstractions where possible.
*   Document reusable components clearly.

## 2. KISS (Keep It Simple, Stupid)

*   Strive for simplicity in design and implementation.
*   Avoid unnecessary complexity.
*   Prioritize readability and maintainability.

## 3. SOLID Principles

*   **Single Responsibility Principle:** Each class/component should have one, and only one, reason to change.
*   **Open/Closed Principle:** The system should be open for extension but closed for modification.
*   **Liskov Substitution Principle:**  Subclasses should be substitutable for their base classes without altering the correctness of the program.
*   **Interface Segregation Principle:** Clients should not be forced to implement interfaces they do not use.
*   **Dependency Inversion Principle:** Interfaces should be replaced by implementations.

## 4. YAGNI (You Aren't Gonna Need It)

*   Only implement features that are absolutely necessary for the current task.
*   Defer implementation until it's needed.
*   Avoid premature optimization.

## 5. Code Length & Structure

*   **Maximum Code Length:** 180 lines of code per file.  Files exceeding this limit will be rejected.
*   **File Structure:** Organize code into logical modules/components, mirroring the API's design.
*   **Naming Conventions:** Use consistent naming conventions (e.g., camelCase for variables/functions, PascalCase for classes/modules).  See standard naming conventions documented elsewhere.
*   **Comments:** Provide clear and concise comments explaining complex logic or non-obvious decisions.  Comments should generally explain *why*, not *what*.

## 6. Test Coverage

*   **All code must be thoroughly tested.**  Unit tests and integration tests are mandatory.
*   **Test-Driven Development (TDD):** Follow TDD principles – write tests *before* implementation.
*   **Coverage Percentage:**  Target at least 80% test coverage.  Tools like `pytest` or `unittest` will be utilized.

## 7. Development Process

*   **Code Reviews:** All code changes must undergo review by at least one other developer.
*   **Version Control:** Use Git for version control with proper branching strategy (e.g., Gitflow).
*   **Commit Messages:** Commit messages should be concise and descriptive.
*   **Documentation:** Include clear API documentation, explaining inputs, outputs, and expected behavior.
*   **Error Handling:** Implement robust error handling and logging.
*   **Logging:**  Use a consistent logging framework to track events and debug issues.

## 8.  Specific Considerations for AGENTS (Repository Content - to be included in files within the repository):

*   **Data Models:** Clearly define data models with appropriate schemas.
*   **API Endpoints:** Document all API endpoints with required parameters and expected responses.
*   **Configuration:**  Manage configuration data separately from the core logic.
*   **Error Handling:** Design a consistent error handling strategy.
*   **Dependencies:** List and manage all dependencies clearly.

## 9.  Tools & Technologies

*   Use [Specific Versioning/Version Control Tool] for all code.
*   Utilize [Specific Debugging Tool] for issue tracking.
*   Employ [Specific Testing Framework] for unit and integration testing.

## 10.  Rules of Conduct

*   All code must be written with a focus on clarity and maintainability.
*   Collaboration is encouraged.
*   Respect each other's work.
*   Code is to be readable and well-commented.

These guidelines are intended to guide the development process and contribute to the overall quality of the AGENTS repository.  Any deviation from these guidelines requires discussion and approval from the team lead.
```