package com.taskflow.modules.calendar.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.calendar.dto.CalendarEventDto;
import com.taskflow.modules.calendar.service.CalendarService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/calendar")
public class CalendarController {

    private final CalendarService calendarService;

    public CalendarController(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<CalendarEventDto>>> getEvents() {
        return ResponseEntity.ok(ApiResponse.success(calendarService.getEvents()));
    }
}
