package tn.itbs.project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import lombok.extern.slf4j.Slf4j;
import tn.itbs.project.entity.ProgrammeArrosage;
import tn.itbs.project.repository.ProgrammeArrosageRepository;

@Slf4j
@Service
public class ProgrammeArrosageService {

    @Autowired
    private ProgrammeArrosageRepository programmeRepo;

    @Transactional
    public ResponseEntity<Object> ajouter(ProgrammeArrosage programme) {
        programmeRepo.save(programme);
        log.info("Programme d'arrosage ajouté pour parcelle {}", programme.getParcelleId());
        return ResponseEntity.ok("Programme ajouté avec succès");
    }

    public ResponseEntity<Object> consulter(Long id) {
        ProgrammeArrosage programme = programmeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Programme introuvable"));
        return ResponseEntity.ok(programme);
    }

    public ResponseEntity<Object> listeParParcelle(Long parcelleId) {
        List<ProgrammeArrosage> programmes = programmeRepo.findByParcelleId(parcelleId);
        return ResponseEntity.ok(programmes);
    }

    @Transactional
    public ResponseEntity<Object> modifier(Long id, ProgrammeArrosage newProgramme) {
        ProgrammeArrosage programme = programmeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Programme introuvable"));

        programme.setParcelleId(newProgramme.getParcelleId());
        programme.setDatePlanifiee(newProgramme.getDatePlanifiee());
        programme.setDuree(newProgramme.getDuree());
        programme.setVolumePrevu(newProgramme.getVolumePrevu());
        programme.setStatut(newProgramme.getStatut());

        programmeRepo.save(programme);
        log.info("Programme d'arrosage modifié, id={}", id);
        return ResponseEntity.ok("Programme modifié avec succès");
    }

    @Transactional
    public ResponseEntity<Object> supprimer(Long id) {
        ProgrammeArrosage programme = programmeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Programme introuvable"));

        programmeRepo.delete(programme);
        log.info("Programme d'arrosage supprimé, id={}", id);
        return ResponseEntity.ok("Programme supprimé avec succès");
    }

    @Transactional
    public ResponseEntity<Object> changerStatut(Long id) {
        ProgrammeArrosage programme = programmeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Programme introuvable"));

        if (programme.getStatut() == ProgrammeArrosage.StatutProgramme.TERMINE) {
            programme.setStatut(ProgrammeArrosage.StatutProgramme.EN_COURS);
            programmeRepo.save(programme);
            log.info("Statut du programme changé en EN_COURS, id={}", id);
            return ResponseEntity.ok("Statut changé en EN_COURS");
        } else {
            return ResponseEntity.badRequest().body("Le programme n'est pas terminé.");
        }
    }
}
