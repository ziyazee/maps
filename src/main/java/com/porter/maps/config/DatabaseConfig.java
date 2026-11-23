package com.porter.maps.config;

import javax.sql.DataSource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

@Configuration
@EnableConfigurationProperties(DatabaseProperties.class)
@ConditionalOnProperty(prefix = "app.database", name = "enabled", havingValue = "true")
public class DatabaseConfig {

    @Bean
    public DataSource dataSource(DatabaseProperties properties) {
        Assert.hasText(properties.resolvedJdbcUrl(), "Database JDBC URL must not be empty");
        Assert.hasText(properties.getUsername(), "Database username must not be empty");
        Assert.hasText(properties.getPassword(), "Database password must not be empty");

        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(properties.driverClassName());
        dataSource.setUrl(properties.resolvedJdbcUrl());
        dataSource.setUsername(properties.getUsername());

        if (StringUtils.hasText(properties.getPassword())) {
            dataSource.setPassword(properties.getPassword());
        }

        return dataSource;
    }
}
