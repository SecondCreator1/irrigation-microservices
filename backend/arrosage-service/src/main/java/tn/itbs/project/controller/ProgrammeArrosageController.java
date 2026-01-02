package tn.itbs.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tn.itbs.project.entity.ProgrammeArrosage;
import tn.itbs.project.service.ProgrammeArrosageService;

@RestController
@RequestMapping("/programme")
public class ProgrammeArrosageController {

    @Autowired
    private ProgrammeArrosageService programmeService;

    @PostMapping("/add")
    public ResponseEntity<Object> ajouter(@RequestBody ProgrammeArrosage programme) {
        return programmeService.ajouter(programme);
    }

    // Ajout avec météo
    @PostMapping("/add-with-meteo/{stationId}")
    public ResponseEntity<Object> ajouterAvecMeteo(@PathVariable Long stationId,
                                                   @RequestBody ProgrammeArrosage programme) {
        return programmeService.ajouterAvecMeteo(stationId, programme);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> consulter(@PathVariable Long id) {
        return programmeService.consulter(id);
    }

    @GetMapping("/parcelle/{parcelleId}")
    public ResponseEntity<Object> listeParParcelle(@PathVariable Long parcelleId) {
        return programmeService.listeParParcelle(parcelleId);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> modifier(@PathVariable Long id,
                                           @RequestBody ProgrammeArrosage programme) {
        return programmeService.modifier(id, programme);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> supprimer(@PathVariable Long id) {
        return programmeService.supprimer(id);
    }
}
