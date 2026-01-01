package tn.itbs.project.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "programmes_arrosage")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgrammeArrosage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long parcelleId;

    @Column(nullable = false)
    private LocalDate datePlanifiee;

    private Integer duree;       // minutes
    private Double volumePrevu;  // litres

    @Enumerated(EnumType.STRING)
    private StatutProgramme statut = StatutProgramme.PREVU;

    public enum StatutProgramme {
        PREVU,
        EN_COURS,
        TERMINE,
        ANNULE
    }
}
