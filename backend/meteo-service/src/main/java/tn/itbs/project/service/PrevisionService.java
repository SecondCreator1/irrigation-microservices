package tn.itbs.project.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import lombok.extern.slf4j.Slf4j;
import tn.itbs.project.configuration.RabbitMQConfig;
import tn.itbs.project.entity.Prevision;
import tn.itbs.project.entity.StationMeteo;
import tn.itbs.project.event.ChangementConditionsEvent;
import tn.itbs.project.repository.PrevisionRepository;
import tn.itbs.project.repository.StationMeteoRepository;

@Slf4j
@Service
public class PrevisionService {

    @Autowired
    private PrevisionRepository previsionRepo;

    @Autowired
    private StationMeteoRepository stationRepo;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Transactional
    public ResponseEntity<Object> ajouter(Long stationId, Prevision prevision) {
        StationMeteo station = stationRepo.findById(stationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Station introuvable"));

        prevision.setStation(station);
        previsionRepo.save(prevision);

        ChangementConditionsEvent event = ChangementConditionsEvent.builder()
                .stationId(station.getId())
                .stationNom(station.getNom())
                .date(prevision.getDate())
                .pluiePrevue(prevision.getPluiePrevue())
                .temperatureMax(prevision.getTemperatureMax())
                .build();

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.CHANGEMENT_EXCHANGE,
                RabbitMQConfig.CHANGEMENT_ROUTING_KEY,
                event
        );

        return ResponseEntity.ok("Prévision ajoutée avec succès");
    }


    public ResponseEntity<Object> consulter(Long id) {
        Prevision prevision = previsionRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prévision introuvable"));
        return ResponseEntity.ok(prevision);
    }

    public ResponseEntity<Object> listeParStationEtDate(Long stationId, LocalDate date) {
        List<Prevision> previsions = previsionRepo.findByStationIdAndDate(stationId, date);
        return ResponseEntity.ok(previsions);
    }

    @Transactional
    public ResponseEntity<Object> supprimer(Long id) {
        Prevision prevision = previsionRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prévision introuvable"));

        previsionRepo.delete(prevision);
        log.info("Prévision supprimée, id={}", id);
        return ResponseEntity.ok("Prévision supprimée avec succès");
    }
}
