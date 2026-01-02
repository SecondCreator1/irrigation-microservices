package tn.itbs.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.itbs.project.entity.ProgrammeArrosage;
import java.util.List;

public interface ProgrammeArrosageRepository extends JpaRepository<ProgrammeArrosage, Long> {
    List<ProgrammeArrosage> findByParcelleId(Long parcelleId);
}
