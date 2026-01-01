package tn.itbs.project.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "previsions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prevision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    private Double temperatureMax;
    private Double temperatureMin;
    private Double pluiePrevue;
    private Double vent;

    @ManyToOne
    @JoinColumn(name = "station_id")
    private StationMeteo station;
}

