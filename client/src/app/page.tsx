"use client";

import { Plus, Edit2, Trash2, Play, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useAutomations, useCreateAutomation, useDeleteAutomation, useTestAutomation } from "@/hooks/useAutomation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function AutomationsPage() {
  const { data: automations, isLoading } = useAutomations();
  const { mutate: createAutomation, isPending: isCreating } = useCreateAutomation();
  const { mutate: deleteAutomation, isPending: isDeleting } = useDeleteAutomation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAutomationName, setNewAutomationName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showTestPrompt, setShowTestPrompt] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const { mutate: runTest, isPending: isTesting } = useTestAutomation(showTestPrompt || "");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAutomationName.trim()) {
      createAutomation(
        {
          name: newAutomationName.trim(),
          nodes: [
            { id: "start", type: "start", position: { x: 250, y: 50 }, data: {} },
            { id: "end", type: "end", position: { x: 250, y: 450 }, data: {} },
          ],
          edges: [{ id: "e-start-end", source: "start", target: "end" }],
        },
        {
          onSuccess: () => {
            setIsCreateDialogOpen(false);
            setNewAutomationName("");
          },
        },
      );
    }
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteAutomation(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  const handleTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (showTestPrompt && testEmail) {
      runTest(testEmail, {
        onSuccess: () => {
          setShowTestPrompt(null);
          setTestEmail("");
        },
      });
    }
  };

  return (
    <div className='min-h-screen bg-gray-50/50 p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex justify-between items-center mb-10'>
          <div>
            <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight'>Automations</h1>
            <p className='text-muted-foreground mt-1'>Build and manage your high-performance messaging workflows.</p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            disabled={isCreating}
            size='lg'
            className='rounded-xl font-bold shadow-lg hover:shadow-blue-500/25 transition-all'
          >
            {isCreating ? <Loader2 className='w-4 h-4 mr-2 animate-spin' /> : <Plus className='w-4 h-4 mr-2' />}
            Create Automation
          </Button>
        </div>

        {isLoading ? (
          <div className='flex flex-col items-center justify-center h-64 gap-4'>
            <Loader2 className='w-12 h-12 text-blue-500 animate-spin' />
            <p className='text-gray-400 font-medium animate-pulse'>Loading your automations...</p>
          </div>
        ) : (
          <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
            <Table>
              <TableHeader className='bg-slate-50/50'>
                <TableRow>
                  <TableHead className='py-4 px-8 font-bold text-gray-400 uppercase tracking-widest text-[10px]'>Name</TableHead>
                  <TableHead className='py-4 px-8 font-bold text-gray-400 uppercase tracking-widest text-[10px]'>Nodes</TableHead>
                  <TableHead className='py-4 px-8 font-bold text-gray-400 uppercase tracking-widest text-[10px]'>Created At</TableHead>
                  <TableHead className='py-4 px-8 font-bold text-gray-400 uppercase tracking-widest text-[10px] text-right'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {automations?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className='py-20 text-center'>
                      <div className='flex flex-col items-center gap-3'>
                        <div className='w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center opacity-50'>
                          <Mail className='w-8 h-8 text-slate-300' />
                        </div>
                        <p className='text-slate-400 font-medium'>No automations found. Start by creating one!</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  automations?.map((auto) => (
                    <TableRow key={auto._id} className='group hover:bg-slate-50/50 transition-colors'>
                      <TableCell className='py-5 px-8'>
                        <span className='font-bold text-slate-800 group-hover:text-blue-600 transition-colors'>{auto.name}</span>
                      </TableCell>
                      <TableCell className='py-5 px-8'>
                        <div className='flex items-center gap-2'>
                          <div className='w-1.5 h-1.5 rounded-full bg-blue-500' />
                          <span className='text-xs font-semibold text-slate-600'>{auto.nodes.length} Steps</span>
                        </div>
                      </TableCell>
                      <TableCell className='py-5 px-8'>
                        <span className='text-sm text-slate-400'>{new Date(auto.createdAt).toLocaleDateString()}</span>
                      </TableCell>
                      <TableCell className='py-5 px-8 text-right'>
                        <div className='flex justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-green-600 hover:bg-green-50 rounded-lg hover:text-green-700 h-9 w-9 p-0'
                            onClick={() => setShowTestPrompt(auto._id)}
                          >
                            <Play className='w-4 h-4' />
                          </Button>
                          <Link href={`/editor/${auto._id}`}>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-blue-600 hover:bg-blue-50 rounded-lg hover:text-blue-700 h-9 w-9 p-0'
                            >
                              <Edit2 className='w-4 h-4' />
                            </Button>
                          </Link>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-red-500 hover:bg-red-50 rounded-lg hover:text-red-600 h-9 w-9 p-0'
                            onClick={() => setDeleteId(auto._id)}
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Create Automation Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Create New Automation</DialogTitle>
              <DialogDescription>Define a name for your messaging workflow. You can design the flow in the next step.</DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-6'>
              <div className='space-y-2'>
                <Label htmlFor='name' className='text-right'>
                  Flow Name
                </Label>
                <Input
                  id='name'
                  placeholder='e.g. Welcome Series'
                  className='col-span-3 h-12'
                  value={newAutomationName}
                  onChange={(e) => setNewAutomationName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button type='submit' className='w-full h-12 font-bold' disabled={isCreating || !newAutomationName.trim()}>
                {isCreating && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                Create & Design Flow
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the automation and all its associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              className='bg-red-600 hover:bg-red-700'
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Delete Automation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Test Runner Dialog */}
      <Dialog open={!!showTestPrompt} onOpenChange={(open) => !open && setShowTestPrompt(null)}>
        <DialogContent className='sm:max-w-md'>
          <form onSubmit={handleTest} className='space-y-6'>
            <DialogHeader>
              <DialogTitle>Test Automation</DialogTitle>
              <DialogDescription>Enter an email address to receive automation messages during this test run.</DialogDescription>
            </DialogHeader>
            <div className='space-y-2 py-2'>
              <Label htmlFor='test-email' className='font-bold ml-1'>
                Test Email Address
              </Label>
              <Input
                id='test-email'
                type='email'
                required
                placeholder='name@example.com'
                className='h-12'
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                autoFocus
              />
            </div>
            <DialogFooter className='sm:justify-between gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setShowTestPrompt(null)}
                className='flex-1 h-12 font-bold'
                disabled={isTesting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isTesting || !testEmail} className='flex-1 h-12 font-bold'>
                {isTesting && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                {isTesting ? "Starting..." : "Start Test"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
