package tn.itbs.project.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import lombok.extern.slf4j.Slf4j;
import tn.itbs.project.entity.ProgrammeArrosage;
import tn.itbs.project.entity.Prevision;
import tn.itbs.project.feign.MeteoFeign;
import tn.itbs.project.repository.ProgrammeArrosageRepository;

@Slf4j
@Service
public class ProgrammeArrosageService {

    @Autowired
    private ProgrammeArrosageRepository programmeRepo;

    @Autowired
    private MeteoFeign meteoFeign;

    @Transactional
    public ResponseEntity<Object> ajouter(ProgrammeArrosage programme) {
        ProgrammeArrosage saved = programmeRepo.save(programme);
        log.info("Programme d'arrosage ajouté pour parcelle {}", programme.getParcelleId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Programme ajouté avec succès");
        response.put("programme", saved);
        return ResponseEntity.ok(response);
    }

    // Exemple: ajout avec météo (appel Feign)
    @Transactional
    public ResponseEntity<Object> ajouterAvecMeteo(Long stationId, ProgrammeArrosage programme) {
        String date = programme.getDatePlanifiee().toString();

        // Appel Feign : récupère une liste de prévisions
        List<Prevision> previsions = meteoFeign.getPrevisionsByStationAndDate(stationId, date);

        if (previsions != null && !previsions.isEmpty()) {
            Prevision prev = previsions.get(0); // par exemple la première

            if (prev.getPluiePrevue() != null && prev.getPluiePrevue() > 10.0) {
                Double vol = programme.getVolumePrevu();
                if (vol != null && vol > 0) {
                    programme.setVolumePrevu(vol * 0.5);
                }
            }
        }

        ProgrammeArrosage saved = programmeRepo.save(programme);
        log.info("Programme d'arrosage ajouté (météo prise en compte) pour parcelle {}", programme.getParcelleId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Programme ajouté avec succès (météo prise en compte)");
        response.put("programme", saved);
        return ResponseEntity.ok(response);
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

        ProgrammeArrosage updated = programmeRepo.save(programme);
        log.info("Programme d'arrosage modifié, id={}", id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Programme modifié avec succès");
        response.put("programme", updated);
        return ResponseEntity.ok(response);
    }

    @Transactional
    public ResponseEntity<Object> supprimer(Long id) {
        ProgrammeArrosage programme = programmeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Programme introuvable"));

        programmeRepo.delete(programme);
        log.info("Programme d'arrosage supprimé, id={}", id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Programme supprimé avec succès");
        response.put("id", id);
        return ResponseEntity.ok(response);
    }
}
