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
import tn.itbs.project.entity.StationMeteo;
import tn.itbs.project.repository.StationMeteoRepository;

@Slf4j
@Service
public class StationMeteoService {

    @Autowired
    private StationMeteoRepository stationRepo;

    @Transactional
    public ResponseEntity<Object> ajouter(StationMeteo station) {
        StationMeteo saved = stationRepo.save(station);
        log.info("Station ajoutée : {}", station.getNom());
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Station ajoutée avec succès");
        response.put("station", saved);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Object> consulter(Long id) {
        StationMeteo station = stationRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Station introuvable"));
        return ResponseEntity.ok(station);
    }

    public ResponseEntity<Object> liste() {
        List<StationMeteo> stations = stationRepo.findAll();
        return ResponseEntity.ok(stations);
    }

    @Transactional
    public ResponseEntity<Object> modifier(Long id, StationMeteo newStation) {
        StationMeteo station = stationRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Station introuvable"));

        station.setNom(newStation.getNom());
        station.setLatitude(newStation.getLatitude());
        station.setLongitude(newStation.getLongitude());
        station.setFournisseur(newStation.getFournisseur());

        StationMeteo updated = stationRepo.save(station);
        log.info("Station modifiée : {}", station.getNom());
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Station modifiée avec succès");
        response.put("station", updated);
        return ResponseEntity.ok(response);
    }

    @Transactional
    public ResponseEntity<Object> supprimer(Long id) {
        StationMeteo station = stationRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Station introuvable"));
        stationRepo.delete(station);
        log.info("Station supprimée : {}", station.getNom());
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Station supprimée avec succès");
        response.put("id", id);
        return ResponseEntity.ok(response);
    }
}
