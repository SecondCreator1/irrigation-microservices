package tn.itbs.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.itbs.project.entity.JournalArrosage;

public interface JournalArrosageRepository extends JpaRepository<JournalArrosage, Long> {
    List<JournalArrosage> findByProgrammeId(Long programmeId);
}
