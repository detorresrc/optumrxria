# Design Document: Contacts & Access Step

## Overview

The Contacts & Access step is the third step in the Add Client multi-step wizard. It allows users to add one or more contacts associated with a client, capturing their type, name, email, status, and notification preferences. The component uses a dynamic form array pattern to support adding and removing contacts.

## Architecture

The implementation follows the existing patterns established in the CORE application:

```
AddClientPage (parent form context)
└── AddClientStepper
    └── ContactsAccessStep (Step 3)
        ├── Accordion (MUI)
        │   ├── Section Header
        │   └── Contact List
        │       ├── ContactEntry[0] (no delete)
        │       ├── Separator + ContactEntry[1] (with delete)
        │       └── ... more entries
        └── AddContactButton
```

### Form State Management

- Uses `react-hook-form` with `useFieldArray` for dynamic contact list management
- Zod schema validation for contact entries
- Form state shared with parent `AddClientPage` via form context

## Components and Interfaces

### ContactsAccessStep Component

```typescript
interface ContactsAccessStepProps {
  // No props needed - uses form context from parent
}


const ContactsAccessStep: React.FC<ContactsAccessStepProps> = () => {
  // Access form context from parent
  // Use useFieldArray for contacts array management
  // Render accordion with contact entries
}
```

### ContactEntry Component

```typescript
interface ContactEntryProps {
  index: number;           // Position in the contacts array
  onRemove?: () => void;   // Callback to remove this entry (undefined for first entry)
  showSeparator: boolean;  // Whether to show separator line above
}
```

### Form Field Types

```typescript
interface Contact {
  contactType: string;
  firstName: string;
  lastName: string;
  email: string;
  status?: string;
  sendEmailNotification: 'yes' | 'no';
}

interface ContactsAccessFormData {
  contacts: Contact[];
}
```

## Data Models

### Zod Schema Extension

```typescript
// Add to existing addClientSchema.ts
const contactSchema = z.object({
  contactType: z.string().min(1, 'Required field'),
  firstName: z.string().min(1, 'Required field'),
  lastName: z.string().min(1, 'Required field'),
  email: z.string().min(1, 'Required field').email('Invalid email format'),
  status: z.string().optional(),
  sendEmailNotification: z.enum(['yes', 'no']).default('yes'),
});

const contactsAccessSchema = z.object({
  contacts: z.array(contactSchema).min(1, 'At least one contact is required'),
});
```


### Default Values

```typescript
const defaultContact: Contact = {
  contactType: '',
  firstName: '',
  lastName: '',
  email: '',
  status: '',
  sendEmailNotification: 'yes',
};

const contactsAccessDefaults: ContactsAccessFormData = {
  contacts: [defaultContact],
};
```

### Dropdown Options

```typescript
const contactTypeOptions = [
  { value: 'primary', label: 'Primary Contact' },
  { value: 'billing', label: 'Billing Contact' },
  { value: 'technical', label: 'Technical Contact' },
  { value: 'executive', label: 'Executive Sponsor' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];
```

## Component Layout

### Grid Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Contacts & Access                                          [▼]  │
│ Complete the fields below.                                      │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │
│ │ Contact Type*│ │ First Name*  │ │ Last Name*   │              │
│ └──────────────┘ └──────────────┘ └──────────────┘              │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────┐  │
│ │ Email*       │ │ Status       │ │ Send email Notification  │  │
│ └──────────────┘ └──────────────┘ │ ○ Yes                    │  │
│                                   └──────────────────────────┘  │
│ ─────────────────────────────────────────────────────── [🗑️]   │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │
│ │ Contact Type*│ │ First Name*  │ │ Last Name*   │              │
│ └──────────────┘ └──────────────┘ └──────────────┘              │
│ ... (additional contact fields)                                 │
│                                                                 │
│ [+] Add another contact                                         │
└─────────────────────────────────────────────────────────────────┘
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Adding a contact increases list length

*For any* contact list with n contacts, clicking "Add another contact" should result in a contact list with n+1 contacts, where the new contact has default empty values.

**Validates: Requirements 3.3**

### Property 2: Delete button visibility follows contact position

*For any* contact list with n contacts where n > 1, exactly n-1 delete buttons should be visible (one for each contact except the first).

**Validates: Requirements 3.5, 3.7**

### Property 3: Removing a contact decreases list length

*For any* contact list with n contacts where n > 1, clicking the delete button on any contact (except the first) should result in a contact list with n-1 contacts.

**Validates: Requirements 3.6**

### Property 4: Required field validation

*For any* contact entry where any required field (contactType, firstName, lastName, email) is empty or whitespace-only, form validation should fail with "Required field" error message for that field.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 5: Email format validation

*For any* string that does not match a valid email format (containing @ and domain), the email field validation should fail with "Invalid email format" error message.

**Validates: Requirements 4.5**

### Property 6: Valid form allows navigation

*For any* form state where all required fields in all contact entries are filled with valid values, form validation should pass and navigation to the next step should be allowed.

**Validates: Requirements 4.6**

### Property 7: Contact data persistence round trip

*For any* contact data entered in Step 3, navigating away to another step and returning to Step 3 should restore the exact same contact data.

**Validates: Requirements 6.2, 6.3**


## Error Handling

### Validation Errors

| Field | Validation | Error Message |
|-------|------------|---------------|
| Contact Type | Required | "Required field" |
| First Name | Required | "Required field" |
| Last Name | Required | "Required field" |
| Email | Required | "Required field" |
| Email | Format | "Invalid email format" |

### Edge Cases

1. **Minimum contacts**: Always maintain at least one contact entry
2. **Maximum contacts**: No explicit limit, but UI should handle many entries gracefully
3. **Delete last remaining**: First contact cannot be deleted (no delete button shown)

## Testing Strategy

### Unit Tests

- Verify accordion renders with correct title and subtitle
- Verify all form fields render with correct labels and placeholders
- Verify "Add another contact" button is present
- Verify first contact entry has no delete button
- Verify navigation buttons render correctly

### Property-Based Tests

Using `vitest` with `fast-check` for property-based testing:

1. **Contact list management property**: Test adding/removing contacts maintains correct list length
2. **Required field validation property**: Generate random empty/whitespace values and verify validation fails
3. **Email validation property**: Generate random invalid email strings and verify validation fails
4. **Data persistence property**: Generate random contact data, simulate navigation, verify data preserved

### Integration Tests

- Test form submission with valid data navigates to Step 4
- Test "Go Back" button navigates to Step 2
- Test form state integration with parent AddClientPage

## Implementation Notes

### MUI Components Used

- `Accordion`, `AccordionSummary`, `AccordionDetails` for collapsible section
- `TextField` for text inputs (via FormTextField wrapper)
- `Select`, `MenuItem` for dropdowns (via FormSelectField wrapper)
- `Radio`, `RadioGroup`, `FormControlLabel` for notification preference
- `IconButton` with delete icon for remove contact
- `Button` with add icon for add contact
- `Divider` for separator lines
- `Grid` or `Box` with flexbox for layout

### Styling Approach

- Use MUI `sx` prop for component-level styling
- Reference theme tokens for colors and typography
- Match Figma specifications for spacing, borders, and dimensions
