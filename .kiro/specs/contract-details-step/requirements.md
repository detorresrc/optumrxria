# Requirements Document

## Introduction

This document defines the requirements for implementing the Contract Details step (Step 2) in the Add Client multi-step form within the CORE application. The Contract Details step captures contract information, billing attributes, payment configuration, and suppression settings for client onboarding.

## Glossary

- **Contract_Details_Step**: The second step in the Add Client wizard that collects contract and billing information
- **Billing_Attributes_Section**: A nested collapsible section within Contract Details for invoice and payment configuration
- **Autopay_Information_Section**: A conditional section displayed when ACH payment method is selected
- **Suppressions_Section**: A dynamic section for adding multiple suppression configurations
- **Form_System**: The react-hook-form based form management system with Zod validation
- **Date_Picker**: A date input component with calendar button for selecting dates in MM-DD-YYYY format

## Requirements

### Requirement 1: Contract Details Accordion Component

**User Story:** As a user, I want to view and complete contract details in an expandable accordion, so that I can manage the form section visibility while entering contract information.

#### Acceptance Criteria

1. THE Contract_Details_Step SHALL display as an expandable accordion with "Contract Details" as the title
2. THE Contract_Details_Step SHALL display "Complete the fields below." as the subtitle
3. WHEN the accordion is expanded, THE Contract_Details_Step SHALL display all contract detail form fields
4. THE Contract_Details_Step SHALL be expanded by default when the user navigates to Step 2
5. THE Contract_Details_Step SHALL have a 12px border radius and 1px solid #CBCCCD border

### Requirement 2: Contract Information Fields

**User Story:** As a user, I want to enter contract identification and date information, so that I can establish the contract terms for the client.

#### Acceptance Criteria

1. THE Form_System SHALL provide a Client Contract ID text input field with placeholder "Enter contract ID"
2. THE Form_System SHALL provide an Effective Date date picker field marked as required
3. THE Form_System SHALL provide a Termination Date date picker field (optional)
4. THE Form_System SHALL provide a Contract Term text input field with placeholder "Enter contract term"
5. THE Form_System SHALL provide a Client Membership text input field with placeholder "Enter client membership"
6. THE Form_System SHALL provide a Client DOA Signor text input field with placeholder "Enter client DOA signor"
7. THE Form_System SHALL provide a Contracting Legal Entity for OptumRx text input field with placeholder "Enter contracting legal entity"
8. THE Form_System SHALL provide a Contracting Legal Entity for Client text input field with placeholder "Enter contracting legal entity"
9. THE Form_System SHALL provide an Assigned to dropdown field with placeholder "Select Assigned to"
10. THE Form_System SHALL provide a Run-Off Effective Date date picker field
11. THE Form_System SHALL provide a Source dropdown field marked as required with placeholder "Select source"
12. WHEN a date picker field is focused, THE Date_Picker SHALL display a calendar icon button for date selection
13. THE Form_System SHALL display date fields in MM-DD-YYYY format

### Requirement 3: Billing Attributes Section

**User Story:** As a user, I want to configure billing and invoice settings, so that I can establish how the client will be billed.

#### Acceptance Criteria

1. THE Billing_Attributes_Section SHALL display as a nested bordered section with "Billing Attributes" as the title
2. THE Billing_Attributes_Section SHALL display "You may override the billing attributes outlined under the contract details section here." as the subtitle
3. THE Form_System SHALL provide an Invoice Breakout dropdown field marked as required with placeholder "Select invoice breakout"
4. THE Form_System SHALL provide a Claim Invoice Frequency dropdown field marked as required with placeholder "Select invoice frequency"
5. THE Form_System SHALL provide a Fee Invoice Frequency dropdown field marked as required with placeholder "Select invoice frequency"
6. THE Form_System SHALL provide an Invoice Aggregation level dropdown field marked as required with placeholder "Select Aggregation level"
7. THE Form_System SHALL provide an Invoice Type dropdown field marked as required with placeholder "Select invoice type"
8. THE Form_System SHALL provide an Invoicing Claim Quantity Counts dropdown field with placeholder "Select quantity count"
9. THE Form_System SHALL provide a Delivery Option dropdown field marked as required with placeholder "Select delivery option"
10. THE Form_System SHALL provide a Support Document Version dropdown field marked as required with placeholder "Select document version"
11. THE Form_System SHALL provide an Invoice Static Data text input field with placeholder "Enter invoice static data"
12. THE Form_System SHALL provide a Fee Invoice Payment Term dropdown field with placeholder "Select No. of days"
13. THE Form_System SHALL provide a Fee Invoice Payment Term Day Type dropdown field with placeholder "Select day type"
14. THE Form_System SHALL provide a Claim Invoice Payment Term dropdown field with placeholder "Select No. of days"
15. THE Form_System SHALL provide a Claim Invoice Payment Term Day Type dropdown field with placeholder "Select day type"
16. THE Form_System SHALL provide a Payment Method dropdown field with placeholder "Select payment method"

### Requirement 4: Autopay Information Section

