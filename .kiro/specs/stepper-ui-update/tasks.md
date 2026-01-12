# Implementation Plan: Stepper UI Update

## Overview

This implementation plan updates the AddClientStepper component to match the new Figma design specifications. The work is organized into incremental tasks that build on each other, with testing integrated throughout.

## Tasks

- [x] 1. Update StepIndicator component styling
  - [x] 1.1 Update completed step indicator
    - Change dimensions to 20x20px
    - Update background color to #4B4D4F
    - Ensure checkmark icon is properly sized and centered
    - _Requirements: 1.1, 3.1_

  - [x] 1.2 Update current step indicator
    - Implement 24x24px inner circle with #002677 background
    - Add 3px ring effect using box-shadow
    - Update number styling to 12px bold white text
    - _Requirements: 1.2, 3.2_

  - [x] 1.3 Update incomplete step indicator
    - Change dimensions to 20x20px
    - Update border to 1px solid #323334
    - Update number styling to 12px medium #323334 text
    - _Requirements: 1.3, 3.3_

  - [ ]* 1.4 Write property test for step indicator styling
    - **Property 2: Step Indicator Styling by Status**
    - **Validates: Requirements 1.1, 1.2, 1.3**

- [x] 2. Update status labels and step labels
  - [x] 2.1 Update status label styling
    - Ensure 12px font size with 400 weight
    - Update color to #4B4D4F for all statuses
    - Verify "Complete", "In Progress", "Incomplete" text mapping
    - _Requirements: 1.4, 3.5_

  - [x] 2.2 Update step label styling
    - Set 14px font size for all labels
    - Apply bold (700) weight and #002677 color for current step
    - Apply regular (400) weight and #323334 color for non-current steps
    - _Requirements: 2.1, 2.2, 2.3, 3.6_

  - [ ]* 2.3 Write property test for status label mapping
    - **Property 1: Status Label Mapping**
    - **Validates: Requirements 1.4**

  - [ ]* 2.4 Write property test for step label styling
    - **Property 3: Step Label Styling by Status**
    - **Validates: Requirements 2.2, 2.3**

- [x] 3. Update connector lines and layout
  - [x] 3.1 Update connector line styling
    - Ensure lines fill available space between steps
    - Verify vertical centering with step indicators
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 3.2 Update overall layout
    - Ensure horizontal row layout
    - Verify center alignment of step elements
    - Maintain flexible spacing between steps
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]* 3.3 Write property test for connector line count
    - **Property 4: Connector Line Count**
    - **Validates: Requirements 4.1**

- [x] 4. Update navigation behavior
  - [x] 4.1 Implement click handling for completed steps
    - Ensure onStepClick callback is triggered with correct index
    - Add hover visual feedback for clickable steps
    - _Requirements: 5.1, 5.2_

  - [x] 4.2 Prevent navigation to incomplete steps
    - Disable click interactions for incomplete and current steps
    - _Requirements: 5.3_

  - [ ]* 4.3 Write property test for navigation callback behavior
    - **Property 5: Navigation Callback Behavior**
    - **Validates: Requirements 5.1, 5.3**

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Final integration and cleanup
  - [x] 6.1 Verify component integration
    - Test component in AddClientPage context
    - Verify all step transitions work correctly
    - _Requirements: All_

  - [ ]* 6.2 Write unit tests for edge cases
    - Test single step scenario
    - Test all steps completed scenario
    - Test first step as current scenario
    - _Requirements: All_

- [ ] 7. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
