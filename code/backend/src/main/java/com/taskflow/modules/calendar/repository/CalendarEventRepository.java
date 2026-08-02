package com.taskflow.modules.calendar.repository;

import com.taskflow.modules.calendar.entity.CalendarEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEventEntity, UUID> {

    @Query("SELECT e FROM CalendarEventEntity e WHERE e.userId = :userId AND e.startTime <= :rangeEnd AND e.endTime >= :rangeStart AND e.isDeleted = false ORDER BY e.startTime ASC")
    List<CalendarEventEntity> findUserEventsInRange(
            @Param("userId") UUID userId,
            @Param("rangeStart") Instant rangeStart,
            @Param("rangeEnd") Instant rangeEnd
    );

    Optional<CalendarEventEntity> findByIdAndIsDeletedFalse(UUID id);
}
