package tn.itbs.project.event;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangementConditionsEvent {
    private Long stationId;
    private String stationNom;
    private LocalDate date;
    private Double pluiePrevue;
    private Double temperatureMax;
}
