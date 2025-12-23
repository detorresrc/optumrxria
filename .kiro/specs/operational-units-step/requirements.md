# Requirements Document

## Introduction

This document defines the requirements for implementing the Operational Units step (Step 4) in the Add Client multi-step form within the CORE application. The Operational Units step captures operational unit configuration including business attributes, address information, and optional billing attribute overrides for client onboarding.

## Glossary

- **Operational_Units_Step**: The fourth step in the Add Client wizard that collects operational unit configuration
- **Operational_Unit_Entry**: A single operational unit record containing business attributes, addresses, and billing overrides
- **Address_Entry**: A billing address record within an operational unit containing type, street, city, state, and zip
- **Billing_Attributes_Override**: An optional nested section allowing override of contract-level billing settings
- **Form_System**: The react-hook-form based form management system with Zod validation
- **OU_List**: A dynamic array of Operational_Unit_Entry items that can be added or removed

## Requirements

### Requirement 1: Operational Units Accordion Component

**User Story:** As a user, I want to view and complete operational unit details in an expandable accordion, so that I can manage the form section visibility while entering operational unit information.

#### Acceptance Criteria

1. THE Operational_Units_Step SHALL display as an expandable accordion with "Operational Units" as the title
2. THE Operational_Units_Step SHALL display "Complete the fields below." as the subtitle
3. WHEN the accordion is expanded, THE Operational_Units_Step SHALL display all operational unit form fields
4. WHEN the user navigates to Step 4, THE Operational_Units_Step SHALL be expanded by default
5. THE Operational_Units_Step SHALL have a 12px border radius and 1px solid #CBCCCD border
6. THE Operational_Units_Step SHALL use 30px top/bottom padding and 24px left/right padding inside the accordion

### Requirement 2: Operational Unit Basic Fields

**User Story:** As a user, I want to enter operational unit identification and business attributes, so that I can configure the operational unit for the client.

#### Acceptance Criteria

1. THE Form_System SHALL provide an Operational Unit Name text input field marked as required with placeholder "Enter name"
2. THE Form_System SHALL provide an Operational Unit ID text input field marked as required with placeholder "Enter name"
3. THE Form_System SHALL provide a Market Segment dropdown field (optional) with placeholder "Select market segment"
4. THE Form_System SHALL provide a Line of Business dropdown field marked as required with placeholder "Select line of business"
5. THE Form_System SHALL provide an M&R Plan Type dropdown field (optional) with placeholder "Select M&R plan type"
6. THE Form_System SHALL provide an M&R Group/Individual dropdown field (optional) with placeholder "Select M&R grouping"
7. THE Form_System SHALL provide an M&R Classification dropdown field (optional) with placeholder "Select M&R classification"
8. THE Form_System SHALL provide a Pass through/Traditional pricing dropdown field (optional) with placeholder "Select"
9. THE Form_System SHALL provide a Run-off Period text input field marked as required with placeholder "Enter Period"
10. THE Form_System SHALL provide an Assign Contacts dropdown field (optional) with placeholder "Select contacts"

### Requirement 3: Operational Unit Address Section

**User Story:** As a user, I want to add billing addresses for each operational unit, so that I can specify where invoices should be sent.

#### Acceptance Criteria

1. THE Operational_Units_Step SHALL display a horizontal separator line between the basic fields and address section
2. THE Form_System SHALL provide an Address Type dropdown field marked as required with placeholder "Select Address type"
3. THE Form_System SHALL provide an Address 1 text input field marked as required with placeholder "Enter Address 1"
4. THE Form_System SHALL provide an Address 2 text input field marked as required with placeholder "Enter Address 2"
5. THE Form_System SHALL provide a City text input field marked as required with placeholder "Enter city"
6. THE Form_System SHALL provide a State text input field marked as required with placeholder "Enter state"
7. THE Form_System SHALL provide a Zip text input field marked as required with placeholder "Enter zip"
8. THE Operational_Units_Step SHALL provide an "Add another billing address" button with a plus icon
9. WHEN the user clicks "Add another billing address", THE Form_System SHALL add a new empty Address_Entry
10. WHEN multiple addresses exist, THE Operational_Units_Step SHALL display a delete button (trash icon) for each address except the first one
11. WHEN the user clicks the delete button on an address, THE Form_System SHALL remove that Address_Entry

### Requirement 4: Billing Attributes Override Section

**User Story:** As a user, I want to optionally override billing attributes at the operational unit level, so that I can customize billing settings for specific operational units.

#### Acceptance Criteria

1. THE Operational_Units_Step SHALL display a nested "Billing Attributes" section within each operational unit
2. THE Billing_Attributes_Override section SHALL display "Billing Attributes" as the title
3. THE Billing_Attributes_Override section SHALL display "You may override the billing attributes outlined under the contract details section here." as the subtitle
4. THE Billing_Attributes_Override section SHALL be collapsible with an expand/collapse chevron icon
5. THE Billing_Attributes_Override section SHALL have a 12px border radius and 1px solid #CBCCCD border

