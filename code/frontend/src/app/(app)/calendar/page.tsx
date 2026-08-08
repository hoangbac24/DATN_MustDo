'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCalendarEvents } from '@/features/calendar/hooks/use-calendar';
import type { CalendarEventItemDto, CalendarViewMode } from '@/features/calendar/types';
import { MonthView } from '@/features/calendar/components/month-view';
import { WeekView } from '@/features/calendar/components/week-view';
import { DayView } from '@/features/calendar/components/day-view';
import { EventModal } from '@/features/calendar/components/event-modal';

export default function CalendarPage() {
  const { t: tNav } = useTranslation('navigation');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItemDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState<string | undefined>(undefined);

  // Range calculation based on currentDate (2 months padding for safety)
  const rangeStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).toISOString();
  const rangeEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0).toISOString();

  const { data: events = [], isLoading } = useCalendarEvents(rangeStart, rangeEnd);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('day');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') next.setMonth(next.getMonth() - 1);
    else if (viewMode === 'week') next.setDate(next.getDate() - 7);
    else next.setDate(next.getDate() - 1);
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') next.setMonth(next.getMonth() + 1);
    else if (viewMode === 'week') next.setDate(next.getDate() + 7);
    else next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleOpenCreateModal = (dateStr?: string) => {
    setSelectedEvent(null);
    setSelectedDateStr(dateStr);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: CalendarEventItemDto) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const formattedMonthYear = currentDate.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary font-heading">
              {tNav('menu.calendar', { defaultValue: 'Lịch công việc' })}
            </h1>
            <p className="text-xs text-text-secondary">Theo dõi sự kiện và thời hạn công việc trực quan</p>
          </div>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 rounded-xl border border-surface-border bg-surface-alt p-1">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`hidden md:inline-block rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'month' ? 'bg-primary text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Tháng
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`hidden md:inline-block rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'week' ? 'bg-primary text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Tuần
            </button>
            <button
              type="button"
              onClick={() => setViewMode('day')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'day' ? 'bg-primary text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Ngày
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleOpenCreateModal()}
            className="flex items-center space-x-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-sm transition active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm sự kiện</span>
          </button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handlePrev}
            className="rounded-lg p-1.5 border border-surface-border bg-surface text-text-secondary hover:bg-surface-alt hover:text-text-primary transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleToday}
            className="rounded-lg border border-surface-border bg-surface px-3 py-1 text-xs font-semibold text-text-primary hover:bg-surface-alt transition"
          >
            Hôm nay
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-lg p-1.5 border border-surface-border bg-surface text-text-secondary hover:bg-surface-alt hover:text-text-primary transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <span className="text-sm font-bold text-text-primary font-heading pl-2 capitalize">{formattedMonthYear}</span>
        </div>
      </div>

      {/* Active Calendar View */}
      {isLoading ? (
        <div className="h-96 animate-pulse rounded-2xl bg-surface-alt" />
      ) : (
        <>
          {viewMode === 'month' && (
            <MonthView
              currentDate={currentDate}
              events={events}
              onSelectEvent={handleSelectEvent}
              onSelectDate={(dateStr) => handleOpenCreateModal(dateStr)}
            />
          )}

          {viewMode === 'week' && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onSelectEvent={handleSelectEvent}
              onSelectDate={(dateStr) => handleOpenCreateModal(dateStr)}
            />
          )}

          {viewMode === 'day' && (
            <DayView currentDate={currentDate} events={events} onSelectEvent={handleSelectEvent} />
          )}
        </>
      )}

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultDate={selectedDateStr}
      />
    </div>
  );
}
