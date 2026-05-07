import React from 'react';
import { cn } from "@/lib/utils";

interface MacCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const MacCard = ({ children, className, ...props }: MacCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 shadow-2xl overflow-hidden",
        "bg-[#222222] transition-all duration-300",
        className
      )}
      style={{
        // RGB(34, 34, 34) is #222222
        backgroundColor: 'rgb(34, 34, 34)',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)'
      }}
      {...props}
    >
      {children}
    </div>
  );
};
