package tn.itbs.project.event;

import lombok.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangementConditionsEvent {
    private Long stationId;
    private String stationNom;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    
    private Double pluiePrevue;
    private Double temperatureMax;
}
