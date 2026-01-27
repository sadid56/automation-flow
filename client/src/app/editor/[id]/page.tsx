"use client";

import React, { use } from "react";
import { useAutomation, useUpdateAutomation } from "@/hooks/useAutomation";
import { FlowEditor } from "@/components/flow/flow-editor";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Automation } from "@/types/automation.types";

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: automation, isLoading } = useAutomation(id);
  const { mutate: updateAutomation } = useUpdateAutomation(id);

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center bg-gray-50 flex-col gap-4'>
        <Loader2 className='w-12 h-12 text-blue-500 animate-spin' />
        <p className='text-gray-400 font-medium tracking-wide'>Initializing Editor...</p>
      </div>
    );
  }

  if (!automation) return <div className='p-8 text-center text-red-500 font-bold'>Automation not found!</div>;

  const handleSave = (data: Automation) => {
    updateAutomation(data);
  };

  return (
    <div className='h-screen flex flex-col bg-white'>
      <header className='h-16 border-b flex items-center justify-between px-6 bg-white z-20'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='icon' onClick={() => router.push("/")} className='rounded-full'>
            <ArrowLeft className='w-5 h-5' />
          </Button>
          <div>
            <h1 className='text-lg font-semibold text-gray-900'>{automation.name}</h1>
            <p className='text-[10px] text-muted-foreground font-bold uppercase tracking-widest'>Flow Designer</p>
          </div>
        </div>
      </header>

      <main className='flex-1 relative'>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <FlowEditor key={automation._id} initialData={automation} onSave={handleSave as any} />
      </main>
    </div>
  );
}
