package tn.itbs.project.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import tn.itbs.project.entity.Prevision;

import java.util.List;

@FeignClient(name = "meteo-service")
public interface MeteoFeign {

    @GetMapping("/prevision/station/{stationId}/date/{date}")
    List<Prevision> getPrevisionsByStationAndDate(@PathVariable("stationId") Long stationId,
                                                  @PathVariable("date") String date); // yyyy-MM-dd
}