### Requirement 5: Multiple Operational Units Management

**User Story:** As a user, I want to add multiple operational units for a client, so that I can configure all required operational units during onboarding.

#### Acceptance Criteria

1. THE Operational_Units_Step SHALL display at least one Operational_Unit_Entry by default
2. THE Operational_Units_Step SHALL provide an "Add another operational unit" button with a plus icon at the bottom
3. WHEN the user clicks "Add another operational unit", THE Form_System SHALL add a new empty Operational_Unit_Entry to the OU_List
4. WHILE multiple operational units exist, THE Operational_Units_Step SHALL display collapsed cards for non-active units
5. WHILE an operational unit card is collapsed, THE Operational_Units_Step SHALL display "Operational Units - [Operational Unit Name]" as the title
6. WHILE an operational unit card is collapsed, THE Operational_Units_Step SHALL display "Complete the fields below" as the subtitle
7. WHILE multiple operational units exist, THE Operational_Units_Step SHALL display a delete button (trash icon) on each collapsed card
8. WHEN the user clicks the delete button on a collapsed card, THE Form_System SHALL remove that Operational_Unit_Entry from the OU_List
9. WHEN the user clicks on a collapsed card, THE Operational_Units_Step SHALL expand that card and collapse others
10. THE Operational_Units_Step SHALL use 56px gap between Operational_Unit_Entry items

### Requirement 6: Form Validation

**User Story:** As a user, I want to receive validation feedback on required fields, so that I can ensure all necessary operational unit information is provided before proceeding.

#### Acceptance Criteria

1. WHEN a required field is left empty and the form is submitted, THE Form_System SHALL display "Required field" error message
2. THE Form_System SHALL validate the Operational Unit Name field as required for each Operational_Unit_Entry
3. THE Form_System SHALL validate the Operational Unit ID field as required for each Operational_Unit_Entry
4. THE Form_System SHALL validate the Line of Business field as required for each Operational_Unit_Entry
5. THE Form_System SHALL validate the Run-off Period field as required for each Operational_Unit_Entry
6. THE Form_System SHALL validate all required address fields (Address Type, Address 1, Address 2, City, State, Zip) for each Address_Entry
7. WHEN all required fields are valid, THE Form_System SHALL allow navigation to the next step

### Requirement 7: Form Layout

**User Story:** As a user, I want the form fields to be organized in a clear grid layout, so that I can easily scan and complete the form.

#### Acceptance Criteria

1. THE Operational_Units_Step SHALL display form fields in a three-column grid layout on desktop
2. THE Operational_Units_Step SHALL use 24px gap between form field rows
3. THE Operational_Units_Step SHALL use 24px gap between form field columns
4. THE Operational_Units_Step SHALL display Operational Unit Name, Operational Unit ID, and Market Segment on the first row
5. THE Operational_Units_Step SHALL display Line of Business, M&R Plan Type, and M&R Group/Individual on the second row
6. THE Operational_Units_Step SHALL display M&R Classification, Pass through/Traditional pricing, and Run-off Period on the third row
7. THE Operational_Units_Step SHALL display Assign Contacts on the fourth row
8. THE address fields SHALL display Address Type, Address 1, and Address 2 on the first row
9. THE address fields SHALL display City, State, and Zip on the second row

### Requirement 8: Integration with Multi-Step Form

**User Story:** As a user, I want the Operational Units step to integrate with the existing Add Client wizard, so that I can navigate between steps and have my data preserved.

#### Acceptance Criteria

1. THE Operational_Units_Step SHALL be accessible as Step 4 in the Add Client stepper
2. WHEN navigating away from Step 4, THE Form_System SHALL preserve entered operational unit data
3. WHEN returning to Step 4, THE Form_System SHALL restore previously entered operational unit data
4. THE Operational_Units_Step SHALL share form state with the parent Add Client form
5. THE Operational_Units_Step SHALL display "Next" and "Go Back" navigation buttons in the footer
6. WHEN the user clicks "Next" and validation passes, THE Form_System SHALL navigate to Step 5 (Confirmation)
7. WHEN the user clicks "Go Back", THE Form_System SHALL navigate to Step 3 (Contacts & Access)

### Requirement 9: Input Field Styling

**User Story:** As a user, I want consistent input field styling that matches the design system, so that the form has a professional appearance.

#### Acceptance Criteria

1. THE Form_System SHALL display text input fields with 1px solid #4B4D4F border
2. THE Form_System SHALL display input fields with 4px border radius
3. THE Form_System SHALL display input fields with 40px height
4. THE Form_System SHALL display field labels in Desktop/Body/L/Bold style (16px, bold)
5. THE Form_System SHALL display placeholder text in Desktop/Body/L/Regular style (16px, regular)
6. THE Form_System SHALL display required field indicators with asterisk (*) after the label
7. THE Form_System SHALL display dropdown fields with a chevron icon on the right side
