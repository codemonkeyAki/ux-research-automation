# Contributing to UX Research Automation

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/ux-research-automation.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes: `npm test`
6. Commit with clear messages: `git commit -m 'Add feature: description'`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

```bash
npm install
cp .env.example .env
# Edit .env with your test credentials
npm run dev
```

## Code Standards

- Use TypeScript for all new code
- Follow the existing code style
- Run `npm run format` to auto-format code
- Run `npm run lint` to check for issues
- Add tests for new features

## Testing

```bash
npm test
npm test -- --coverage
```

## Commit Messages

Use clear, descriptive commit messages:
- `feat: Add new feature`
- `fix: Fix bug in service`
- `docs: Update README`
- `refactor: Refactor module`
- `test: Add tests for feature`

## Pull Request Process

1. Update documentation as needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers

## Questions?

Open an issue or discussion in the repository.

Thank you for contributing! 🎉
