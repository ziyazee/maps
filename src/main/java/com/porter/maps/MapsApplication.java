package com.porter.maps;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(excludeName = {
        "org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration",
        "org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration"
})
public class MapsApplication {

    public static void main(String[] args) {
        SpringApplication.run(MapsApplication.class, args);
    }

}
