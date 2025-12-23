import React from 'react';
import { Box, Stack } from '@mui/material';
import { InfoBanner } from './InfoBanner';
import { ReviewAccordion } from './ReviewAccordion';
import { ClientDetailsReview } from './ClientDetailsReview';
import { ContractDetailsReview } from './ContractDetailsReview';
import { ContactsReview } from './ContactsReview';
import { OperationalUnitReview } from './OperationalUnitReview';
import type { AddClientCombinedFormData } from '../schemas/addClientSchema';

interface ConfirmationStepProps {
  formData: AddClientCombinedFormData;
  onEditStep: (stepIndex: number) => void;
  onConfirm: () => void;
  onSaveDraft: () => void;
  onGoBack: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  formData,
  onEditStep,
}) => {
  return (
    <Box>
      {/* Info Banner - Requirements 2.1, 2.2 */}
      <InfoBanner
        title="Review and Confirm Details"
        message="You cannot edit information on this screen. To make changes, click the edit icon next to the section you want to update."
      />

      {/* Accordion Sections */}
      <Stack spacing={3} sx={{ mt: 3 }}>
        {/* Client Details Accordion - Requirements 3.1, 3.2, 3.3, 3.5, 3.6 */}
        <ReviewAccordion
          title="Client Details"
          subtitle="Please review all fields you have filled out and make sure they are correct before clicking on confirm."
          defaultExpanded
          onEdit={() => onEditStep(0)}
        >
          <ClientDetailsReview formData={formData} />
        </ReviewAccordion>

        {/* Contract Details Accordion - Requirements 4.1, 4.2, 4.3, 4.5, 4.6 */}
        <ReviewAccordion
          title="Contract Details"
          subtitle="Please review all fields you have filled out and make sure they are correct before clicking on confirm."
          defaultExpanded
          onEdit={() => onEditStep(1)}
        >
          <ContractDetailsReview formData={formData} />
        </ReviewAccordion>

        {/* Contacts & Access Accordion - Requirements 5.1, 5.2, 5.3, 5.5, 5.6 */}
        <ReviewAccordion
          title="Contacts & Access"
          subtitle="Complete the fields below."
          defaultExpanded
          onEdit={() => onEditStep(2)}
        >
          <ContactsReview formData={formData} />
        </ReviewAccordion>

        {/* Operational Units Accordions - Requirements 6.1, 6.2, 6.3, 6.5, 6.6 */}
        {formData.operationalUnits && formData.operationalUnits.map((unit, index) => (
          <ReviewAccordion
            key={index}
            title={`Operational Units - ${unit.name || 'Unnamed Unit'}`}
            subtitle="Please review all fields you have filled out and make sure they are correct before clicking on confirm."
            defaultExpanded
            onEdit={() => onEditStep(3)}
          >
            <OperationalUnitReview operationalUnit={unit} />
          </ReviewAccordion>
        ))}
      </Stack>
    </Box>
  );
};

export default ConfirmationStep;
