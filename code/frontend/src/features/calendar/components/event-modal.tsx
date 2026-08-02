'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, AlignLeft, Palette } from 'lucide-react';
import type { CalendarEventItemDto } from '../types';
import { useCreateCalendarEvent, useUpdateCalendarEvent, useDeleteCalendarEvent } from '../hooks/use-calendar';

interface EventModalProps {
  event: CalendarEventItemDto | null;
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
}

const PRESET_COLORS = ['#4F46E5', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'];

export function EventModal({ event, isOpen, onClose, defaultDate }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [color, setColor] = useState('#4F46E5');
  const [isAllDay, setIsAllDay] = useState(false);

  const createEvent = useCreateCalendarEvent();
  const updateEvent = useUpdateCalendarEvent();
  const deleteEvent = useDeleteCalendarEvent();

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setLocation(event.location || '');
      setStartDate(event.startTime ? new Date(event.startTime).toISOString().slice(0, 16) : '');
      setEndDate(event.endTime ? new Date(event.endTime).toISOString().slice(0, 16) : '');
      setColor(event.color || '#4F46E5');
      setIsAllDay(event.isAllDay);
    } else {
      const initDate = defaultDate ? new Date(defaultDate) : new Date();
      const nextHour = new Date(initDate.getTime() + 60 * 60 * 1000);
      setTitle('');
      setDescription('');
      setLocation('');
      setStartDate(initDate.toISOString().slice(0, 16));
      setEndDate(nextHour.toISOString().slice(0, 16));
      setColor('#4F46E5');
      setIsAllDay(false);
    }
  }, [event, isOpen, defaultDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate || !endDate) return;

    const startIso = new Date(startDate).toISOString();
    const endIso = new Date(endDate).toISOString();

    if (event && event.eventType === 'CUSTOM') {
      updateEvent.mutate(
        {
          eventId: event.id,
          data: { title: title.trim(), description, location, startTime: startIso, endTime: endIso, color, isAllDay },
        },
        { onSuccess: onClose }
      );
    } else if (!event) {
      createEvent.mutate(
        { title: title.trim(), description, location, startTime: startIso, endTime: endIso, color, isAllDay },
        { onSuccess: onClose }
      );
    }
  };

  const handleDelete = () => {
    if (event && event.eventType === 'CUSTOM') {
      deleteEvent.mutate(event.id, { onSuccess: onClose });
    }
  };

  const isReadOnlyTask = event?.eventType === 'TASK';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white font-heading">
            {isReadOnlyTask ? 'Task Details' : event ? 'Edit Event' : 'Create Event'}
          </h3>
          <button onClick={onClose} className="rounded p-1 text-gray-400 hover:bg-white/5 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-400 font-medium mb-1">Title</label>
            <input
              type="text"
              required
              disabled={isReadOnlyTask}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-400 font-medium mb-1 flex items-center">
                <Clock className="mr-1 h-3 w-3" /> Start
              </label>
              <input
                type="datetime-local"
                required
                disabled={isReadOnlyTask}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-gray-900 px-2.5 py-1.5 text-white focus:border-indigo-500 focus:outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-medium mb-1 flex items-center">
                <Clock className="mr-1 h-3 w-3" /> End
              </label>
              <input
                type="datetime-local"
                required
                disabled={isReadOnlyTask}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-gray-900 px-2.5 py-1.5 text-white focus:border-indigo-500 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 font-medium mb-1 flex items-center">
              <MapPin className="mr-1 h-3 w-3" /> Location / Link
            </label>
            <input
              type="text"
              disabled={isReadOnlyTask}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Optional meeting link or room"
              className="w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-1.5 text-white focus:border-indigo-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-medium mb-1 flex items-center">
              <AlignLeft className="mr-1 h-3 w-3" /> Description
            </label>
            <textarea
              rows={2}
              disabled={isReadOnlyTask}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description..."
              className="w-full resize-none rounded-lg border border-white/10 bg-gray-900 px-3 py-1.5 text-white focus:border-indigo-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          {!isReadOnlyTask && (
            <div>
              <label className="block text-gray-400 font-medium mb-1 flex items-center">
                <Palette className="mr-1 h-3 w-3" /> Badge Color
              </label>
              <div className="flex items-center space-x-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c }}
                    className={`h-5 w-5 rounded-full transition ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            {event && event.eventType === 'CUSTOM' ? (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-red-400 hover:bg-red-600 hover:text-white transition"
              >
                Delete
              </button>
            ) : <div />}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-gray-400 hover:bg-white/5 hover:text-white transition"
              >
                Cancel
              </button>
              {!isReadOnlyTask && (
                <button
                  type="submit"
                  disabled={createEvent.isPending || updateEvent.isPending}
                  className="rounded-lg bg-indigo-600 px-4 py-1.5 font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 transition"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
