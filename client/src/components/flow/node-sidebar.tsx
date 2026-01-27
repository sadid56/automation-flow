"use client";

import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function NodeSidebar({ node, onUpdate, onDelete }: any) {
  const { type, data } = node;

  return (
    <div className='w-80 h-full bg-white border-l shadow-xl p-6 overflow-y-auto'>
      <div className='flex items-center justify-between mb-6 pb-4 border-b'>
        <h2 className='text-lg font-bold text-gray-900 uppercase tracking-tight'>{type} Node</h2>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => onDelete()}
          className='text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full h-8 w-8'
        >
          <Trash2 className='w-4 h-4' />
        </Button>
      </div>

      <div className='space-y-6'>
        {type === "action" && (
          <div className='space-y-4'>
            <Label className='text-sm font-semibold'>Email Message</Label>
            <Textarea
              className='min-h-[200px] bg-slate-50 border-slate-200'
              placeholder='Enter the email content here...'
              value={data.message || ""}
              onChange={(e) => onUpdate({ message: e.target.value })}
            />
          </div>
        )}

        {type === "delay" && <DelayEditor data={data} onUpdate={onUpdate} />}

        {type === "condition" && <ConditionEditor data={data} onUpdate={onUpdate} />}

        {["start", "end"].includes(type) && (
          <p className='text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg'>
            This is a fixed {type} node. It marks the {type} of your automation flow and cannot be configured.
          </p>
        )}
      </div>
    </div>
  );
}

function DelayEditor({ data, onUpdate }: any) {
  return (
    <div className='space-y-6'>
      <div className='space-y-3'>
        <Label className='text-sm font-semibold'>Delay Type</Label>
        <div className='flex gap-2 p-1 bg-slate-100 rounded-lg'>
          <Button
            variant={data.delayType === "relative" ? "default" : "ghost"}
            size='sm'
            className={`flex-1 text-xs transition-all ${data.delayType === "relative" ? "bg-orange-600" : "text-gray-600 hover:bg-white"}`}
            onClick={() => onUpdate({ delayType: "relative" })}
          >
            Relative
          </Button>
          <Button
            variant={data.delayType === "specific" ? "default" : "ghost"}
            size='sm'
            className={`flex-1 text-xs transition-all ${data.delayType === "specific" ? "bg-orange-600" : "text-gray-600 hover:bg-white"}`}
            onClick={() => onUpdate({ delayType: "specific" })}
          >
            Specific Date
          </Button>
        </div>
      </div>

      {data.delayType === "relative" ? (
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label className='text-sm font-medium text-gray-600'>Wait For</Label>
            <div className='flex gap-2'>
              <Input type='number' className='w-24' value={data.value || ""} onChange={(e) => onUpdate({ value: e.target.value })} />
              <Select value={data.unit || "minutes"} onValueChange={(val) => onUpdate({ unit: val })}>
                <SelectTrigger className='flex-1'>
                  <SelectValue placeholder='Unit' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='minutes'>Minutes</SelectItem>
                  <SelectItem value='hours'>Hours</SelectItem>
                  <SelectItem value='days'>Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ) : (
        <div className='space-y-2'>
          <Label className='text-sm font-medium text-gray-600'>Until Date & Time</Label>
          <Input type='datetime-local' value={data.date || ""} onChange={(e) => onUpdate({ date: e.target.value })} />
        </div>
      )}
    </div>
  );
}

function ConditionEditor({ data, onUpdate }: any) {
  const rules = data.rules || [];

  const addRule = (joinType: string) => {
    const newRule = {
      field: "Email",
      operator: "equals",
      value: "",
      joinType: rules.length > 0 ? joinType : null,
    };
    onUpdate({ rules: [...rules, newRule] });
  };

  const removeRule = (index: number) => {
    onUpdate({ rules: rules.filter((_: any, i: number) => i !== index) });
  };

  const updateRule = (index: number, updates: any) => {
    onUpdate({
      rules: rules.map((r: any, i: number) => (i === index ? { ...r, ...updates } : r)),
    });
  };

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <Label className='text-sm font-semibold'>Filter Rules (on Email)</Label>

        {rules.length === 0 && (
          <p className='text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300'>
            No rules yet. Use buttons below to add logic.
          </p>
        )}

        {rules.map((rule: any, index: number) => (
          <div key={index} className='p-4 border rounded-xl bg-gray-50 space-y-3 relative group'>
            {rule.joinType && (
              <div className='absolute -top-3 left-4 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm'>
                {rule.joinType}
              </div>
            )}

            <button
              onClick={() => removeRule(index)}
              className='absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity'
            >
              <Trash2 className='w-4 h-4' />
            </button>

            <div className='grid grid-cols-1 gap-3 pt-1'>
              <Select value={rule.operator} onValueChange={(val) => updateRule(index, { operator: val })}>
                <SelectTrigger className='w-full text-xs'>
                  <SelectValue placeholder='Operator' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='equals'>Equals</SelectItem>
                  <SelectItem value='not equals'>Not Equals</SelectItem>
                  <SelectItem value='includes'>Includes</SelectItem>
                  <SelectItem value='starts with'>Starts With</SelectItem>
                  <SelectItem value='ends with'>Ends With</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type='text'
                placeholder='Value...'
                className='text-xs h-8'
                value={rule.value}
                onChange={(e) => updateRule(index, { value: e.target.value })}
              />
            </div>
          </div>
        ))}

        <div className='grid grid-cols-2 gap-2 pt-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => addRule("AND")}
            className='text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700 font-bold text-[10px]'
          >
            <Plus className='w-3 h-3 mr-1' /> AND
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => addRule("OR")}
            className='text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700 font-bold text-[10px]'
          >
            <Plus className='w-3 h-3 mr-1' /> OR
          </Button>
        </div>
      </div>
    </div>
  );
}
