package tn.itbs.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tn.itbs.project.entity.StationMeteo;
import tn.itbs.project.service.StationMeteoService;

@RestController
@RequestMapping("/station")
public class StationMeteoController {

    @Autowired
    private StationMeteoService stationService;

    @PostMapping("/add")
    public ResponseEntity<Object> ajouter(@RequestBody StationMeteo station) {
        return stationService.ajouter(station);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> consulter(@PathVariable Long id) {
        return stationService.consulter(id);
    }

    @GetMapping("/all")
    public ResponseEntity<Object> liste() {
        return stationService.liste();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> modifier(@PathVariable Long id, @RequestBody StationMeteo station) {
        return stationService.modifier(id, station);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> supprimer(@PathVariable Long id) {
        return stationService.supprimer(id);
    }
}
