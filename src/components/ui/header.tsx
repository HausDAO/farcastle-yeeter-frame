'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

function HeaderLogoSvg({
  className,
  onClick,
}: {
  className: string;
  onClick: () => void;
}) {
  return (
    <Image
      src="/castle.svg"
      width={30}
      height={27}
      alt="Castle logo"
      className={className}
      onClick={onClick}
      priority
    />
  );
}

function Header() {
  const router = useRouter();

  const onLogoClick = React.useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="w-full flex flex-row items-center justify-between p-4">
      <div className="opacity-0 h-[30px] w-[30px]" />
      <div className="text-xl font-fraktur pt-[2px] leading-[30px] h-[30px] text-primary">
        Infernal Zoo
      </div>
      <HeaderLogoSvg className="opacity-100" onClick={onLogoClick} />
    </div>
  );
}

export { Header };
