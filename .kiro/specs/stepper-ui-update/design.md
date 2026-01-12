# Design Document: Stepper UI Update

## Overview

This design document describes the implementation approach for updating the AddClientStepper component to match the new Figma design specifications. The component will be refactored to align with the visual styling, dimensions, and behavior defined in the design system.

## Architecture

The stepper component follows a simple presentational architecture:

```
AddClientStepper (Container)
├── StepItem (repeated for each step)
│   ├── StatusLabel
│   ├── StepIndicator
│   │   ├── CompletedIndicator (checkmark)
│   │   ├── CurrentIndicator (numbered with ring)
│   │   └── IncompleteIndicator (numbered with border)
│   └── StepLabel
└── ConnectorLine (between steps)
```

## Components and Interfaces

### Props Interface

```typescript
export type StepStatus = 'completed' | 'current' | 'incomplete';

export interface StepConfig {
  label: string;
  status: StepStatus;
}

export interface AddClientStepperProps {
  currentStep: number;
  steps?: StepConfig[];
  onStepClick?: (stepIndex: number) => void;
}
```

### StepIndicator Component

Internal component responsible for rendering the circular step indicator based on status:

```typescript
interface StepIndicatorProps {
  stepNumber: number;
  status: StepStatus;
}
```

**Rendering Logic:**
- `completed`: Dark grey circle (#4B4D4F) with white checkmark icon
- `current`: Blue circle (#002677) with white number, surrounded by grey ring effect
- `incomplete`: White circle with grey border (#323334) and grey number

## Data Models

### Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `brandPrimary100` | #002677 | Current step indicator, current step label |
| `neutral90` | #323334 | Step labels, incomplete indicator border |
| `neutral80` | #4B4D4F | Completed indicator background, status labels |
| `neutral0` | #FFFFFF | Indicator backgrounds, text on dark backgrounds |

### Dimensions

| Element | Completed | Current | Incomplete |
|---------|-----------|---------|------------|
| Indicator size | 20x20px | 24x24px inner | 20x20px |
| Border width | none | 3px ring | 1px |
| Font size (number) | n/a | 12px bold | 12px medium |

### Typography

| Element | Font Size | Weight | Line Height |
|---------|-----------|--------|-------------|
| Status label | 12px | 400 | 1.2em |
| Step label (normal) | 14px | 400 | 1.4em |
| Step label (current) | 14px | 700 | 1.4em |
| Step number | 12px | 500-700 | 1.3em |



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Status Label Mapping

*For any* step status value ('completed', 'current', 'incomplete'), the getStatusLabel function SHALL return the corresponding display text ('Complete', 'In Progress', 'Incomplete').

**Validates: Requirements 1.4**

### Property 2: Step Indicator Styling by Status

*For any* step with a given status, the StepIndicator component SHALL render with the correct visual elements:
- completed: checkmark icon with dark grey background
- current: step number with blue background and ring effect
- incomplete: step number with white background and grey border

**Validates: Requirements 1.1, 1.2, 1.3**

### Property 3: Step Label Styling by Status

*For any* step, the label styling SHALL match the expected values based on status:
- current: bold weight (700), brand primary color (#002677)
- non-current: regular weight (400), neutral color (#323334)

**Validates: Requirements 2.2, 2.3**

### Property 4: Connector Line Count

*For any* stepper with N steps (where N > 1), the component SHALL render exactly N-1 connector lines between adjacent steps.

**Validates: Requirements 4.1**

### Property 5: Navigation Callback Behavior

*For any* step click event:
- IF the step status is 'completed' AND onStepClick is provided, THEN the callback SHALL be invoked with the step index
- IF the step status is 'incomplete' OR 'current', THEN no navigation SHALL occur

**Validates: Requirements 5.1, 5.3**

## Error Handling

### Invalid Props

| Scenario | Handling |
|----------|----------|
| `currentStep` out of bounds | Clamp to valid range (0 to steps.length - 1) |
| Empty `steps` array | Render nothing or use default steps |
| Missing `onStepClick` | Disable click interactions |

### Edge Cases

- Single step: No connector lines rendered
- All steps completed: All show checkmarks
- First step current: No completed steps to navigate to

## Testing Strategy

### Unit Tests

Unit tests will verify specific examples and edge cases:

1. **Rendering tests**: Verify component renders without errors
2. **Status label tests**: Verify correct label text for each status
3. **Indicator styling tests**: Verify correct visual elements per status
4. **Click handler tests**: Verify callback invocation for completed steps
5. **Edge case tests**: Single step, all completed, first step current

### Property-Based Tests

Property-based tests will use **fast-check** library to verify universal properties:

1. **Status label mapping property**: Generate random status values, verify correct label returned
2. **Connector line count property**: Generate random step counts, verify N-1 connectors
3. **Navigation callback property**: Generate random step configurations, verify callback behavior

### Test Configuration

- Minimum 100 iterations per property test
- Use React Testing Library for component testing
- Use fast-check for property-based testing
- Tag format: **Feature: stepper-ui-update, Property {number}: {property_text}**
