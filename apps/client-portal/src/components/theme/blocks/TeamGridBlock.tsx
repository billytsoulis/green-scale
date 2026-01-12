import React from "react";

/**
 * GreenScale Theme: Team Grid Block
 * Path: apps/client-portal/src/components/theme/blocks/TeamGridBlock.tsx
 * Purpose: Atomic component for displaying staff members and specialists.
 * Identification: data-component="TeamGridBlock"
 */

// --- Production Ready Imports (Commented for Manual Handling) ---
import { Card } from "@repo/ui";
import Image from "next/image";

// --- Local UI Mocks for Preview Stability ---
// const Card = ({ children, className = "" }: any) => (
//   <div className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-sm ${className}`}>
//     {children}
//   </div>
// );

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
}

interface TeamGridBlockProps {
  data: {
    title?: string;
    members?: TeamMember[];
  };
}

export const TeamGridBlock = ({ data }: TeamGridBlockProps) => {
  // Graceful fallbacks for the Team Grid structure
  const {
    title = "The Specialists",
    members = []
  } = data || {};

  return (
    <section 
      className="py-24 bg-slate-50" 
      data-component="TeamGridBlock"
    >
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-16">
          {title}
        </h2>
        
        <div className={`grid grid-cols-1 md:grid-cols-2 ${members.length > 2 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-8 max-w-6xl mx-auto`}>
          {members.map((member, idx) => (
            /* @ts-ignore */
            <Card key={member.id || idx} className="p-10 bg-white text-center group hover:shadow-2xl transition-all">
              <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden border-2 border-slate-50 group-hover:border-emerald-200 transition-all relative">
                {member.imageUrl ? (
                  /* @ts-ignore */
                  <Image 
                    src={member.imageUrl} 
                    alt={member.name} 
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-2xl font-serif text-slate-300 italic">
                    {member.name ? member.name[0] : "?"}
                  </span>
                )}
              </div>
              
              <h4 className="text-xl font-bold text-slate-900">{member.name}</h4>
              
              <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest mt-1 mb-4">
                {member.role}
              </p>
              
              <div 
                className="text-slate-500 text-sm leading-relaxed line-clamp-4" 
                dangerouslySetInnerHTML={{ __html: member.bio }} 
              />
            </Card>
          ))}
          
          {members.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-400">
              No team members registered for this block.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeamGridBlock;