# Requirements Document

## Introduction

This document defines the requirements for implementing the Contacts & Access step (Step 3) in the Add Client multi-step form within the CORE application. The Contacts & Access step captures contact information for client onboarding, allowing users to add multiple contacts with their details and notification preferences.

## Glossary

- **Contacts_Access_Step**: The third step in the Add Client wizard that collects contact information
- **Contact_Entry**: A single contact record containing type, name, email, status, and notification preferences
- **Form_System**: The react-hook-form based form management system with Zod validation
- **Contact_List**: A dynamic array of Contact_Entry items that can be added or removed

## Requirements

### Requirement 1: Contacts & Access Accordion Component

**User Story:** As a user, I want to view and complete contact details in an expandable accordion, so that I can manage the form section visibility while entering contact information.

#### Acceptance Criteria

1. THE Contacts_Access_Step SHALL display as an expandable accordion with "Contacts & Access" as the title
2. THE Contacts_Access_Step SHALL display "Complete the fields below." as the subtitle
3. WHEN the accordion is expanded, THE Contacts_Access_Step SHALL display all contact form fields
4. THE Contacts_Access_Step SHALL be expanded by default when the user navigates to Step 3
5. THE Contacts_Access_Step SHALL have a 12px border radius and 1px solid #CBCCCD border


### Requirement 2: Contact Entry Fields

**User Story:** As a user, I want to enter contact information including type, name, email, and status, so that I can establish contacts for the client.

#### Acceptance Criteria

1. THE Form_System SHALL provide a Contact Type dropdown field marked as required with placeholder "Select contact type"
2. THE Form_System SHALL provide a First Name text input field marked as required with placeholder "Enter first name"
3. THE Form_System SHALL provide a Last Name text input field marked as required with placeholder "Enter last name"
4. THE Form_System SHALL provide an Email text input field marked as required with placeholder "Enter email"
5. THE Form_System SHALL provide a Status dropdown field (optional) with placeholder "Select status"
6. THE Form_System SHALL provide a "Send email Notification" radio button with Yes/No options
7. THE Form_System SHALL display contact fields in a three-column grid layout on the first row (Contact Type, First Name, Last Name)
8. THE Form_System SHALL display Email, Status, and Send email Notification on the second row

### Requirement 3: Multiple Contacts Management

**User Story:** As a user, I want to add multiple contacts for a client, so that I can associate all relevant contacts with the client record.

#### Acceptance Criteria

1. THE Contacts_Access_Step SHALL display at least one Contact_Entry by default
2. THE Contacts_Access_Step SHALL provide an "Add another contact" button with a plus icon
3. WHEN the user clicks "Add another contact", THE Form_System SHALL add a new empty Contact_Entry to the Contact_List
4. THE Contacts_Access_Step SHALL display a horizontal separator line between Contact_Entry items
5. WHEN multiple contacts exist, THE Contacts_Access_Step SHALL display a delete button (trash icon) for each contact except the first one
6. WHEN the user clicks the delete button, THE Form_System SHALL remove that Contact_Entry from the Contact_List
7. THE first Contact_Entry SHALL NOT have a delete button


### Requirement 4: Form Validation

**User Story:** As a user, I want to receive validation feedback on required fields, so that I can ensure all necessary contact information is provided before proceeding.

#### Acceptance Criteria

1. WHEN a required field is left empty and the form is submitted, THE Form_System SHALL display "Required field" error message
2. THE Form_System SHALL validate the Contact Type field as required for each Contact_Entry
3. THE Form_System SHALL validate the First Name field as required for each Contact_Entry
4. THE Form_System SHALL validate the Last Name field as required for each Contact_Entry
5. THE Form_System SHALL validate the Email field as required and must be a valid email format for each Contact_Entry
6. WHEN all required fields are valid, THE Form_System SHALL allow navigation to the next step

### Requirement 5: Form Layout

**User Story:** As a user, I want the form fields to be organized in a clear grid layout, so that I can easily scan and complete the form.

#### Acceptance Criteria

1. THE Contacts_Access_Step SHALL display form fields in a three-column grid layout on desktop
2. THE Contacts_Access_Step SHALL use 24px gap between form field rows
3. THE Contacts_Access_Step SHALL use 24px gap between form field columns
4. THE Contacts_Access_Step SHALL use 30px top/bottom padding and 24px left/right padding inside the accordion
5. THE Contacts_Access_Step SHALL use 56px gap between Contact_Entry items


### Requirement 6: Integration with Multi-Step Form

**User Story:** As a user, I want the Contacts & Access step to integrate with the existing Add Client wizard, so that I can navigate between steps and have my data preserved.

#### Acceptance Criteria

1. THE Contacts_Access_Step SHALL be accessible as Step 3 in the Add Client stepper
2. WHEN navigating away from Step 3, THE Form_System SHALL preserve entered contact data
3. WHEN returning to Step 3, THE Form_System SHALL restore previously entered contact data
4. THE Contacts_Access_Step SHALL share form state with the parent Add Client form
5. THE Contacts_Access_Step SHALL display "Next" and "Go Back" navigation buttons in the footer
6. WHEN the user clicks "Next" and validation passes, THE Form_System SHALL navigate to Step 4 (Operational Units)
7. WHEN the user clicks "Go Back", THE Form_System SHALL navigate to Step 2 (Contract Details)

### Requirement 7: Input Field Styling

**User Story:** As a user, I want consistent input field styling that matches the design system, so that the form has a professional appearance.

#### Acceptance Criteria

1. THE Form_System SHALL display text input fields with 1px solid #4B4D4F border
2. THE Form_System SHALL display input fields with 4px border radius
3. THE Form_System SHALL display input fields with 40px height
4. THE Form_System SHALL display field labels in Desktop/Body/L/Bold style (16px, bold)
5. THE Form_System SHALL display placeholder text in Desktop/Body/L/Regular style (16px, regular)
6. THE Form_System SHALL display required field indicators with asterisk (*) after the label
