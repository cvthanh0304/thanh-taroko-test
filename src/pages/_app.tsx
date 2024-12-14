import { MODAL_ROOT_ID } from '@/components/common/ConfirmModal';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />

      <div id={MODAL_ROOT_ID}></div>
    </>
  );
}
