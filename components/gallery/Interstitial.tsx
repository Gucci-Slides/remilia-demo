'use client';

interface InterstitialProps {
  text?: string;
  type?: 'spacer' | 'text' | 'rule';
}

export function Interstitial({ text, type = 'spacer' }: InterstitialProps) {
  if (type === 'spacer') {
    return <div className="h-[30vh]" />;
  }

  if (type === 'rule') {
    return (
      <div className="h-[20vh] flex items-center justify-center px-[20vw]">
        <div className="w-12 h-px bg-neutral-200" />
      </div>
    );
  }

  if (type === 'text' && text) {
    return (
      <div className="h-[40vh] flex items-center justify-center px-[20vw]">
        <p className="font-light text-[11px] tracking-[0.15em] text-neutral-400 uppercase text-center max-w-xs">
          {text}
        </p>
      </div>
    );
  }

  return <div className="h-[20vh]" />;
}
