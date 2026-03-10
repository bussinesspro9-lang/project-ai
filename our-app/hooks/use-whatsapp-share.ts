'use client';

import { useCallback } from 'react';

interface ShareContent {
  text: string;
  url?: string;
}

export function useWhatsAppShare() {
  const share = useCallback(({ text, url }: ShareContent) => {
    const fullText = url ? `${text}\n\n${url}` : text;
    const encoded = encodeURIComponent(fullText);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }, []);

  const shareToContact = useCallback(
    ({ text, url }: ShareContent, phone: string) => {
      const fullText = url ? `${text}\n\n${url}` : text;
      const encoded = encodeURIComponent(fullText);
      const cleanPhone = phone.replace(/\D/g, '');
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    },
    [],
  );

  return { share, shareToContact };
}
