# Requirements Document

## Introduction

This document defines the requirements for updating the AddClientStepper component to match the new Figma design specifications. The stepper is a navigation component used in the multi-step "Add Client" workflow, displaying progress through 5 steps: Client Details, Contract Details, Contacts & Access, Operational Units, and Confirmation.

## Glossary

- **Stepper**: A navigation component that displays progress through a multi-step workflow
- **Step_Indicator**: The circular visual element showing step number or completion status
- **Step_Status**: The state of a step - Complete, Current (In Progress), or Incomplete
- **Connector_Line**: The horizontal line connecting adjacent steps
- **Status_Label**: Text displayed above each step indicator showing the current status

## Requirements

### Requirement 1: Step Status Display

**User Story:** As a user, I want to see the status of each step in the workflow, so that I understand my progress through the form.

#### Acceptance Criteria

1. WHEN a step is completed, THE Stepper SHALL display a checkmark icon inside a dark grey (#4B4D4F) circular background
2. WHEN a step is the current active step, THE Stepper SHALL display the step number inside a dark blue (#002677) circle with a grey ring effect (box-shadow)
3. WHEN a step is incomplete (future), THE Stepper SHALL display the step number inside a white circle with a grey (#323334) border
4. THE Stepper SHALL display a status label above each step indicator showing "Complete", "In Progress", or "Incomplete"

### Requirement 2: Step Labels

**User Story:** As a user, I want to see clear labels for each step, so that I know what information is required at each stage.

#### Acceptance Criteria

1. THE Stepper SHALL display the step name below each step indicator
2. WHEN a step is the current active step, THE Stepper SHALL display the step label in bold (#002677 brand primary color)
3. WHEN a step is not the current step, THE Stepper SHALL display the step label in regular weight (#323334 neutral color)

### Requirement 3: Visual Styling

**User Story:** As a user, I want the stepper to have consistent visual styling, so that the interface feels professional and cohesive.

#### Acceptance Criteria

1. THE Step_Indicator for completed steps SHALL have dimensions of 20x20 pixels
2. THE Step_Indicator for current steps SHALL have a 24x24 pixel inner circle with a 3px ring effect
3. THE Step_Indicator for incomplete steps SHALL have dimensions of 20x20 pixels with a 1px border
4. THE Stepper SHALL use the Enterprise Sans VF font family for all text
5. THE Status_Label SHALL use 12px font size with 400 weight
6. THE Step_Label SHALL use 14px font size

### Requirement 4: Connector Lines

**User Story:** As a user, I want to see visual connections between steps, so that I understand the sequential nature of the workflow.

#### Acceptance Criteria

1. THE Stepper SHALL display connector lines between adjacent steps
2. THE Connector_Line SHALL fill the available horizontal space between step indicators
3. THE Connector_Line SHALL be vertically centered with the step indicators

### Requirement 5: Step Navigation

**User Story:** As a user, I want to be able to click on completed steps, so that I can navigate back to review or edit previous information.

#### Acceptance Criteria

1. WHEN a user clicks on a completed step, THE Stepper SHALL trigger a navigation callback with the step index
2. WHEN a user hovers over a clickable step, THE Stepper SHALL provide visual feedback indicating interactivity
3. THE Stepper SHALL NOT allow navigation to incomplete (future) steps

### Requirement 6: Responsive Layout

**User Story:** As a user, I want the stepper to display correctly on different screen sizes, so that I can use the application on various devices.

#### Acceptance Criteria

1. THE Stepper SHALL display steps in a horizontal row layout
2. THE Stepper SHALL center-align all step elements vertically
3. THE Stepper SHALL maintain consistent spacing between steps using flexible layout
