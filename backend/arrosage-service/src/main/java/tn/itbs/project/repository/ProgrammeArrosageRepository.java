package tn.itbs.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.itbs.project.entity.ProgrammeArrosage;

public interface ProgrammeArrosageRepository extends JpaRepository<ProgrammeArrosage, Long> {
    List<ProgrammeArrosage> findByParcelleId(Long parcelleId);
}
