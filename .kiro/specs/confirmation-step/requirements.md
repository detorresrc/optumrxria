# Requirements Document

## Introduction

The Confirmation Step is the fifth and final step in the Add Client multi-step form workflow. It provides users with a comprehensive review of all information entered across the previous four steps (Client Details, Contract Details, Contacts & Access, and Operational Units) before final submission. Users can review data in collapsible accordion sections and navigate back to edit specific sections via edit icons.

## Glossary

- **Confirmation_Step**: The fifth step component in the Add Client wizard that displays a read-only summary of all form data for user review before submission
- **Review_Accordion**: A collapsible panel component that displays a section's data in read-only format with an edit icon for navigation
- **Info_Banner**: A notification component that informs users about the read-only nature of the confirmation screen
- **Edit_Icon**: A clickable icon that navigates users back to the corresponding step for editing
- **Form_Data**: The complete set of data collected across all four previous steps of the Add Client form

## Requirements

### Requirement 1: Display Confirmation Step in Stepper

**User Story:** As a user, I want to see the Confirmation step as the fifth step in the stepper, so that I know I am at the final review stage before submission.

#### Acceptance Criteria

1. WHEN the user navigates to step 5, THE Stepper SHALL display "Confirmation" as the current step with "In Progress" status
2. WHEN the user is on the Confirmation step, THE Stepper SHALL show steps 1-4 as "Complete" with checkmark indicators
3. THE Stepper SHALL display step 5 with a numbered circle (5) and blue highlight indicating current step

### Requirement 2: Display Info Banner

**User Story:** As a user, I want to see an informational banner explaining the confirmation screen, so that I understand I cannot edit directly on this page.

#### Acceptance Criteria

1. WHEN the Confirmation step loads, THE Info_Banner SHALL display with title "Review and Confirm Details"
2. THE Info_Banner SHALL display the message "You cannot edit information on this screen. To make changes, click the edit icon next to the section you want to update."
3. THE Info_Banner SHALL use info styling with light blue background (#E5F8FB) and dark blue border (#002677)
4. THE Info_Banner SHALL have 12px border radius matching the design system

### Requirement 3: Display Client Details Accordion

**User Story:** As a user, I want to review my Client Details information in a collapsible section, so that I can verify the data before submission.

#### Acceptance Criteria

1. THE Confirmation_Step SHALL display a "Client Details" Review_Accordion section
2. THE Review_Accordion SHALL display the section title "Client Details" with an Edit_Icon
3. THE Review_Accordion SHALL display subtitle "Please review all fields you have filled out and make sure they are correct before clicking on confirm."
4. WHEN expanded, THE Review_Accordion SHALL display all Client Details Form_Data in read-only format including: Client Reference ID, Client ID, Client Name, Client Status, Source, and all addresses
5. WHEN the Edit_Icon is clicked, THE Confirmation_Step SHALL navigate the user to step 1 (Client Details)
6. THE Review_Accordion SHALL be expandable/collapsible via chevron icon click

### Requirement 4: Display Contract Details Accordion

**User Story:** As a user, I want to review my Contract Details information in a collapsible section, so that I can verify the data before submission.

#### Acceptance Criteria

1. THE Confirmation_Step SHALL display a "Contract Details" Review_Accordion section
2. THE Review_Accordion SHALL display the section title "Contract Details" with an Edit_Icon
3. THE Review_Accordion SHALL display subtitle "Please review all fields you have filled out and make sure they are correct before clicking on confirm."
4. WHEN expanded, THE Review_Accordion SHALL display all Contract Details Form_Data in read-only format
5. WHEN the Edit_Icon is clicked, THE Confirmation_Step SHALL navigate the user to step 2 (Contract Details)
6. THE Review_Accordion SHALL be expandable/collapsible via chevron icon click

### Requirement 5: Display Contacts & Access Accordion

**User Story:** As a user, I want to review my Contacts & Access information in a collapsible section, so that I can verify the data before submission.

#### Acceptance Criteria

1. THE Confirmation_Step SHALL display a "Contacts & Access" Review_Accordion section
2. THE Review_Accordion SHALL display the section title "Contacts & Access" with an Edit_Icon
3. THE Review_Accordion SHALL display subtitle "Complete the fields below." (matching design)
4. WHEN expanded, THE Review_Accordion SHALL display all Contacts Form_Data in read-only format
5. WHEN the Edit_Icon is clicked, THE Confirmation_Step SHALL navigate the user to step 3 (Contacts & Access)
6. THE Review_Accordion SHALL be expandable/collapsible via chevron icon click

### Requirement 6: Display Operational Units Accordions

**User Story:** As a user, I want to review each Operational Unit in separate collapsible sections, so that I can verify all operational unit data before submission.

#### Acceptance Criteria

1. THE Confirmation_Step SHALL display one Review_Accordion for each Operational Unit in the Form_Data
2. EACH Review_Accordion SHALL display header "Operational Units - [Operational Unit Name]" with an Edit_Icon
3. THE Review_Accordion SHALL display subtitle "Please review all fields you have filled out and make sure they are correct before clicking on confirm."
4. WHEN expanded, THE Review_Accordion SHALL display all Operational Unit Form_Data in read-only format
5. WHEN the Edit_Icon is clicked, THE Confirmation_Step SHALL navigate the user to step 4 (Operational Units)
6. EACH Review_Accordion SHALL be expandable/collapsible via chevron icon click

### Requirement 7: Action Buttons

**User Story:** As a user, I want to have clear action buttons to confirm, save as draft, or go back, so that I can complete or modify my submission.

#### Acceptance Criteria

1. THE Confirmation_Step SHALL display a "Confirm" primary button
2. THE Confirmation_Step SHALL display a "Save as Draft" secondary button
3. THE Confirmation_Step SHALL display a "Go Back" tertiary button
4. WHEN the "Confirm" button is clicked, THE Confirmation_Step SHALL submit the complete Form_Data
5. WHEN the "Save as Draft" button is clicked, THE Confirmation_Step SHALL save the Form_Data as a draft
6. WHEN the "Go Back" button is clicked, THE Confirmation_Step SHALL navigate the user to step 4 (Operational Units)

### Requirement 8: Accordion Styling

**User Story:** As a user, I want the review sections to have consistent styling, so that the interface is visually cohesive and easy to scan.

#### Acceptance Criteria

1. EACH Review_Accordion SHALL have white background with 1px #CBCCCD border
2. EACH Review_Accordion SHALL have 12px border radius
3. EACH Review_Accordion SHALL have 30px vertical padding and 24px horizontal padding
4. THE section title SHALL use Desktop/Heading/XXS typography (20px, bold, #000000)
5. THE section subtitle SHALL use Desktop/Body/L/Regular typography (16px, #4B4D4F)
6. THE Edit_Icon SHALL be 24x24px and positioned next to the section title
7. THE chevron icon SHALL indicate expand/collapse state

### Requirement 9: Read-Only Data Display

**User Story:** As a user, I want to see my entered data in a clear read-only format, so that I can easily review without confusion.

#### Acceptance Criteria

1. THE Confirmation_Step SHALL display all form fields in read-only format (not editable inputs)
2. THE field labels SHALL use Desktop/Body/L/Bold typography (16px, bold)
3. THE field values SHALL use Desktop/Body/L/Regular typography (16px, #4B4D4F)
4. WHEN a field has no value, THE Confirmation_Step SHALL display an appropriate placeholder or empty state
5. THE data layout SHALL match the original form step layouts for consistency
