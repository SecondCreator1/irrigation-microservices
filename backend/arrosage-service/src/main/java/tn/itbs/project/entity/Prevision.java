package tn.itbs.project.entity;

import lombok.Data;
import java.time.LocalDate;

@Data
public class Prevision {
    private Long id;
    private LocalDate date;
    private Double temperatureMax;
    private Double temperatureMin;
    private Double pluiePrevue;
    private Double vent;
}
