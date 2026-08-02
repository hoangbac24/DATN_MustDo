'use client';

import React from 'react';
import { Clock, MapPin, CheckSquare, Calendar as CalendarIcon } from 'lucide-react';
import type { CalendarEventItemDto } from '../types';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEventItemDto[];
  onSelectEvent: (event: CalendarEventItemDto) => void;
}

export function DayView({ currentDate, events, onSelectEvent }: DayViewProps) {
  const dateStr = currentDate.toISOString().slice(0, 10);
  const formattedHeader = currentDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const dayEvents = events.filter((e) => {
    const eDateStr = new Date(e.startTime).toISOString().slice(0, 10);
    return eDateStr === dateStr;
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-gray-950/40 p-6 space-y-4">
      <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
        <CalendarIcon className="h-5 w-5 text-indigo-400" />
        <h2 className="text-base font-bold text-white font-heading">{formattedHeader}</h2>
      </div>

      <div className="space-y-3">
        {dayEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => onSelectEvent(event)}
            style={{ backgroundColor: event.color + '15', borderColor: event.color + '40' }}
            className="flex items-start justify-between rounded-xl border p-4 text-xs transition cursor-pointer hover:border-white/20"
          >
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase"
                  style={{ backgroundColor: event.color }}
                >
                  {event.eventType}
                </span>
                <h3 className="font-bold text-sm text-white truncate">{event.title}</h3>
              </div>

              {event.description && <p className="text-gray-300 line-clamp-2">{event.description}</p>}

              <div className="flex items-center space-x-4 text-gray-400 text-[11px] pt-1">
                <span className="flex items-center">
                  <Clock className="mr-1 h-3 w-3 text-indigo-400" />
                  {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                  {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {event.location && (
                  <span className="flex items-center">
                    <MapPin className="mr-1 h-3 w-3 text-emerald-400" />
                    {event.location}
                  </span>
                )}
                {event.status && (
                  <span className="flex items-center font-semibold text-indigo-300">
                    <CheckSquare className="mr-1 h-3 w-3" />
                    {event.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {dayEvents.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-xs italic">
            No events or tasks scheduled for this day.
          </div>
        )}
      </div>
    </div>
  );
}
