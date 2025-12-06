import React from 'react';

export default function Layout({ children, currentPageName }: { children: React.ReactNode, currentPageName?: string }) {
  // Admin page has its own layout
  if (currentPageName === 'Admin') {
    return <>{children}</>;
  }

  return (
    <>
      <style>{`
        :root {
          --background: 15 23 42;
          --foreground: 248 250 252;
        }
        
        body {
          background-color: rgb(15 23 42);
          color: rgb(248 250 252);
        }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: rgb(100 116 139) transparent;
        }
        
        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        *::-webkit-scrollbar-track {
          background: transparent;
        }
        
        *::-webkit-scrollbar-thumb {
          background-color: rgb(100 116 139);
          border-radius: 3px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background-color: rgb(148 163 184);
        }
      `}</style>
      {children}
    </>
  );
}