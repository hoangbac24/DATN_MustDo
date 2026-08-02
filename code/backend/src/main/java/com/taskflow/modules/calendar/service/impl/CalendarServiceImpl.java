package com.taskflow.modules.calendar.service.impl;

import com.taskflow.common.AppException;
import com.taskflow.common.PageResponse;
import com.taskflow.common.ResultCode;
import com.taskflow.modules.calendar.dto.CalendarEventItemDto;
import com.taskflow.modules.calendar.dto.CreateCalendarEventRequest;
import com.taskflow.modules.calendar.dto.UpdateCalendarEventRequest;
import com.taskflow.modules.calendar.entity.CalendarEventEntity;
import com.taskflow.modules.calendar.mapper.CalendarMapper;
import com.taskflow.modules.calendar.repository.CalendarEventRepository;
import com.taskflow.modules.calendar.service.CalendarService;
import com.taskflow.modules.task.dto.TaskDto;
import com.taskflow.modules.task.service.TaskService;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CalendarServiceImpl implements CalendarService {

    private final CalendarEventRepository calendarEventRepository;
    private final TaskService taskService;
    private final CalendarMapper calendarMapper;

    public CalendarServiceImpl(
            CalendarEventRepository calendarEventRepository,
            TaskService taskService,
            CalendarMapper calendarMapper) {
        this.calendarEventRepository = calendarEventRepository;
        this.taskService = taskService;
        this.calendarMapper = calendarMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventItemDto> getCalendarEvents(UUID userId, Instant startDate, Instant endDate) {
        List<CalendarEventEntity> customEntities = calendarEventRepository.findUserEventsInRange(userId, startDate, endDate);
        List<CalendarEventItemDto> customDtos = customEntities.stream()
                .map(calendarMapper::toDto)
                .collect(Collectors.toList());

        List<CalendarEventItemDto> taskDtos = new ArrayList<>();
        try {
            List<TaskDto> userTasks = taskService.getTasksWithDueDateInRange(userId, startDate, endDate);
            if (userTasks != null) {
                taskDtos = userTasks.stream()
                        .map(calendarMapper::fromTask)
                        .collect(Collectors.toList());
            }
        } catch (Exception ignored) {
        }

        List<CalendarEventItemDto> combined = new ArrayList<>(customDtos);
        combined.addAll(taskDtos);
        combined.sort(Comparator.comparing(CalendarEventItemDto::getStartTime));
        return combined;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventItemDto> getDayEvents(UUID userId, String dateStr) {
        LocalDate localDate = LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
        Instant startOfDay = localDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfDay = localDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant().minusMillis(1);
        return getCalendarEvents(userId, startOfDay, endOfDay);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventItemDto> getWeekEvents(UUID userId, String startDateStr) {
        LocalDate startDate = LocalDate.parse(startDateStr, DateTimeFormatter.ISO_LOCAL_DATE);
        Instant startOfWeek = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfWeek = startDate.plusDays(7).atStartOfDay(ZoneId.systemDefault()).toInstant().minusMillis(1);
        return getCalendarEvents(userId, startOfWeek, endOfWeek);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventItemDto> getMonthEvents(UUID userId, int year, int month) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.plusMonths(1).minusDays(1);

        Instant startInstant = startOfMonth.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant endInstant = endOfMonth.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant().minusMillis(1);
        return getCalendarEvents(userId, startInstant, endInstant);
    }

    @Override
    @Transactional
    public CalendarEventItemDto createEvent(UUID userId, CreateCalendarEventRequest request) {
        CalendarEventEntity entity = new CalendarEventEntity(
                request.getTitle().trim(),
                request.getDescription(),
                request.getLocation(),
                request.getStartTime(),
                request.getEndTime(),
                userId,
                request.getTaskId(),
                request.getColor(),
                request.getIsAllDay()
        );

        CalendarEventEntity saved = calendarEventRepository.save(entity);
        return calendarMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CalendarEventItemDto getEventDetails(UUID userId, UUID eventId) {
        CalendarEventEntity entity = findActiveEventById(eventId);
        if (!entity.getUserId().equals(userId)) {
            throw new AppException(ResultCode.FORBIDDEN, "You are not authorized to view this event");
        }
        return calendarMapper.toDto(entity);
    }

    @Override
    @Transactional
    public CalendarEventItemDto updateEvent(UUID userId, UUID eventId, UpdateCalendarEventRequest request) {
        CalendarEventEntity entity = findActiveEventById(eventId);
        if (!entity.getUserId().equals(userId)) {
            throw new AppException(ResultCode.FORBIDDEN, "You are not authorized to edit this event");
        }

        entity.setTitle(request.getTitle().trim());
        entity.setDescription(request.getDescription());
        entity.setLocation(request.getLocation());
        entity.setStartTime(request.getStartTime());
        entity.setEndTime(request.getEndTime());
        entity.setTaskId(request.getTaskId());
        if (request.getColor() != null && !request.getColor().isBlank()) {
            entity.setColor(request.getColor());
        }
        if (request.getIsAllDay() != null) {
            entity.setIsAllDay(request.getIsAllDay());
        }

        CalendarEventEntity updated = calendarEventRepository.save(entity);
        return calendarMapper.toDto(updated);
    }

    @Override
    @Transactional
    public void deleteEvent(UUID userId, UUID eventId) {
        CalendarEventEntity entity = findActiveEventById(eventId);
        if (!entity.getUserId().equals(userId)) {
            throw new AppException(ResultCode.FORBIDDEN, "You are not authorized to delete this event");
        }

        entity.setIsDeleted(true);
        entity.setDeletedAt(Instant.now());
        calendarEventRepository.save(entity);
    }

    private CalendarEventEntity findActiveEventById(UUID eventId) {
        return calendarEventRepository.findByIdAndIsDeletedFalse(eventId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Calendar event not found"));
    }
}
