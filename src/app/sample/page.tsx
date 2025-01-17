'use client';

import React from 'react';

import { SampleForm } from '@/components/forms/SampleForm';
import { BaalContractBase } from '@/lib/tx-prepper/tx-prepper';

export default function CharacterCreatorPage() {
  return (
    <div className="w-full h-full space-y-4 pt-16 grow">
      <SampleForm
        formConfig={{
          id: 'sample',
          tx: {
            id: 'sample',
            method: 'submitProposal',
            contract: {
              ...BaalContractBase,
              type: 'static',
              targetAddress: '0x...',
            },
            args: [],
          },
        }}
        confirmed={false}
        loading={false}
        invalidConnection={false}
        handleSubmit={async () => {}}
      />
    </div>
  );
}