**User Story:** As a user, I want to enter ACH payment details when autopay is selected, so that automatic payments can be configured for the client.

#### Acceptance Criteria

1. WHEN the Payment Method is set to ACH, THE Autopay_Information_Section SHALL be displayed below the Payment Method field
2. WHEN the Payment Method is not ACH, THE Autopay_Information_Section SHALL be hidden
3. THE Form_System SHALL provide a Bank Account Type dropdown field marked as required with placeholder "Select bank account type"
4. THE Form_System SHALL provide a Routing Number text input field marked as required with placeholder "Enter routing number"
5. THE Form_System SHALL provide an Account Number text input field marked as required with placeholder "Enter account number"
6. THE Form_System SHALL provide an Account Holder Name text input field marked as required with placeholder "Enter account holder name"
7. THE Autopay_Information_Section SHALL display fields in a three-column layout (Bank Account Type, Routing Number, Account Number) with Account Holder Name in a second row

### Requirement 5: Add Suppressions Section

**User Story:** As a user, I want to configure invoice suppressions, so that I can control which items are suppressed on invoices.

#### Acceptance Criteria

1. THE Suppressions_Section SHALL display "Add Suppressions" as the label with Yes/No radio buttons
2. WHEN "Yes" is selected for Add Suppressions, THE Form_System SHALL display suppression configuration fields
3. WHEN "No" is selected for Add Suppressions, THE Form_System SHALL hide suppression configuration fields
4. THE Form_System SHALL provide a Select Suppression Type dropdown field with placeholder "Select suppression type"
5. THE Form_System SHALL provide a Suppression Start Date date picker field
6. THE Form_System SHALL provide a Suppression End Date date picker field
7. THE Form_System SHALL allow adding multiple suppression rows by clicking "Add another suppression" button
8. THE Form_System SHALL display a delete icon button for each suppression row (except the first)
9. WHEN the delete button is clicked, THE Form_System SHALL remove that suppression row
10. THE "Add another suppression" button SHALL display with a plus icon and blue text (#0C55B8)
11. EACH suppression row SHALL be separated by a horizontal divider line

### Requirement 6: Form Validation

**User Story:** As a user, I want to receive validation feedback on required fields, so that I can ensure all necessary information is provided before proceeding.

#### Acceptance Criteria

1. WHEN a required field is left empty and the form is submitted, THE Form_System SHALL display "Required field" error message
2. THE Form_System SHALL validate the Effective Date field as required
3. THE Form_System SHALL validate the Source field as required
4. THE Form_System SHALL validate all required Billing Attributes fields (Invoice Breakout, Claim Invoice Frequency, Fee Invoice Frequency, Invoice Aggregation level, Invoice Type, Delivery Option, Support Document Version)
5. WHEN Payment Method is ACH, THE Form_System SHALL validate all Autopay Information fields as required
6. WHEN all required fields are valid, THE Form_System SHALL allow navigation to the next step

### Requirement 7: Form Layout

**User Story:** As a user, I want the form fields to be organized in a clear grid layout, so that I can easily scan and complete the form.

#### Acceptance Criteria

1. THE Contract_Details_Step SHALL display form fields in a three-column grid layout on desktop
2. THE Contract_Details_Step SHALL use 24px gap between form field rows
3. THE Contract_Details_Step SHALL use 24px gap between form field columns
4. THE Contract_Details_Step SHALL use 30px top padding and 24px horizontal padding inside the accordion
5. THE Billing_Attributes_Section SHALL have 24px padding and 12px border radius with 1px solid #CBCCCD border

### Requirement 8: Integration with Multi-Step Form

**User Story:** As a user, I want the Contract Details step to integrate with the existing Add Client wizard, so that I can navigate between steps and have my data preserved.

#### Acceptance Criteria

1. THE Contract_Details_Step SHALL be accessible as Step 2 in the Add Client stepper
2. WHEN navigating away from Step 2, THE Form_System SHALL preserve entered data
3. WHEN returning to Step 2, THE Form_System SHALL restore previously entered data
4. THE Contract_Details_Step SHALL share form state with the parent Add Client form

### Requirement 9: Navigation Buttons

**User Story:** As a user, I want to navigate between steps using Next and Go Back buttons, so that I can move through the form wizard.

#### Acceptance Criteria

1. THE Contract_Details_Step SHALL display a "Next" primary button aligned to the right in the footer area
2. THE Contract_Details_Step SHALL display a "Go Back" tertiary button to the left of the Next button
3. THE "Next" button SHALL have a dark blue background (#002677) with white text and 46px border radius
4. THE "Go Back" button SHALL have a white background with dark gray border (#323334) and 46px border radius
5. WHEN the "Next" button is clicked, THE Form_System SHALL validate all required fields before proceeding to Step 3
6. WHEN the "Go Back" button is clicked, THE Form_System SHALL navigate to Step 1 (Client Details) while preserving form data
7. THE navigation buttons SHALL be displayed in a footer bar with top border (#CBCCCD) and 4px vertical padding, 84px horizontal padding
8. THE button group SHALL have 10px gap between buttons
