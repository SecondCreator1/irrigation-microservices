package tn.itbs.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tn.itbs.project.entity.Prevision;
import tn.itbs.project.service.PrevisionService;

import java.time.LocalDate;

@RestController
@RequestMapping("/prevision")
public class PrevisionController {

    @Autowired
    private PrevisionService previsionService;

    @PostMapping("/add/{stationId}")
    public ResponseEntity<Object> ajouter(@PathVariable Long stationId, @RequestBody Prevision prevision) {
        return previsionService.ajouter(stationId, prevision);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> consulter(@PathVariable Long id) {
        return previsionService.consulter(id);
    }

    @GetMapping("/station/{stationId}/date/{date}")
    public ResponseEntity<Object> listeParStationEtDate(@PathVariable Long stationId,
                                                        @PathVariable String date) {
        LocalDate d = LocalDate.parse(date);
        return previsionService.listeParStationEtDate(stationId, d);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> supprimer(@PathVariable Long id) {
        return previsionService.supprimer(id);
    }
}
