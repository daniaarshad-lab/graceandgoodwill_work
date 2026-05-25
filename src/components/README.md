# Common Components Guide

This folder contains reusable UI components used across the Care Management System.

## Components

### Button

Generic button component with multiple variants and sizes.

```tsx
import Button from "@/components/Button";

<Button text="Click me" variant="primary" size="md" />;
```

**Props:**

- `text` (string) - Button label
- `variant` ("primary" | "secondary" | "outline") - Style variant (default: "primary")
- `size` ("sm" | "md" | "lg") - Button size (default: "md")
- All standard HTML button attributes

---

### Card

Generic card wrapper for content grouping.

```tsx
import Card from "@/components/Card";

<Card className="custom-class">{/* Content */}</Card>;
```

**Props:**

- `children` (ReactNode) - Card content
- `className` (string, optional) - Additional CSS classes

---

### Input

Text input field with label and optional error state.

```tsx
import Input from "@/components/Input";

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Invalid email format"
/>;
```

**Props:**

- `label` (string) - Input label
- `error` (string, optional) - Error message to display
- All standard HTML input attributes

---

### Select

Dropdown/select component with label and optional error state.

```tsx
import Select from "@/components/Select";

<Select
  label="Role"
  options={[
    { value: "admin", label: "Administrator" },
    { value: "user", label: "User" },
  ]}
  error="Please select a role"
/>;
```

**Props:**

- `label` (string) - Select label
- `options` (Array<{value: string, label: string}>) - Available options
- `error` (string, optional) - Error message to display
- All standard HTML select attributes

---

### CenteredLayout

Layout wrapper for centered, single-column pages (e.g., auth pages).

```tsx
import CenteredLayout from "@/components/CenteredLayout";

<CenteredLayout title="Welcome" subtitle="Please login to continue">
  {/* Page content */}
</CenteredLayout>;
```

**Props:**

- `title` (string) - Page title
- `subtitle` (string, optional) - Subtitle text
- `children` (ReactNode) - Page content

---

## Usage Examples

### Auth Pages (Login, Register, etc.)

See `/src/app/auth/` for complete examples of how these components are used together.

### Styling

All components use Tailwind CSS and inherit the design system colors defined in `tailwind.config.ts`:

- Primary colors from the gold palette
- Navy background colors
- Standard spacing and shadows

---

## Best Practices

1. **Use common components** instead of creating auth-specific ones
2. **Pass proper TypeScript props** for type safety
3. **Leverage variants and sizes** instead of overriding styles
4. **Keep components reusable** - avoid adding feature-specific logic
5. **Use className prop** for custom styling only when necessary
