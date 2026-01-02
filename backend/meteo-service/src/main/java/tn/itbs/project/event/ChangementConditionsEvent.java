package tn.itbs.project.event;

import lombok.*;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangementConditionsEvent implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
    private Long stationId;
    private String stationNom;
    private LocalDate date;
    private Double pluiePrevue;
    private Double temperatureMax;
}
