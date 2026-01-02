package tn.itbs.project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import lombok.extern.slf4j.Slf4j;
import tn.itbs.project.entity.JournalArrosage;
import tn.itbs.project.repository.JournalArrosageRepository;

@Slf4j
@Service
public class JournalArrosageService {

    @Autowired
    private JournalArrosageRepository journalRepo;

    @Transactional
    public ResponseEntity<Object> ajouter(JournalArrosage journal) {
        journalRepo.save(journal);
        log.info("Journal d'arrosage ajouté pour programme {}", journal.getProgrammeId());
        return ResponseEntity.ok("Journal ajouté avec succès");
    }

    public ResponseEntity<Object> consulter(Long id) {
        JournalArrosage journal = journalRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Journal introuvable"));
        return ResponseEntity.ok(journal);
    }

    public ResponseEntity<Object> listeParProgramme(Long programmeId) {
        List<JournalArrosage> journaux = journalRepo.findByProgrammeId(programmeId);
        return ResponseEntity.ok(journaux);
    }

    @Transactional
    public ResponseEntity<Object> supprimer(Long id) {
        JournalArrosage journal = journalRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Journal introuvable"));

        journalRepo.delete(journal);
        log.info("Journal d'arrosage supprimé, id={}", id);
        return ResponseEntity.ok("Journal supprimé avec succès");
    }
}
