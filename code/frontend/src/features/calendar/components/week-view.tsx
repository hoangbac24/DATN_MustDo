'use client';

import React from 'react';
import type { CalendarEventItemDto } from '../types';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEventItemDto[];
  onSelectEvent: (event: CalendarEventItemDto) => void;
  onSelectDate: (dateStr: string) => void;
}

export function WeekView({ currentDate, events, onSelectEvent, onSelectDate }: WeekViewProps) {
  // Start of week (Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="rounded-2xl border border-white/10 bg-gray-950/40 p-4">
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dateStr = day.toISOString().slice(0, 10);
          const isToday = dateStr === todayStr;

          const dayEvents = events.filter((e) => {
            const eDateStr = new Date(e.startTime).toISOString().slice(0, 10);
            return eDateStr === dateStr;
          });

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`min-h-[350px] rounded-xl border p-2 flex flex-col space-y-2 cursor-pointer transition ${
                isToday
                  ? 'border-indigo-500/50 bg-indigo-950/20'
                  : 'border-white/5 bg-gray-900/40 hover:border-white/10 hover:bg-gray-900/70'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-semibold text-gray-400">
                  {day.toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isToday ? 'bg-indigo-600 text-white' : 'text-gray-200'
                  }`}
                >
                  {day.getDate()}
                </span>
              </div>

              {/* Event Column */}
              <div className="space-y-1.5 flex-1 overflow-y-auto">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(event);
                    }}
                    style={{ backgroundColor: event.color + '25', borderColor: event.color + '60' }}
                    className="rounded-lg border p-2 text-xs space-y-1 transition hover:scale-102"
                  >
                    <div className="font-bold text-white truncate">{event.title}</div>
                    <div className="text-[10px] text-gray-400">
                      {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}

                {dayEvents.length === 0 && (
                  <p className="text-[10px] text-gray-600 italic text-center pt-4">No events</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
