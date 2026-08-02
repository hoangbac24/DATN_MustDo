'use client';

import React from 'react';
import type { CalendarEventItemDto } from '../types';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEventItemDto[];
  onSelectEvent: (event: CalendarEventItemDto) => void;
  onSelectDate: (dateStr: string) => void;
}

export function MonthView({ currentDate, events, onSelectEvent, onSelectDate }: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of current month
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Total grid cells (multiple of 7)
  const totalCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayStr = new Date().toISOString().slice(0, 10);

  const getCellDate = (cellIndex: number): Date => {
    const dayOffset = cellIndex - startingDayOfWeek + 1;
    return new Date(year, month, dayOffset);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gray-950/40 p-4 space-y-2">
      {/* Day Headers */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 border-b border-white/10 pb-2">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: totalCells }).map((_, index) => {
          const date = getCellDate(index);
          const dateStr = date.toISOString().slice(0, 10);
          const isCurrentMonth = date.getMonth() === month;
          const isToday = dateStr === todayStr;

          // Find matching events
          const dayEvents = events.filter((e) => {
            const eDateStr = new Date(e.startTime).toISOString().slice(0, 10);
            return eDateStr === dateStr;
          });

          return (
            <div
              key={index}
              onClick={() => onSelectDate(dateStr)}
              className={`min-h-[100px] rounded-xl border p-1.5 transition flex flex-col justify-between cursor-pointer ${
                isCurrentMonth
                  ? isToday
                    ? 'border-indigo-500/50 bg-indigo-950/20'
                    : 'border-white/5 bg-gray-900/40 hover:border-white/10 hover:bg-gray-900/80'
                  : 'border-transparent bg-gray-950/20 opacity-30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                    isToday ? 'bg-indigo-600 text-white' : 'text-gray-300'
                  }`}
                >
                  {date.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-[10px] text-gray-500 font-bold">{dayEvents.length}</span>
                )}
              </div>

              {/* Event Pills */}
              <div className="space-y-1 mt-1 overflow-y-auto max-h-[65px]">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(event);
                    }}
                    style={{ backgroundColor: event.color + '25', borderColor: event.color + '60' }}
                    className="truncate rounded px-1.5 py-0.5 text-[10px] font-medium border transition hover:scale-105"
                  >
                    <span className="font-bold mr-1" style={{ color: event.color }}>
                      {event.eventType === 'TASK' ? '✓' : '•'}
                    </span>
                    <span className="text-white">{event.title}</span>
                  </div>
                ))}

                {dayEvents.length > 3 && (
                  <p className="text-[9px] text-gray-400 italic pl-1">+{dayEvents.length - 3} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
