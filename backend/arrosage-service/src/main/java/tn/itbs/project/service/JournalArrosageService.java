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
import tn.itbs.project.entity.JournalArrosage;
import tn.itbs.project.repository.JournalArrosageRepository;

@Slf4j
@Service
public class JournalArrosageService {

    @Autowired
    private JournalArrosageRepository journalRepo;

    @Transactional
    public ResponseEntity<Object> ajouter(JournalArrosage journal) {
        JournalArrosage saved = journalRepo.save(journal);
        log.info("Journal d'arrosage ajouté pour programme {}", journal.getProgrammeId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Journal ajouté avec succès");
        response.put("journal", saved);
        return ResponseEntity.ok(response);
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

    public ResponseEntity<Object> listeTous() {
        List<JournalArrosage> journaux = journalRepo.findAll();
        return ResponseEntity.ok(journaux);
    }

    @Transactional
    public ResponseEntity<Object> supprimer(Long id) {
        JournalArrosage journal = journalRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Journal introuvable"));

        journalRepo.delete(journal);
        log.info("Journal d'arrosage supprimé, id={}", id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Journal supprimé avec succès");
        response.put("id", id);
        return ResponseEntity.ok(response);
    }
}
