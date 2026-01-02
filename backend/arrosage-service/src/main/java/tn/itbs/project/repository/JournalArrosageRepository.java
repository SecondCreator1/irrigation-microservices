package tn.itbs.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.itbs.project.entity.JournalArrosage;
import java.util.List;

public interface JournalArrosageRepository extends JpaRepository<JournalArrosage, Long> {
    List<JournalArrosage> findByProgrammeId(Long programmeId);
}
