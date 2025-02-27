import Head from 'next/head';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  maxWidth?: string;
}

export default function Layout({ 
  children, 
  title, 
  description = 'Chef Role Survey Application',
  maxWidth = 'max-w-4xl'
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <main className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${maxWidth} mx-auto`}>
        {children}
      </main>
    </>
  );
}