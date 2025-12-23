# Implementation Plan: Contacts & Access Step

## Overview

This plan implements the Contacts & Access step (Step 3) in the Add Client wizard. The implementation follows the existing patterns in the CORE application, using React with TypeScript, MUI components, react-hook-form with Zod validation.

## Tasks

- [ ] 1. Extend schema and form types for contacts
  - [ ] 1.1 Add contact schema to addClientSchema.ts
    - Add `contactSchema` with contactType, firstName, lastName, email, status, sendEmailNotification fields
    - Add `contactsAccessSchema` with contacts array
    - Export `Contact` and `ContactsAccessFormData` types
    - Add default contact values
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 1.2 Write property test for contact schema validation
    - **Property 4: Required field validation**
    - **Property 5: Email format validation**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

- [ ] 2. Create ContactsAccessStep component
  - [ ] 2.1 Create ContactsAccessStep.tsx component file
    - Implement accordion with "Contacts & Access" title and subtitle
    - Use useFieldArray for dynamic contacts management
    - Implement three-column grid layout for fields
    - Add "Add another contact" button with plus icon
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.1, 3.2, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 2.2 Implement contact entry fields
    - Add Contact Type dropdown (required)
    - Add First Name text input (required)
    - Add Last Name text input (required)
    - Add Email text input (required)
    - Add Status dropdown (optional)
    - Add Send email Notification radio group
    - Apply correct styling per Figma specs
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ] 2.3 Implement multiple contacts functionality
    - Add separator line between contact entries
    - Add delete button for contacts (except first)
    - Implement add contact handler
    - Implement remove contact handler
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 2.4 Write property tests for contact list management
    - **Property 1: Adding a contact increases list length**
    - **Property 2: Delete button visibility follows contact position**
    - **Property 3: Removing a contact decreases list length**
    - **Validates: Requirements 3.3, 3.5, 3.6, 3.7**

- [ ] 3. Integrate with Add Client wizard
  - [ ] 3.1 Update AddClientStepper to include Step 3
    - Add "Contacts & Access" as Step 3 in stepper
    - Update step navigation logic
    - _Requirements: 6.1_

  - [ ] 3.2 Wire ContactsAccessStep into AddClientPage
    - Import and render ContactsAccessStep for step 3
    - Ensure form context is shared
    - Add contacts field to main form schema
    - _Requirements: 6.4_

  - [ ] 3.3 Implement step navigation
    - Add "Next" button to navigate to Step 4
    - Add "Go Back" button to navigate to Step 2
    - Validate form before allowing Next navigation
    - _Requirements: 6.5, 6.6, 6.7_

  - [ ]* 3.4 Write property test for form validation and navigation
    - **Property 6: Valid form allows navigation**
    - **Validates: Requirements 4.6**

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Data persistence and final integration
  - [ ] 5.1 Ensure contact data persists across step navigation
    - Verify data preserved when navigating away from Step 3
    - Verify data restored when returning to Step 3
    - _Requirements: 6.2, 6.3_

  - [ ]* 5.2 Write property test for data persistence
    - **Property 7: Contact data persistence round trip**
    - **Validates: Requirements 6.2, 6.3**

- [ ] 6. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Use existing FormTextField, FormSelectField, FormRadioGroup components where available
