'use client';

import React from 'react';

import { MySampleForm } from '@/components/forms/MySampleForm';
import { BaalContractBase } from '@/lib/tx-prepper/tx-prepper';

export default function SamplePage() {
  return (
    <div className="w-full h-full space-y-4 pt-1 grow">
      <MySampleForm
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
