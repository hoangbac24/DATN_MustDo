package com.taskflow.modules.calendar.service.impl;

import com.taskflow.modules.calendar.dto.CalendarEventDto;
import com.taskflow.modules.calendar.service.CalendarService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CalendarServiceImpl implements CalendarService {

    @Override
    public List<CalendarEventDto> getEvents() {
        return Collections.emptyList();
    }
}
