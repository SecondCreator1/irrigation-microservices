package tn.itbs.project.service;

import java.util.List;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import tn.itbs.project.configuration.RabbitMQConfig;
import tn.itbs.project.entity.ProgrammeArrosage;
import tn.itbs.project.event.ChangementConditionsEvent;
import tn.itbs.project.repository.ProgrammeArrosageRepository;

@Slf4j
@Service
public class ChangementConditionsListener {

    @Autowired
    private ProgrammeArrosageRepository programmeRepo;

    @RabbitListener(queues = RabbitMQConfig.CHANGEMENT_QUEUE)
    public void onChangementConditions(ChangementConditionsEvent event) {

        log.info("Événement météo reçu pour station {} date {}", event.getStationNom(), event.getDate());

        // Exemple de règle : si pluiePrévue > 10mm on réduit de 50% le volume
        if (event.getPluiePrevue() != null && event.getPluiePrevue() > 10.0) {
            // ici on simplifie: on suppose que stationId == parcelleId
            List<ProgrammeArrosage> programmes =
                    programmeRepo.findByParcelleId(event.getStationId());

            for (ProgrammeArrosage p : programmes) {
                if (p.getDatePlanifiee().equals(event.getDate())) {
                    Double vol = p.getVolumePrevu();
                    if (vol != null && vol > 0) {
                        p.setVolumePrevu(vol * 0.5);
                    }
                }
            }
            programmeRepo.saveAll(programmes);
            log.info("Programmes d'arrosage ajustés à cause de la pluie prévue");
        }
    }
}
