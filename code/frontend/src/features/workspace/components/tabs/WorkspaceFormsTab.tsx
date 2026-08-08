'use client';

import React from 'react';
import { FileSpreadsheet, Plus, ArrowRight, CheckCircle, FormInput } from 'lucide-react';

export function WorkspaceFormsTab() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-text-primary space-y-6 max-w-3xl mx-auto">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight font-heading text-text-primary sm:text-2xl">
          The simple way to collect and track work requests
        </h2>
        <p className="mt-2 text-xs text-text-secondary sm:text-sm">
          Use forms to seamlessly create work from stakeholder requests.
        </p>
      </div>

      {/* Hero Visual Card / Illustration Container */}
      <div className="my-6 relative flex items-center justify-center gap-6 p-8 rounded-2xl border border-surface-border bg-surface-alt/40 shadow-xs w-full max-w-xl">
        {/* Left Form Box */}
        <div className="w-48 rounded-xl border border-surface-border bg-surface p-4 shadow-md text-left space-y-3">
          <div className="text-[11px] font-bold text-text-primary">Submit a form</div>
          <div className="h-2 w-full rounded-xs bg-surface-alt" />
          <div className="h-2 w-3/4 rounded-xs bg-surface-alt" />
          <div className="h-2 w-5/6 rounded-xs bg-surface-alt" />
          <div className="mt-2 flex justify-end">
            <div className="h-4 w-12 rounded-sm bg-primary/30" />
          </div>
        </div>

        <ArrowRight className="h-6 w-6 text-primary shrink-0" />

        {/* Right Track Requests Box */}
        <div className="w-48 rounded-xl border border-surface-border bg-surface p-4 shadow-md text-left space-y-2">
          <div className="text-[11px] font-bold text-text-primary">Track requests</div>
          <div className="grid grid-cols-3 gap-1 text-[9px] font-bold text-text-muted border-b pb-1">
            <span>Summary</span>
            <span>Status</span>
            <span>Due</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[9px] items-center">
            <span className="truncate">Logo design</span>
            <span className="rounded-xs bg-blue-100 text-blue-700 text-[8px] px-1 font-bold">TODO</span>
            <span className="text-text-muted">Today</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[9px] items-center">
            <span className="truncate">Fix bug #4</span>
            <span className="rounded-xs bg-emerald-100 text-emerald-700 text-[8px] px-1 font-bold">DONE</span>
            <span className="text-text-muted">Tomorrow</span>
          </div>
        </div>
      </div>

      {/* Feature Bullet Points */}
      <div className="grid gap-6 sm:grid-cols-2 text-left w-full max-w-lg">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-text-primary">Capture key details</h4>
            <p className="text-[11px] text-text-muted">Gather exact parameters and requirements directly from users.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-text-primary">Prioritize work</h4>
            <p className="text-[11px] text-text-muted">Work requests convert directly into backlog tasks on your board.</p>
          </div>
        </div>
      </div>

      {/* Create Form Action Button */}
      <button
        onClick={() => alert('Form builder dialog will open!')}
        className="flex items-center space-x-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-hover active:scale-95 transition"
      >
        <Plus className="h-4 w-4" />
        <span>Create form</span>
      </button>
    </div>
  );
}
