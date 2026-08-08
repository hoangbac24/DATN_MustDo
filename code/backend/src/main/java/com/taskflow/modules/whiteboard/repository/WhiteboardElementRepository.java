package com.taskflow.modules.whiteboard.repository;

import com.taskflow.modules.whiteboard.entity.WhiteboardElementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WhiteboardElementRepository extends JpaRepository<WhiteboardElementEntity, UUID> {

    @org.springframework.data.jpa.repository.Query("SELECT e FROM WhiteboardElementEntity e WHERE e.whiteboardId = :whiteboardId ORDER BY e.zIndex ASC")
    List<WhiteboardElementEntity> findByWhiteboardIdOrderByZIndexAsc(@org.springframework.data.repository.query.Param("whiteboardId") UUID whiteboardId);

    void deleteByWhiteboardId(UUID whiteboardId);
}
