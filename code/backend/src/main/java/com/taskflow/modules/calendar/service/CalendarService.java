package com.taskflow.modules.calendar.service;

import com.taskflow.modules.calendar.dto.CalendarEventDto;
import java.util.List;

public interface CalendarService {
    List<CalendarEventDto> getEvents();
}
