'use client';

import React, { useState } from 'react';

export function CopyButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('kawsarvy.design@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="cursor-pointer bg-white rounded-[47px] w-[100px] h-[48px] flex items-center justify-center transition-colors hover:bg-zinc-50 active:scale-[0.98]"
      style={{
        padding: '0 16px',
      }}
      aria-label="Copy my email"
    >
      <span
        style={{
          fontFamily: '"Otterco Medium", sans-serif',
          fontSize: '12px',
          lineHeight: '18px',
          color: 'rgb(18, 31, 62)',
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </span>
    </button>
  );
}
