package tn.itbs.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tn.itbs.project.entity.JournalArrosage;
import tn.itbs.project.service.JournalArrosageService;

@RestController
@RequestMapping("/journal")
public class JournalArrosageController {

    @Autowired
    private JournalArrosageService journalService;

    @PostMapping("/add")
    public ResponseEntity<Object> ajouter(@RequestBody JournalArrosage journal) {
        return journalService.ajouter(journal);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> consulter(@PathVariable Long id) {
        return journalService.consulter(id);
    }

    @GetMapping("/programme/{programmeId}")
    public ResponseEntity<Object> listeParProgramme(@PathVariable Long programmeId) {
        return journalService.listeParProgramme(programmeId);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> supprimer(@PathVariable Long id) {
        return journalService.supprimer(id);
    }
}
