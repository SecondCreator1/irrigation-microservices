package tn.itbs.project.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "journaux_arrosage")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JournalArrosage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long programmeId;

    private LocalDate dateExecution;

    private Double volumeReel;

    private String remarque;
}
