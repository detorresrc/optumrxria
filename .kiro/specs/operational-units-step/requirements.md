# Requirements Document

## Introduction

This document defines the requirements for implementing the Operational Units step (Step 4) in the Add Client multi-step form within the CORE application. The Operational Units step captures operational unit configuration including business attributes, address information, billing attribute overrides, payment methods, and suppression settings for client onboarding.

## Glossary

- **Operational_Units_Step**: The fourth step in the Add Client wizard that collects operational unit configuration
- **Operational_Unit_Entry**: A single operational unit record containing business attributes, addresses, billing overrides, payment info, and suppressions
- **Address_Entry**: A billing address record within an operational unit containing type, street, city, state, and zip
- **Billing_Attributes_Override**: A nested section allowing override of contract-level billing settings including invoice frequencies, payment terms, and delivery options
- **Payment_Method_Section**: A section for configuring payment method and bank account details (ACH/EFT)
- **Suppression_Entry**: A suppression record containing type, start date, and end date
- **Assign_Contacts_Chips**: Multi-select contact assignment displayed as removable chips
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
2. THE Form_System SHALL provide an Operational Unit ID text input field marked as required with placeholder "Enter name" and displayed as disabled/read-only style (opacity 0.5)
3. THE Form_System SHALL provide a LOB Numeric text input field marked as required with placeholder "Enter name"
4. THE Form_System SHALL provide a Market Segment dropdown field (optional) with placeholder "Select market segment"
5. THE Form_System SHALL provide a Line of Business dropdown field marked as required with placeholder "Select line of business"
6. THE Form_System SHALL provide an M&R Plan Type dropdown field (optional) with placeholder "Select M&R plan type"
7. THE Form_System SHALL provide an M&R Group/Individual dropdown field (optional) with placeholder "Select M&R grouping"
8. THE Form_System SHALL provide an M&R Classification dropdown field (optional) with placeholder "Select M&R classification"
9. THE Form_System SHALL provide a Pass through/Traditional pricing dropdown field (optional) with placeholder "Select"
10. THE Form_System SHALL provide an Assign Contacts dropdown field (optional) with placeholder "Select contacts"
11. WHEN contacts are assigned, THE Assign_Contacts_Chips SHALL display selected contacts as removable chips with X icon
12. THE Assign_Contacts_Chips SHALL be displayed in a light blue background card (#FAFCFF) with 12px border radius
13. WHEN the user clicks the X icon on a contact chip, THE Form_System SHALL remove that contact from the selection

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
6. THE Form_System SHALL provide a Claim Invoice Frequency dropdown field with placeholder "Select invoice frequency"
7. THE Form_System SHALL provide a Fee Invoice Frequency dropdown field with placeholder "Select invoice frequency"
8. THE Form_System SHALL provide an Invoice Aggregation Level dropdown field with placeholder "Select Aggregation level"
9. THE Form_System SHALL provide an Invoice Type dropdown field with placeholder "Select invoice type"
10. THE Form_System SHALL provide an Invoicing Claim Quantity Counts dropdown field with placeholder "Select quantity count"
11. THE Form_System SHALL provide a Delivery Option dropdown field with placeholder "Select delivery option"
12. THE Form_System SHALL provide a Support Document Version dropdown field with placeholder "Select document version"
13. THE Form_System SHALL provide an Invoice Static Data text input field with placeholder "Enter invoice static data"
14. THE Form_System SHALL provide a Fee Invoice Payment Term dropdown field with placeholder "Select No. of days"
15. THE Form_System SHALL provide a Fee Invoice Payment Term Day Type dropdown field with placeholder "Select day type"
16. THE Form_System SHALL provide a Claim Invoice Payment Term dropdown field with placeholder "Select No. of days"
17. THE Form_System SHALL provide a Claim Invoice Payment Term Day Type dropdown field with placeholder "Select day type"

### Requirement 5: Payment Method Section

**User Story:** As a user, I want to configure payment method and bank account details for each operational unit, so that payments can be processed correctly.

#### Acceptance Criteria

1. THE Billing_Attributes_Override section SHALL include a Payment Method dropdown field with placeholder "Select payment method"
2. WHEN Payment Method is selected, THE Form_System SHALL display a horizontal divider line
3. WHEN Payment Method is ACH/EFT, THE Form_System SHALL display Bank Account Type dropdown with placeholder "Select bank account type"
4. WHEN Payment Method is ACH/EFT, THE Form_System SHALL display Routing Number text input with placeholder "Enter routing number"
5. WHEN Payment Method is ACH/EFT, THE Form_System SHALL display Account Number text input with placeholder "Enter account number"
6. THE bank account fields SHALL be displayed in a 3-column grid layout

### Requirement 6: Suppressions Section

**User Story:** As a user, I want to add suppressions for each operational unit, so that I can configure billing suppression periods.

#### Acceptance Criteria

1. THE Operational_Units_Step SHALL display an "Add Suppressions" section with a Yes/No radio button
2. WHEN "Yes" is selected for Add Suppressions, THE Form_System SHALL display suppression entry fields
3. THE Form_System SHALL provide a Select Suppression Type dropdown field with placeholder "Select suppression type"
4. THE Form_System SHALL provide a Suppression Start Date date picker field with placeholder "MM-DD-YYYY"
5. THE Form_System SHALL provide a Suppression End Date date picker field with placeholder "MM-DD-YYYY"
6. THE Suppression_Entry fields SHALL be displayed in a 3-column grid layout
7. THE Operational_Units_Step SHALL provide an "Add another suppression" button with a plus icon
8. WHEN the user clicks "Add another suppression", THE Form_System SHALL add a new empty Suppression_Entry
9. WHEN multiple suppressions exist, THE Operational_Units_Step SHALL display a delete button (trash icon) for each suppression except the first one
10. WHEN the user clicks the delete button on a suppression, THE Form_System SHALL remove that Suppression_Entry
11. THE suppression entries SHALL be separated by a horizontal divider line (#AAAAAA)

### Requirement 7: Multiple Operational Units Management

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
10. THE Operational_Units_Step SHALL use 16px gap between Operational_Unit_Entry items

### Requirement 8: Form Validation

**User Story:** As a user, I want to receive validation feedback on required fields, so that I can ensure all necessary operational unit information is provided before proceeding.

#### Acceptance Criteria

1. WHEN a required field is left empty and the form is submitted, THE Form_System SHALL display "Required field" error message
2. THE Form_System SHALL validate the Operational Unit Name field as required for each Operational_Unit_Entry
3. THE Form_System SHALL validate the Operational Unit ID field as required for each Operational_Unit_Entry
4. THE Form_System SHALL validate the LOB Numeric field as required for each Operational_Unit_Entry
5. THE Form_System SHALL validate the Line of Business field as required for each Operational_Unit_Entry
6. THE Form_System SHALL validate all required address fields (Address Type, Address 1, Address 2, City, State, Zip) for each Address_Entry
7. WHEN all required fields are valid, THE Form_System SHALL allow navigation to the next step

### Requirement 9: Form Layout

**User Story:** As a user, I want the form fields to be organized in a clear grid layout, so that I can easily scan and complete the form.

#### Acceptance Criteria

1. THE Operational_Units_Step SHALL display form fields in a three-column grid layout on desktop
2. THE Operational_Units_Step SHALL use 24px gap between form field rows
3. THE Operational_Units_Step SHALL use 24px gap between form field columns
4. THE Operational_Units_Step SHALL display Operational Unit Name, Operational Unit ID (disabled), and LOB Numeric on the first row
5. THE Operational_Units_Step SHALL display Market Segment, Line of Business, and M&R Plan Type on the second row
6. THE Operational_Units_Step SHALL display M&R Group/Individual, M&R Classification, and Pass through/Traditional pricing on the third row
7. THE Assign Contacts section SHALL be displayed in a light blue card with the dropdown and selected chips
8. THE address fields SHALL display Address Type, Address 1, and Address 2 on the first row
9. THE address fields SHALL display City, State, and Zip on the second row

### Requirement 10: Integration with Multi-Step Form

**User Story:** As a user, I want the Operational Units step to integrate with the existing Add Client wizard, so that I can navigate between steps and have my data preserved.

#### Acceptance Criteria

1. THE Operational_Units_Step SHALL be accessible as Step 4 in the Add Client stepper
2. WHEN navigating away from Step 4, THE Form_System SHALL preserve entered operational unit data
3. WHEN returning to Step 4, THE Form_System SHALL restore previously entered operational unit data
4. THE Operational_Units_Step SHALL share form state with the parent Add Client form
5. THE Operational_Units_Step SHALL display "Next" and "Go Back" navigation buttons in the footer
6. WHEN the user clicks "Next" and validation passes, THE Form_System SHALL navigate to Step 5 (Confirmation)
7. WHEN the user clicks "Go Back", THE Form_System SHALL navigate to Step 3 (Contacts & Access)

### Requirement 11: Input Field Styling

**User Story:** As a user, I want consistent input field styling that matches the design system, so that the form has a professional appearance.

#### Acceptance Criteria

1. THE Form_System SHALL display text input fields with 1px solid #4B4D4F border
2. THE Form_System SHALL display input fields with 4px border radius
3. THE Form_System SHALL display input fields with 40px height
4. THE Form_System SHALL display field labels in Desktop/Body/L/Bold style (16px, bold)
5. THE Form_System SHALL display placeholder text in Desktop/Body/L/Regular style (16px, regular)
6. THE Form_System SHALL display required field indicators with asterisk (*) after the label
7. THE Form_System SHALL display dropdown fields with a chevron icon on the right side
8. THE Form_System SHALL display date picker fields with a calendar button on the right side with dark blue (#002677) background


### Requirement 12: Confirmation Step Integration

**User Story:** As a user, I want to see a summary of all operational unit data in the Confirmation step, so that I can review the information before submitting.

#### Acceptance Criteria

1. THE Confirmation_Step SHALL display all Operational_Unit_Entry data in a review accordion section
2. THE Confirmation_Step SHALL display the Operational Unit Name, Operational Unit ID, and LOB Numeric for each unit
3. THE Confirmation_Step SHALL display Market Segment, Line of Business, M&R Plan Type, M&R Group/Individual, M&R Classification, and Pass through/Traditional pricing
4. THE Confirmation_Step SHALL display assigned contacts as a comma-separated list
5. THE Confirmation_Step SHALL display all billing address information (Address Type, Address 1, Address 2, City, State, Zip) for each address
6. THE Confirmation_Step SHALL display Billing Attributes Override values when configured
7. THE Confirmation_Step SHALL display Payment Method and bank account details when configured
8. THE Confirmation_Step SHALL display all Suppression entries with Type, Start Date, and End Date when configured
9. WHEN multiple operational units exist, THE Confirmation_Step SHALL display each unit in a separate collapsible section
10. THE Confirmation_Step SHALL allow the user to navigate back to the Operational Units step to make edits
