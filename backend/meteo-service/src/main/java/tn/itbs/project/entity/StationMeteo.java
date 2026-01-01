package tn.itbs.project.entity;


import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "stations_meteo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StationMeteo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String fournisseur;

    @OneToMany(mappedBy = "station", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Prevision> previsions;
}

