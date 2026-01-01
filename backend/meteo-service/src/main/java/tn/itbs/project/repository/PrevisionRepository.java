package tn.itbs.project.repository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import tn.itbs.project.entity.Prevision;

public interface PrevisionRepository extends JpaRepository<Prevision, Long> {
    List<Prevision> findByStationIdAndDate(Long stationId, LocalDate date);
}
